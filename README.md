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


User
Profile
Friend
Room
Message

User 1:1 Profile
Profile N:1 Friend
Friend N:1 


<!-- 

{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:48.643Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:48.667Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",     
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:51.673Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:51.647Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:52.849Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:52.898Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:55.484Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:55.506Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:59.204Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:12:59.227Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:01.320Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:01.362Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:06.502Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:06.538Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:10.669Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:10.694Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:12.829Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:12.852Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:13.128Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:13.149Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:13.926Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:13.965Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:17.301Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:17.322Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:17.789Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:17.817Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:22.228Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:22.257Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:24.918Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:24.896Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:29.615Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:29.639Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "messages.upsert",
     "instance": "instance_3_553175564133",
     "data": {
          "key": {
               "remoteJid": "553191819932@s.whatsapp.net",
               "fromMe": false,
               "id": "3A7C22C9A23CAFAD7108"
          },
          "pushName": "Leila Fernanda",
          "message": {
               "stickerMessage": {
                    "url": "https://mmg.whatsapp.net/v/t62.15575-24/28900053_895734781936994_8068176427791166000_n.enc?ccb=11-4&oh=01_AdTrIPbvVAdFwMYapDDtZWqlxVm9RhU8yfbjTa1oktunCQ&oe=65D21874&_nc_sid=5e03e0&mms3=true",
                    "fileSha256": "z8PtfA+gQgvSoYrY0wygSrtOhGSMjQBRhUURaUqG+3s=",
                    "fileEncSha256": "Eu9+kZakY+1jzDz1P47KeRmfHGlTq+417p5xawhUVd0=",
                    "mediaKey": "eB48MQJh1kNJvxINClKhnjnALnEn2QRAFP1mM0fCyjU=",
                    "mimetype": "image/webp",
                    "directPath": "/v/t62.15575-24/28900053_895734781936994_8068176427791166000_n.enc?ccb=11-4&oh=01_AdTrIPbvVAdFwMYapDDtZWqlxVm9RhU8yfbjTa1oktunCQ&oe=65D21874&_nc_sid=5e03e0",
                    "fileLength": "35216",
                    "mediaKeyTimestamp": "1705671069",
                    "isAnimated": false,
                    "stickerSentTs": "1705684409022",
                    "isAvatar": false
               },
               "messageContextInfo": {
                    "deviceListMetadata": {
                         "senderTimestamp": "1705675528",
                         "recipientKeyHash": "mlFwLjPVjSGbYQ==",
                         "recipientTimestamp": "1705684155",
                         "recipientKeyIndexes": [
                              107
                         ]
                    },
                    "deviceListMetadataVersion": 2
               }
          },
          "messageType": "stickerMessage",
          "messageTimestamp": 1705684409,
          "owner": "instance_3_553175564133",
          "source": "ios"
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:29.892Z",
     "sender": "553175564133@s.whatsapp.net",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:31.173Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:31.197Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:36.374Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:36.395Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:36.665Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:36.688Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:39.983Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:40.016Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "messages.upsert",
     "instance": "instance_3_553175564133",
     "data": {
          "key": {
               "remoteJid": "553191819932@s.whatsapp.net",
               "fromMe": false,
               "id": "3A295BE2718D89DEC07C"
          },
          "pushName": "Leila Fernanda",
          "message": {
               "conversation": "Mmmmmmmmmmmmmmmmm",
               "messageContextInfo": {
                    "deviceListMetadata": {
                         "senderTimestamp": "1705675528",
                         "recipientKeyHash": "mlFwLjPVjSGbYQ==",
                         "recipientTimestamp": "1705684155",
                         "recipientKeyIndexes": [
                              107
                         ]
                    },
                    "deviceListMetadataVersion": 2
               }
          },
          "messageType": "conversation",
          "messageTimestamp": 1705684420,
          "owner": "instance_3_553175564133",
          "source": "ios"
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:40.752Z",
     "sender": "553175564133@s.whatsapp.net",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:40.959Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:40.985Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:46.255Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:46.277Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:46.808Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:46.835Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "messages.upsert",
     "instance": "instance_3_553175564133",
     "data": {
          "key": {
               "remoteJid": "553191819932@s.whatsapp.net",
               "fromMe": false,
               "id": "3A6687C4331054C34F0F"
          },
          "pushName": "Leila Fernanda",
          "message": {
               "conversation": "Eu te amo",
               "messageContextInfo": {
                    "deviceListMetadata": {
                         "senderTimestamp": "1705675528",
                         "recipientKeyHash": "mlFwLjPVjSGbYQ==",
                         "recipientTimestamp": "1705684155",
                         "recipientKeyIndexes": [
                              107
                         ]
                    },
                    "deviceListMetadataVersion": 2
               }
          },
          "messageType": "conversation",
          "messageTimestamp": 1705684429,
          "owner": "instance_3_553175564133",
          "source": "ios"
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:49.253Z",
     "sender": "553175564133@s.whatsapp.net",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:50.420Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:50.444Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:52.619Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:52.642Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:56.769Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:13:56.790Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:01.544Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:01.569Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:02.155Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:02.180Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:05.405Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:05.428Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:06.859Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:06.881Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "messages.upsert",
     "instance": "instance_3_553175564133",
     "data": {
          "key": {
               "remoteJid": "553191819932@s.whatsapp.net",
               "fromMe": false,
               "id": "3AE2973B208DFC7A642D"
          },
          "pushName": "Leila Fernanda",
          "message": {
               "imageMessage": {
                    "url": "https://mmg.whatsapp.net/o1/v/t62.7118-24/f1/m238/up-oil-image-566a07a3-c699-4b60-82cd-2a2b409650af?ccb=9-4&oh=01_AdQNH3-u5TLP0RYLWbggKf1nyC2o7kEhVP4ZbmfhVFabmw&oe=65D209AF&_nc_sid=000000&mms3=true",
                    "mimetype": "image/jpeg",
                    "fileSha256": "hBIz7qzWOK3CNq7z4ku/vEuLC0nHC/PCkdXjcy/EHYs=",
                    "fileLength": "255244",
                    "height": 1600,
                    "width": 900,
                    "mediaKey": "+1GUGiQ2V3bl5x3WbwBtEWTHGqbSsDoxipWuGt7fjsU=",
                    "fileEncSha256": "B/ud153aQz175OmzECcuRt6rbDZUUmUqw/ORzJaFUqM=",
                    "directPath": "/o1/v/t62.7118-24/f1/m238/up-oil-image-566a07a3-c699-4b60-82cd-2a2b409650af?ccb=9-4&oh=01_AdQNH3-u5TLP0RYLWbggKf1nyC2o7kEhVP4ZbmfhVFabmw&oe=65D209AF&_nc_sid=000000",
                    "mediaKeyTimestamp": "1705684445",
                    "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABsSFBcUERsXFhceHBsgKEIrKCUlKFE6PTBCYFVlZF9VXVtqeJmBanGQc1tdhbWGkJ6jq62rZ4C8ybqmx5moq6T/2wBDARweHigjKE4rK06kbl1upKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKSkpKT/wgARCABIACkDASIAAhEBAxEB/8QAGQABAQADAQAAAAAAAAAAAAAAAwQAAgUB/8QAFgEBAQEAAAAAAAAAAAAAAAAAAQIA/9oADAMBAAIQAxAAAAAtKQiyQlNWCw56AuKT1y0yoSi5Y9pKhaebuPUHXpjyh09uRQvRvQ5dm8zEnLMx0zzCv//EABgRAQEAAwAAAAAAAAAAAAAAABABESBB/9oACAECAQE/AG6WGXr/AP/EABkRAAMAAwAAAAAAAAAAAAAAAAABEBEgQf/aAAgBAwEBPwCrRRKZORH/xAApEAACAgECBQMEAwAAAAAAAAABAgADEQQSEyExQVEFFGEjUoGRQmKx/9oACAEBAAE/AGSFnXoYbmHUSjm2TBhVyZ7tf6/uOssGATjMYZ5zTh3fbUMt/kKb6yr/AJh06Z6SyO2wEEZ3CEZE9FKgNnz1hI3uB5mxfMuEuCsNx8YEHTE9IG6xl+ZYu25x8zl5ljS+7YD3E09wsBB7T063h3OQRyOZZYbbGZWHObG+5v1LbMjxLlPDBz1MX6LnvNNaOK4P8hNAoQsjeczf8T2hZc8defaXUPtCl+hllZawgGaarZqEyR1moL6fVluoM98fslmSQcmC0CsrYSfBhuIGEyfmVFmsG4zV5ZUOe0/MThumCMRKKHXBBHzLtOaxkHKeYpwRiJi2kZ7ThCf//gADAP/Z",
                    "firstScanSidecar": "5OovldQ2kmMaKw==",
                    "firstScanLength": 14638,
                    "scansSidecar": "5OovldQ2kmMaKzv+CSWXtXATvmciP3189F1RyWSHYE0hEM65MWnQHw==",
                    "scanLengths": [
                         14638,
                         74352,
                         62474,
                         103778
                    ],
                    "midQualityFileSha256": "WHR0SJCEyVR0brWpUuhPKL1HMe4dwZPOrwQQBBA71kc="
               },
               "messageContextInfo": {
                    "deviceListMetadata": {
                         "senderTimestamp": "1705675528",
                         "recipientKeyHash": "mlFwLjPVjSGbYQ==",
                         "recipientTimestamp": "1705684155",
                         "recipientKeyIndexes": [
                              107
                         ]
                    },
                    "deviceListMetadataVersion": 2
               }
          },
          "messageType": "imageMessage",
          "messageTimestamp": 1705684448,
          "owner": "instance_3_553175564133",
          "source": "ios"
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:08.593Z",
     "sender": "553175564133@s.whatsapp.net",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "BA6D7E42-ED6C-4182-BF8C-D70F964C2BCB"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:11.152Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:11.173Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "close",
          "statusReason": 405
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:14.310Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}
{
     "event": "connection.update",
     "instance": "instance_sergio_socket",
     "data": {
          "instance": "instance_sergio_socket",
          "state": "connecting",
          "statusReason": 200
     },
     "destination": "https://1c09-177-55-225-167.ngrok-free.app/api/message-by-whatsapp",
     "date_time": "2024-01-19T14:14:14.335Z",
     "server_url": "api.whatsapp.laks.net.br",
     "apikey": "C77DDA3E-CE0C-4B98-A7A0-999935C87391"
}

sergi@DESKTOP-DMK4PK2 MINGW64 /c/Users/www/projects/evolution/server (main)
$


 -->