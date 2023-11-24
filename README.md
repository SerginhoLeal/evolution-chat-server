# evolution-chat-server

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

## Data
```js
  users: [
    {
      id: "05abe21d-3049-43f8-a842-5fb2af40d8f1",
      name: "serginho",
      number: "553175564133",
      created_at: "2023-11-24T11:02:11.674Z"
    },
    {
      id: "5f1aaf98-740a-466f-aaab-2c74dbfc7004",
      name: "marco",
      number: "553184106645",
      created_at: "2023-11-24T11:05:23.660Z"
    },
    {
      id: "badd34de-ae07-4c0a-9c68-aaf17f94f32d",
      name: "laura",
      number: "553171868572",
      created_at: "2023-11-24T11:06:44.839Z"
    },
    {
      id: "ecb500ed-4128-4f46-851f-61c0ed43f4f9",
      name: "luiz",
      number: "553192363441",
      created_at: "2023-11-24T11:07:27.806Z"
    }
  ]
```