const express = require("express");
const http = require("http").createServer(express);
const socketIO = require("socket.io");
const crypto = require("crypto");
const mongoose = require("mongoose");
const data = require("../data.json");
const configureDB = require("../DB/DB");
const TimeSeriesModel = require("../Models/TimeSeriesModel");

configureDB();
const io = socketIO(http);

const emitterSocket = require("socket.io-client")("http://localhost:3001");

let a = 0;

const myFunction = async () => {
  const startTimestamp = new Date(); 
  const endTimestamp = new Date(startTimestamp.getTime() + 13000); 
  const data = new TimeSeriesModel({ timestamp: new Date(endTimestamp) });
  const save = await data.save();
};
if (a == 0) {
  myFunction();
  a = 1;
}
setInterval(myFunction, 59000);

function generateRandomMessage() {
  const name = data.names[Math.floor(Math.random() * data.names.length)];
  const origin = data.cities[Math.floor(Math.random() * data.cities.length)];
  const destination =
    data.cities[Math.floor(Math.random() * data.cities.length)];

  const originalMessage = { name, origin, destination };
  const secretKey = crypto
    .createHash("sha256")
    .update(JSON.stringify(originalMessage))
    .digest("hex");
  const sumCheckMessage = { ...originalMessage, secretKey };

  const passKey = 'secret123';
  const cipher = crypto.createCipher("aes-256-ctr", passKey);
  const encryptedMessage =
    cipher.update(JSON.stringify(sumCheckMessage), "utf-8", "hex") +
    cipher.final("hex");

  return encryptedMessage;
}

function sendEncryptedDataStream() {
  const numberOfMessages = Math.floor(Math.random() * (499 - 49 + 1)) + 49;
  const messages = [];

  for (let i = 0; i < numberOfMessages; i++) {
    messages.push(generateRandomMessage());
  }

  const encryptedDataStream = messages.join("|");
  emitterSocket.emit("encryptedDataStream", encryptedDataStream);
}

setInterval(() => {
  sendEncryptedDataStream();
}, 10000); 
