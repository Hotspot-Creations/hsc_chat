---@diagnostic disable: undefined-global
local knownCommands = {}

local function getCommandName(value)
    if type(value) ~= 'string' then
        return nil
    end

    local name = value:match('^%s*/?([^%s]+)')

    if name then
        return string.lower(name)
    end

    return nil
end

local function rememberCommand(value)
    local name = getCommandName(value)

    if name then
        knownCommands[name] = true
    end
end

local chatInputActive = false
local chatHidden = true
local chatLoaded = false

RegisterNetEvent('chatMessage')
RegisterNetEvent('chat:addTemplate')
RegisterNetEvent('chat:addMessage')
RegisterNetEvent('chat:addSuggestion')
RegisterNetEvent('chat:addSuggestions')
RegisterNetEvent('chat:removeSuggestion')
RegisterNetEvent('chat:clear')
RegisterNetEvent('__cfx_internal:serverPrint')
RegisterNetEvent('_chat:messageEntered')

local function getMessageType(messageType)
    if type(messageType) ~= 'string' then
        return 'normal'
    end

    -- Prevent invalid values from being inserted into the HTML class.
    if not messageType:match('^[%w_-]+$') then
        return 'normal'
    end

    return messageType
end

local function sendSuggestion(name, help, params)
    if type(name) ~= 'string' or name == '' then
        return
    end

    SendNUIMessage({
        type = 'ON_SUGGESTION_ADD',
        suggestion = {
            name = name,
            help = help or '',
            params = params or {}
        }
    })
end

AddEventHandler('chatMessage', function(author, messageType, text)
    if type(text) ~= 'string' or text == '' then
        return
    end

    local safeAuthor = type(author) == 'string' and author or ''
    local safeType = getMessageType(messageType)

    if safeAuthor == '' then
        SendNUIMessage({
            type = 'ON_MESSAGE',
            message = {
                template = '<div class="chat-message ' .. safeType ..
                    '"><div class="chat-message-body">{0}</div></div>',
                args = { text }
            }
        })

        return
    end

    SendNUIMessage({
        type = 'ON_MESSAGE',
        message = {
            template = '<div class="chat-message ' .. safeType ..
                '"><div class="chat-message-body"><strong>{0}:</strong> {1}</div></div>',
            args = {
                safeAuthor,
                text
            }
        }
    })
end)

AddEventHandler('__cfx_internal:serverPrint', function(message)
    SendNUIMessage({
        type = 'ON_MESSAGE',
        message = {
            templateId = 'print',
            multiline = true,
            args = { message }
        }
    })
end)

AddEventHandler('chat:addMessage', function(message)
    if type(message) ~= 'table' then
        return
    end

    SendNUIMessage({
        type = 'ON_MESSAGE',
        message = message
    })
end)

AddEventHandler('chat:addSuggestion', function(name, help, params)
    sendSuggestion(name, help, params)
    rememberCommand(name)

    if type(name) == 'string' and name:sub(1, 1) == '/' then
        sendSuggestion(name:sub(2), help, params)
    end
end)

AddEventHandler('chat:addSuggestions', function(suggestions)
    if type(suggestions) ~= 'table' then
        return
    end

    for _, suggestion in ipairs(suggestions) do
        if type(suggestion) == 'table'
            and type(suggestion.name) == 'string' then
            rememberCommand(suggestion.name)

            sendSuggestion(
                suggestion.name,
                suggestion.help,
                suggestion.params
            )

            if suggestion.name:sub(1, 1) == '/' then
                sendSuggestion(
                    suggestion.name:sub(2),
                    suggestion.help,
                    suggestion.params
                )
            end
        end
    end
end)

AddEventHandler('chat:removeSuggestion', function(name)
    if type(name) ~= 'string' then
        return
    end

    local commandName = getCommandName(name)

    if commandName then
        knownCommands[commandName] = nil
    end

    SendNUIMessage({
        type = 'ON_SUGGESTION_REMOVE',
        name = name
    })

    if name:sub(1, 1) == '/' then
        SendNUIMessage({
            type = 'ON_SUGGESTION_REMOVE',
            name = name:sub(2)
        })
    end
end)

AddEventHandler('chat:addTemplate', function(id, html)
    if type(id) ~= 'string' or type(html) ~= 'string' then
        return
    end

    SendNUIMessage({
        type = 'ON_TEMPLATE_ADD',
        template = {
            id = id,
            html = html
        }
    })
end)

RegisterNetEvent('chat:clear')
AddEventHandler('chat:clear', function()
    SendNUIMessage({
        type = 'ON_CLEAR'
    })
end)

RegisterNUICallback('chatResult', function(data, cb)
    chatInputActive = false

    SetNuiFocus(false, false)

    if not data.canceled and type(data.message) == 'string' then
        local message = data.message
            :gsub('^%s+', '')
            :gsub('%s+$', '')

        if message ~= '' then
            local explicitCommand = message:sub(1, 1) == '/'
            local commandName = getCommandName(message)
            local isKnownCommand =
                commandName and knownCommands[commandName] == true

            if explicitCommand or isKnownCommand then
                local command = message:gsub('^/+', '')
                ExecuteCommand(command)
            else
                TriggerServerEvent(
                    '_chat:messageEntered',
                    GetPlayerName(PlayerId()),
                    { 0, 153, 255 },
                    message
                )
            end
        end
    end

    cb({
        ok = true
    })
end)

local function refreshCommands()
    if not GetRegisteredCommands then
        return
    end

    local registeredCommands = GetRegisteredCommands()
    local suggestions = {}

    for _, command in ipairs(registeredCommands) do
        if command.name ~= 'chatopen'
            and IsAceAllowed(('command.%s'):format(command.name)) then
            suggestions[#suggestions + 1] = {
                name = '/' .. command.name,
                help = ''
            }

            suggestions[#suggestions + 1] = {
                name = command.name,
                help = ''
            }
        end
    end

    TriggerEvent('chat:addSuggestions', suggestions)
end

local function refreshThemes()
    local themes = {}

    for resourceIndex = 0, GetNumResources() - 1 do
        local resource = GetResourceByFindIndex(resourceIndex)

        if resource and GetResourceState(resource) == 'started' then
            local themeCount = GetNumResourceMetadata(
                resource,
                'chat_theme'
            )

            if themeCount > 0 then
                local themeName = GetResourceMetadata(
                    resource,
                    'chat_theme'
                )

                local encodedTheme = GetResourceMetadata(
                    resource,
                    'chat_theme_extra'
                )

                local themeData = json.decode(encodedTheme or 'null')

                if themeName and themeData then
                    themeData.baseUrl = 'nui://' .. resource .. '/'
                    themes[themeName] = themeData
                end
            end
        end
    end

    SendNUIMessage({
        type = 'ON_UPDATE_THEMES',
        themes = themes
    })
end

AddEventHandler('onClientResourceStart', function()
    Wait(500)
    refreshCommands()
    refreshThemes()
end)

AddEventHandler('onClientResourceStop', function(resourceName)
    if resourceName == GetCurrentResourceName() then
        chatInputActive = false
        SetNuiFocus(false, false)
        return
    end

    Wait(500)
    refreshCommands()
    refreshThemes()
end)

RegisterNUICallback('loaded', function(_, cb)
    TriggerServerEvent('chat:init')

    refreshCommands()
    refreshThemes()

    chatLoaded = true

    SendNUIMessage({
        type = 'ON_MESSAGE',
        message = {
            templateId = 'hsc',
            args = {
                'Welcome to the server!'
            }
        }
    })

    cb({
        ok = true
    })
end)

RegisterNUICallback('getPlayerInfo', function(_, cb)
    local player = PlayerId()
    local ped = PlayerPedId()
    local coordinates = GetEntityCoords(ped)

    cb({
        name = GetPlayerName(player),
        serverId = GetPlayerServerId(player),
        heading = GetEntityHeading(ped),
        coordinates = {
            x = coordinates.x,
            y = coordinates.y,
            z = coordinates.z
        }
    })
end)

RegisterCommand('chatopen', function()
    SetTextChatEnabled(false)

    if chatInputActive then
        return
    end

    chatInputActive = true

    SendNUIMessage({
        type = 'ON_OPEN'
    })

    -- Keyboard focus enabled, mouse cursor disabled.
    SetNuiFocus(true, false)

    if not chatLoaded then
        return
    end

    local shouldBeHidden =
        IsScreenFadedOut()
        or IsPauseMenuActive()

    if shouldBeHidden ~= chatHidden then
        chatHidden = shouldBeHidden

        SendNUIMessage({
            type = 'ON_SCREEN_STATE_CHANGE',
            shouldHide = shouldBeHidden
        })
    end
end, false)
RegisterKeyMapping(
    'chatopen',
    'Open HSC Chat',
    'keyboard',
    't'
)

print('^1[HSC Chat]^7 Thank you for using HSC Chat!')
