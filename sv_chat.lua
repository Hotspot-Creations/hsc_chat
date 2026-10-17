RegisterServerEvent('chat:init')
RegisterServerEvent('chat:addTemplate')
RegisterServerEvent('chat:addMessage')
RegisterServerEvent('chat:addSuggestion')
RegisterServerEvent('chat:removeSuggestion')
RegisterServerEvent('_chat:messageEntered')
RegisterServerEvent('chat:clear')
RegisterServerEvent('__cfx_internal:commandFallback')

AddEventHandler('_chat:messageEntered', function(author, color, message)
    local playerSource = source

    if playerSource <= 0 or type(message) ~= 'string' then
        return
    end

    message = message
        :gsub('^%s+', '')
        :gsub('%s+$', '')
        :sub(1, 256)

    if message == '' then
        return
    end

    -- Never trust the name sent by the client.
    local playerName = GetPlayerName(playerSource)

    if not playerName then
        return
    end

    -- Compatibility event for other server resources.
    TriggerEvent('chatMessage', playerSource, playerName, message)

    if WasEventCanceled() then
        return
    end

    TriggerClientEvent('chat:addMessage', -1, {
        templateId = 'cnormal',
        multiline = true,
        args = {
            playerName,
            message
        }
    })
end)

AddEventHandler('__cfx_internal:commandFallback', function(command)
    -- FiveM's +command key mappings also dispatch -command when released.
    -- Some resources (including certain admin menus) do not register an
    -- explicit release handler. Suppress the resulting cosmetic error only;
    -- do not register or override any of the resource's keybind commands.
    if type(command) == 'string' and command:match('^%-[%w_]+%s*$') then
        CancelEvent()
        return
    end

    local playerSource = source

    TriggerClientEvent('chat:addMessage', playerSource, {
        templateId = 'error',
        args = {
            'COMMAND',
            ('Unknown command: /%s'):format(command)
        }
    })

    CancelEvent()
end)

local function refreshCommands(player)
    if GetRegisteredCommands then
        local registeredCommands = GetRegisteredCommands()

        local suggestions = {}

        for _, command in ipairs(registeredCommands) do
            if IsPlayerAceAllowed(player, ('command.%s'):format(command.name)) then
                -- Add command with '/' prefix
                table.insert(suggestions, {
                    name = '/' .. command.name,
                    help = ''
                })

                -- Add command without '/' prefix
                table.insert(suggestions, {
                    name = command.name,
                    help = ''
                })
            end
        end

        TriggerClientEvent('chat:addSuggestions', player, suggestions)
    end
end

AddEventHandler('chat:init', function()
    refreshCommands(source)
end)

print('^1[HSC Chat]^7 Customized by Hotspot Creations')

AddEventHandler('onServerResourceStart', function(resName)
    Wait(500)

    for _, player in ipairs(GetPlayers()) do
        refreshCommands(player)
    end
end)

RegisterCommand('clearchat', function(source)
    if source <= 0 then
        return
    end

    TriggerClientEvent('chat:clear', source)
end, false)
