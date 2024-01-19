import express from 'express';
import cors from 'cors';
// import cookie from 'cookie-parser';

import { Server } from "socket.io";

import { routes } from './routes';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookie());
app.use(cors({
  origin: '*'
  // origin: 'http://localhost:5173',
  // credentials: true
}));

app.use('/api', routes);

const express_server = app.listen(process.env.PORT, () => console.log('Server Running'));

export const io = new Server(express_server, {
  cors: {
    origin: '*'
  }
});

let users: any[] = [];

io.on("connection", (socket) => {
  socket.on("users_list", (data) => {
    !users.some(user => user.number === data.number) &&
    users.push({
      id: socket.id,
      name: data.name,
      number: data.number,
    });

    io.emit('users_on', users);
  });

  socket.on("on_join_room", (data) => socket.join(data.room));

  socket.on("send_message", (data) => {
    console.log(data);

    io.emit("chat_message", data)
  });

  socket.on('disconnect', () => {
    users = users.filter(users => users.id !== socket.id)
    io.emit('users_on', users);
  });
});