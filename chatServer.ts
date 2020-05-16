import express from "express";
import { createServer } from "http";
import SocketIO from "socket.io";

const app = express();
const server = createServer(app);
const io = SocketIO(server);

const port = process.env.PORT ?? 3000;

server.listen(port, () => {
    console.log("Server listening at port", port);
});

let userCount = 0;

io.on("connection", socket => {
    let username;

    socket.once("add user", name => {
        username = name;
        userCount++;

        console.log(name, "joined");

        socket.emit("login", { userCount });
        socket.broadcast.emit("user joined", {
            username,
            userCount,
        });
    });
    socket.once("disconnect", () => {
        if (!username) return;

        userCount--;

        console.log(username, "left");

        socket.broadcast.emit("user left", {
            username,
            userCount,
        });
    });

    socket.on("new message", message => {
        console.log(username, "sent:", message);

        socket.broadcast.emit("new message", {
            username,
            message,
        });
    });
});