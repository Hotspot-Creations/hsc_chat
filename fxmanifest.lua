fx_version 'cerulean'
game 'gta5'

author 'Hotspot Creations'
description 'Customizable HSC Chat UI for FiveM'
version '1.0.1'

-- Replaces FiveM's default chat resource
provide 'chat'

ui_page 'html/index.html'

client_script 'cl_chat.lua'
server_script 'sv_chat.lua'

files {
    'html/index.html',
    'html/css/**/*',
    'html/js/**/*',
    'html/vendor/**/*'
}

-- Keep these customizable when using Asset Escrow
escrow_ignore {
    'html/css/style.css',
    'html/js/config.js'
}