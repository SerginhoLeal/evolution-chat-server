import express from 'express';
import cors from 'cors';

import { Server } from "socket.io";
import { io as SocketIo } from "socket.io-client";

import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient()
const socket = SocketIo('http://localhost:3000', { transports: ['websocket'] })

app.use(express.json({ limit: '1gb' }));
app.use(cors());

let users: any[] = [];

let chats = [
  { // Songyuxinh && Adriano
    room_id: '128e1d3d-f6c6-401d-851f-1f5c94623b6e',
    destination: 'db',
    members: [
      '9615aee0-b087-493a-9c89-07cd1ddc1b66',
      'b738bf21-78ce-4b0c-a18f-eaafb2dd5db0'
    ],
    chat_messages: [
      {
        message_id: 1,
        nickname: 'songyuxinh',
        number: '5531975564133',
        message: 'quem é você na fila do pão',
        send_at: '2023-11-22 17:26:06'
      }
    ]
  },
];

app.post('/api/login-user', async(request, reply) => {
  const { name, number } = request.body;
  
  return prisma.user.findFirst({
    where: {
      name: `${name}`,
      number: `${number}`
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
});

app.post('/api/register-user', async(request, reply) => {
  const { name, number } = request.body;

  return await prisma.user.create({
    data: {
      name: `${name}`,
      number: `${number}`
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
})

app.get('/api/get-chat', async(request, reply) => {
  const { user_id, target_id } = request.query;

  return await prisma.chat.findFirst({
    where: {
      OR: [
        {
          first_member_id: `${target_id}`,
          second_member_id: `${user_id}`,
        },
        {
          first_member_id: `${user_id}`,
          second_member_id: `${target_id}`,
        }
      ]
    },
  })
    .then(success => {
      const adding_message = {
        ...success,
        chat_messages: [
          {
            number: '553197556413',
            name: 'sergio leal',
            message: 'Me contrata ai 👍'
          }
        ]
      }
      return reply.status(201).json(adding_message)
    })
    .catch(error => reply.status(404).end({ error }))
});

app.post('/api/create-chat', async(request, reply) => {
  const { user_id, target_id } = request.query;

  return await prisma.chat.create({
    data: {
      first_member_id: `${user_id}`,
      second_member_id: `${target_id}`,
      number: '0',
    }
  })
    .then(success => reply.status(201).json(success))
    .catch(error => reply.status(404).end({ error }))
})

app.post('/api/send-message', async(request, reply) => {
  // const { chat_id } = request.query as any;
  const { message } = request.body as any;

  socket.emit('sendServerMessage', {
    room: 'clpb8h07i0000di39ikvbupkw',
    userId: 'a80aa75f-69c0-48cd-b48c-ded62f12a3f5',
    message: 'Me contrata ai 👍'
  })

  return reply.status(201).send({ message: 'success' })
})

app.post('/api/webhook', async(request, reply) => {
  const body = request.body as any;

  console.log(body);

  return reply.status(201).send({ message: 'success' })
})

const express_server = app.listen({ port: 3000 })

const io = new Server(express_server, {
  cors: {
    origin: '*'
  }
});

io.on("connection", (socket) => {
  socket.on("add_new_user", ({ id, name, number }) => {
    !users.some(user => user.id === id) &&
    users.push({
      id,
      name,
      number,
      socketId: socket.id
    })

    io.emit('get_online_users', users);
  });

  socket.on("on_join_room", ({ room, userId }) => {
    socket.join(room);

    // socket.broadcast
    //   .to(room)
    //   .emit("message", {
    //     message_id: 0,
    //     number: '5531975564134',
    //     username: 'Marco',
    //     message: 'Obrigado pelo contato, logo logo atenderei você, por favor aguarde!'
    //   });
  });


  // Listen for chatMessage
  socket.on("sendMessage", (data) => {
    const user = users.find(u => u.id === data.userId);

    io.to(data.room).emit("message", {
      number: user.number,
      name: user.name,
      message: data.message
    });
  });

  socket.on("sendServerMessage", (data) => {
    const user = users.find(u => u.id === data.userId);
    
    io.to(data.room).emit("message", {
      number: user.number,
      name: user.name,
      message: data.message
    });
  });

  socket.on('disconnect', () => {
    users = users.filter(users => users.socketId !== socket.id)
    io.emit('get_online_users', users);
  });
});
