const express = require("express");
const http = require("http").createServer(express);
const cors = require('cors')
const socketIO = require("socket.io");
const crypto = require("crypto");
const mongoose = require("mongoose");
const data = require("../data.json");
const path = require('path');
const configureDB = require("../DB/DB");
const TimeSeriesModel = require("../Models/TimeSeriesModel");
require('dotenv').config()

configureDB()

const PORT = 3001;

const app = express()
app.use(cors())
app.use(express.json())

const io = socketIO(http);

// Listener Service
io.on("connection", async (socket) => {
  console.log("Emitter connected");

  socket.on("encryptedDataStream", (encryptedDataStream) => {
    const messages = encryptedDataStream.split("|");

    messages.forEach(async (encryptedMessage) => {
      const passKey = 'secret123';
      const decipher = crypto.createDecipher("aes-256-ctr", passKey);

      const decryptedMessage =
        decipher.update(encryptedMessage, "hex", "utf-8") +
        decipher.final("utf-8");

      console.log(decryptedMessage);
      try {
        const messageObject = JSON.parse(decryptedMessage);

        const { name, origin, destination, secretKey } = messageObject;

        const calculatedSecretKey = crypto
          .createHash("sha256")
          .update(JSON.stringify({ name, origin, destination }))
          .digest("hex");

        if (calculatedSecretKey === secretKey) {
          const timestamp = new Date();
          const currentMinute = new Date(
            timestamp.getFullYear(),
            timestamp.getMonth(),
            timestamp.getDate(),
            timestamp.getHours(),
            timestamp.getMinutes()
          );

          const dataObject = { name, origin, destination, timestamp };
          const startTimestamp = new Date(timestamp.getTime()-30000);
          const endTimestamp = new Date(startTimestamp.getTime() + 60000);
          console.log(dataObject)

          console.log(startTimestamp, "start");
          console.log(endTimestamp, "end");

          const data = await TimeSeriesModel.findOneAndUpdate(
            {
              timestamp: {
                $gte:startTimestamp,
                $lt: endTimestamp,
              },
            },
            { $push: { data: dataObject } },
            { new: true }
          );
          console.log(data)
        } else {
          console.warn("Data integrity compromised. Discarding operation.");
        }
      } catch (error) {
        console.error("Error parsing decrypted message:", error);
      }
    });
  });
});



  