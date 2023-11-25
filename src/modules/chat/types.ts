interface BodyMessageExtended {
  event: string; //'messages.upsert',
  instance: string; //'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: string; //'553196604728@s.whatsapp.net',
      fromMe: boolean; //false,
      id: string; //'8849B945438975F4C25BC0B78F24BB4F'
    },
    pushName: string; //'Maria Goreti Rosa',
    message: {
      extendedTextMessage: {
        text: string; // "é assim que começa",
        contextInfo: {
          stanzaId: string; // "2F0C1BF027EBAFBAB650D16D3C685EE1",
          participant: string; // "553199668527@s.whatsapp.net",
          quotedMessage: {
            documentWithCaptionMessage: {
              message: {
                documentMessage: {
                  url: string; // "https://mmg.whatsapp.net/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&mms3=true",
                  mimetype: string; // "application/zip",
                  fileSha256: string; // "ye+JnBblLNOsIgkh+egqHx9fIEB6/zNZOjCnEF6rOM8=",
                  fileLength: string; // "1372777",
                  pageCount: number; // 0,
                  mediaKey: string; // "i5I1oPhV9a13ilYrHVFAElG66+I6fzvW3IrEb9DFlvA=",
                  fileEncSha256: string; // "MBb6rhM9qL/iXnCKDaTHi1LanhVzQWzsUo6byNLOJao=",
                  directPath: string; // "/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&_nc_hot=1700828779",
                  mediaKeyTimestamp: string; // "1700784082",
                  contactVcard: boolean; // false,
                  caption: string; // "Anna Bella project zip.zip"
                }
              }
            }
          }
        },
        inviteLinkGroupTypeV2: string; // "DEFAULT"
      },
      messageContextInfo: {
  
      }
    },
    messageType: 'extendedTextMessage'; //'extendedTextMessage',
    messageTimestamp: number; // 1700836088,
    owner: string; //'whatsapp_instance_sergio',
    source: string; //'android'
  },
  destination: string; //'https://evolution-chat.onrender.com/api/webhook',
  date_time: string; //'2023-11-24T11:28:08.625Z',
  sender: string; //'553175564133@s.whatsapp.net',
  server_url: string; //'api.whatsapp.laks.net.br',
  apikey: string; //'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}

interface BodyMessageConversation {
  event: 'messages.upsert',
  instance: 'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: '553175564133@s.whatsapp.net',
      fromMe: true,
      id: '3AA64AC482E95FF0798F'
    },
    pushName: 'Sergio Leal',
    message: { conversation: 'Salvei 2' },
    messageType: 'conversation',
    messageTimestamp: 1700835590,
    owner: 'whatsapp_instance_sergio',
    source: 'ios'
  },
  destination: 'https://evolution-chat.onrender.com/api/webhook',
  date_time: '2023-11-24T11:19:50.442Z',
  sender: string; // '553175564133@s.whatsapp.net',
  server_url: 'api.whatsapp.laks.net.br',
  apikey: 'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}

export {
  BodyMessageConversation,
  BodyMessageExtended
}