import express from 'express';
import cors from 'cors';

import { Server } from "socket.io";

import { routes } from './routes';

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', routes);

const express_server = app.listen(process.env.PORT, () => console.log('Server Running'));

const io = new Server(express_server, {
  cors: {
    origin: '*'
  }
});

let users: any[] = [];

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
    io.to(data.room).emit("message", {
      number: data.number,
      name: data.name,
      message: data.message
    });
  });

  socket.on("join_instance", (data) => socket.join(data.instance_room));

  socket.on("instance_connected", (data) => {
    console.log(data);
    io.to(data.instance).emit("instance_message", {
      instance: data.instance,
      message: data.message,
      status: data.status
    });
  });

  socket.on('disconnect', () => {
    users = users.filter(users => users.socketId !== socket.id)
    io.emit('get_online_users', users);
  });
});
