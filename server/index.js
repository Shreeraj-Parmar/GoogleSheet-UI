// import express from "express";
import { Server } from "socket.io";
// import dotEnv from "dotenv";
// import cors from 'cors';

const io = new Server(9000, {
  cors: {
    origin: "http://localhost:5173", // makesure : http://localhost:5173  instad of http://localhost:5173/ . okey..
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("connected & id is", socket.id);

  socket.on("send-changes", (delta) => {
    console.log(delta);
    io.emit("recive-changes", delta);
  });
});
