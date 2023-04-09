"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const uuid_1 = require("uuid");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)());
app.get('/create-room', (req, res) => {
    res.send({ roomId: (0, uuid_1.v4)() });
});
io.on('connection', (socket) => {
    socket.on('join-room', (roomId, userId, userName) => {
        socket.join(roomId);
        socket.broadcast.to(roomId).emit('user-connected', userId, userName);
    });
    socket.on('leave-room', (roomId, userId) => {
        console.log('leave-room', roomId, userId);
        socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
server.listen(5000, () => {
    console.log('Server started on port 5000');
});
