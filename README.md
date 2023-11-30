<img src="./assets/evolution.png" width="300"/>

The **[Evolution API](http://doc.evolution-api.com/help-center)** is a completely free project that aims to train small shopkeepers, entrepreneurs and liberal professionals, providing a `WhatsApp™` messaging solution via API.

## curl
  ```js
    curl
    --X POST http://0.0.0.0:0000/api/login-user
    --H 'Content-Type':'application/json'
    --D '{"name": "your name", "number": "553100000000"}'
  ```
  ```js
    curl
    --X POST http://0.0.0.0:0000/api/create-user
    --H 'Content-Type':'application/json'
    --D '{"name": "your name", "number": "553100000000"}'
  ```
  ```js
    curl
    --X DELETE http://0.0.0.0:0000/api/delete-user
    --H 'Content-Type':'application/json'

  ```
  ```js
    curl
    --X POST http://0.0.0.0:0000/api/create-contact
    --H 'Content-Type':'application/json'
    --D '{"name": "your name", "number": "553100000000"}'
  ```

## Prisma
  Prisma command line interface installation command:
  - yarn add prisma --dev

  Installation command for the dependency that we will use in our application:
  - yarn add @prisma/client

  Command to start Prisma:
  - npx prisma init --datasource-provider SQLite

  Command to run Prisma Studio:
  - npx prisma studio

  Command to push a new column
  - npx prisma migrate dev --name name_column --create-only

  Command to rollback
  - npx prisma migrate resolve --rolled-back 20231009113511_example

  Command to run the migration:
  - npx prisma migrate dev


```js
// types of connections
{
  event: 'connection.update',
  instance: 'whatsapp_instance_sergio',
  data: {
    instance: 'whatsapp_instance_sergio',
    state: 'connecting', // connecting | close | open
    statusReason: 200
  },
  destination: 'https://evolution-chat.onrender.com/api/send-by-whatsapp',
  date_time: '2023-11-26T16:39:30.356Z',
  server_url: 'api.whatsapp.laks.net.br',
  apikey: '7F8C7A7F-13E1-4B4F-B794-43531C50C56E'
}
```

```js
// simple conversation
{
  event: 'messages.upsert',
  instance: 'whatsapp_instance_sergio',
  data: {
    key: {
      remoteJid: '553175564133@s.whatsapp.net',
      fromMe: true,
      id: '3AA64AC482E95FF0798F'
    },
    pushName: 'Sergio Leal',
    message: {
      conversation: 'Salvei 2'
    },
    messageType: 'conversation',
    messageTimestamp: 1700835590,
    owner: 'whatsapp_instance_sergio',
    source: 'ios'
  },
  destination: 'https://evolution-chat.onrender.com/api/webhook',
  date_time: '2023-11-24T11:19:50.442Z',
  sender: '553175564133@s.whatsapp.net',
  server_url: 'api.whatsapp.laks.net.br',
  apikey: 'E7EE1ADE-1AE5-4A78-8401-A708794F765A'
}
```

```js
// simple conversation
{
  event: "messages.upsert",
  instance: "whatsapp_instance_sergio",
  data: {
    key: {
      remoteJid: "553199668527@s.whatsapp.net",
      fromMe: true,
      id: "3EB0E5226B8A631E36A06E"
    },
    pushName: "Sergio Leal",
    message: {
      extendedTextMessage: {
        text: "é assim que começa",
        contextInfo: {
          stanzaId: "2F0C1BF027EBAFBAB650D16D3C685EE1",
          participant: "553199668527@s.whatsapp.net",
          quotedMessage: {
            documentWithCaptionMessage: {
              message: {
                documentMessage: {
                  url: "https://mmg.whatsapp.net/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&mms3=true",
                  mimetype: "application/zip",
                  fileSha256: "ye+JnBblLNOsIgkh+egqHx9fIEB6/zNZOjCnEF6rOM8=",
                  fileLength: "1372777",
                  pageCount: 0,
                  mediaKey: "i5I1oPhV9a13ilYrHVFAElG66+I6fzvW3IrEb9DFlvA=",
                  fileEncSha256: "MBb6rhM9qL/iXnCKDaTHi1LanhVzQWzsUo6byNLOJao=",
                  directPath: "/v/t62.7119-24/32404363_1742509059601126_1875326626193996169_n.enc?ccb=11-4&oh=01_AdTMIgnjMCM2oT31NWHRi4tBq7m6e50M4oIvJRCBF87aXg&oe=6587ED7F&_nc_sid=5e03e0&_nc_hot=1700828779",
                  mediaKeyTimestamp: "1700784082",
                  contactVcard: false,
                  caption: "Anna Bella project zip.zip"
                }
              }
            }
          }
        },
        inviteLinkGroupTypeV2: "DEFAULT"
      }
    },
    messageType: "extendedTextMessage",
    messageTimestamp: 1700836715,
    owner: "whatsapp_instance_sergio",
    source: "android"
  },
  destination: "https://evolution-chat.onrender.com/api/webhook",
  date_time: "2023-11-24T11:38:35.955Z",
  sender: "553175564133@s.whatsapp.net",
  server_url: "api.whatsapp.laks.net.br",
  apikey: "E7EE1ADE-1AE5-4A78-8401-A708794F765A"
}
```