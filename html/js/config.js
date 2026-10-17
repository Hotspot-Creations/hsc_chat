window.CONFIG = {
  // Used when a message supplies two arguments.
  defaultTemplateId: "default",

  // Used when a message supplies one argument.
  defaultAltTemplateId: "defaultAlt",

  templates: {
    default:
      '<div class="chat-message normal">' +
        '<div class="header">' +
          '<span class="label-msg-type">{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    defaultAlt:
      '<div class="chat-message normal">' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    print:
      '<pre class="chat-message system">{0}</pre>',

    "example:important":
      '<div class="chat-message warning">' +
        '<div class="header">' +
          '<span class="label-msg-type">IMPORTANT</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    hsc:
      '<div class="chat-message system">' +
        '<div class="header">' +
          '<span class="label-msg-type">HSC</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    ooc:
      '<div class="chat-message normal">' +
        '<div class="header">' +
          '<span class="label-msg-type">OOC</span>' +
          '<span>{0} ({1})</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    oocl:
      '<div class="chat-message system">' +
        '<div class="header">' +
          '<span class="label-msg-type">LOCAL OOC</span>' +
          '<span>{0} ({1})</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    cnormal:
      '<div class="chat-message normal">' +
        '<div class="header">' +
          '<span class="label-msg-type">CHAT</span>' +
          '<span>{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    normal:
      '<div class="chat-message normal">' +
        '<div class="header">' +
          '<span class="label-msg-type">CHAT</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    report:
      '<div class="chat-message report">' +
        '<div class="header">' +
          '<span class="label-msg-type">REPORT</span>' +
          '<span>{0} ({1})</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    creport:
      '<div class="chat-message report">' +
        '<div class="header">' +
          '<span class="label-msg-type">{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    success:
      '<div class="chat-message success">' +
        '<div class="header">' +
          '<span class="label-msg-type">{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    error:
      '<div class="chat-message error">' +
        '<div class="header">' +
          '<span class="label-msg-type">{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    warning:
      '<div class="chat-message warning">' +
        '<div class="header">' +
          '<span class="label-msg-type">{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    system:
      '<div class="chat-message system">' +
        '<div class="header">' +
          '<span class="label-msg-type">HSC SYSTEM</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    advert:
      '<div class="chat-message advert">' +
        '<div class="header">' +
          '<span class="label-msg-type">ADVERTISEMENT</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    emergency:
      '<div class="chat-message emergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">EMERGENCY</span>' +
        '</div>' +
        '<span class="label-msg-txt">{0}</span>' +
      '</div>',

    "911":
      '<div class="chat-message emergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">911</span>' +
          '<span>Emergency Call #{0} | {1}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    "311":
      '<div class="chat-message nonemergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">311</span>' +
          '<span>Non-Emergency Call #{0} | {1}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    "911r":
      '<div class="chat-message emergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">911 REPLY</span>' +
          '<span>Emergency Call #{0} | {1}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    "311r":
      '<div class="chat-message nonemergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">311 REPLY</span>' +
          '<span>Non-Emergency Call #{0} | {1}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{2}</span>' +
      '</div>',

    "ems-chat":
      '<div class="chat-message emergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">EMS CHAT</span>' +
          '<span>{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    "police-chat":
      '<div class="chat-message emergency">' +
        '<div class="header">' +
          '<span class="label-msg-type">POLICE CHAT</span>' +
          '<span>{0}</span>' +
        '</div>' +
        '<span class="label-msg-txt">{1}</span>' +
      '</div>',

    showid:
      '<div class="chat-message2 advert">' +
        '<div class="label-msg">' +
          '<div class="label-msg-details">' +
            '<span class="label-msg-type">ID CARD</span>' +
          '</div>' +
          '<span>' +
            '<strong>{0}</strong><br><br>' +
            '<strong>BSN:</strong> {1}<br>' +
            '<strong>First Name:</strong> {2}<br>' +
            '<strong>Last Name:</strong> {3}<br>' +
            '<strong>Birthday:</strong> {4}<br>' +
            '<strong>Sex:</strong> {5}<br>' +
            '<strong>Height:</strong> {6}' +
          '</span>' +
        '</div>' +
      '</div>',

    showlawyer:
      '<div class="chat-message2 advert">' +
        '<div class="label-msg">' +
          '<div class="label-msg-details">' +
            '<span class="label-msg-type">LAWYER ID</span>' +
          '</div>' +
          '<span>' +
            '<strong>{0}</strong><br><br>' +
            '<strong>BSN:</strong> {1}<br>' +
            '<strong>First Name:</strong> {2}<br>' +
            '<strong>Last Name:</strong> {3}<br>' +
            '<strong>Birthday:</strong> {4}<br>' +
            '<strong>Sex:</strong> {5}<br>' +
            '<strong>Nationality:</strong> {6}' +
          '</span>' +
        '</div>' +
      '</div>',

    showdl:
      '<div class="chat-message2 advert">' +
        '<div class="label-msg">' +
          '<div class="label-msg-details">' +
            '<span class="label-msg-type">DRIVER LICENSE</span>' +
          '</div>' +
          '<span>' +
            '<strong>{0}</strong><br><br>' +
            '<strong>First Name:</strong> {1}<br>' +
            '<strong>Last Name:</strong> {2}<br>' +
            '<strong>Birthday:</strong> {3}<br>' +
            '<strong>Driving Licenses:</strong> {4}' +
          '</span>' +
        '</div>' +
      '</div>',

    showlawyerl:
      '<div class="chat-message2 advert">' +
        '<div class="label-msg">' +
          '<div class="label-msg-details">' +
            '<span class="label-msg-type">LAWYER LICENSE</span>' +
          '</div>' +
          '<span>' +
            '<strong>{0}</strong><br><br>' +
            '<strong>No-ID:</strong> {1}<br>' +
            '<strong>First Name:</strong> {2}<br>' +
            '<strong>Last Name:</strong> {3}<br>' +
            '<strong>BSN:</strong> {4}<br>' +
            '<strong>Job:</strong> {5}' +
          '</span>' +
        '</div>' +
      '</div>',
  },

  fadeTimeout: 4000,
  suggestionLimit: 5,

  style: {
    background: "transparent",
    width: "28vw",
    height: "22vh",
  },
};