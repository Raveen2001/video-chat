import Express from 'express';
import { createServer } from 'http';

import { Server as IO } from 'socket.io';
import { v4 as UUIDv4 } from 'uuid';
import CORS from 'cors';

const app = Express();
const server = createServer(app);
const io = new IO(server, {
  cors: {
    origin: '*',
  },
});

app.use(CORS());

app.get('/create-room', (req, res) => {
  res.send({ roomId: UUIDv4() });
});

io.on('connection', (socket: any) => {
  socket.on('join-room', (roomId: string, userId: string) => {
    console.log('join-room', roomId, userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
server.listen(5000, () => {
  console.log('Server started on port 3000');
});