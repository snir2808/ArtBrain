const express = require("express");
const cors = require("cors");
const db = require("./db.js");
const User = require("./models/newUser");
const port = 8463;
const dbUrl =
  "mongodb+srv://snir2808:snir28081994@cluster0.cidpk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const frontUrl = "http://localhost:3000";
const mongoose = require("mongoose");

// Hi I hope you really enjoy reading the code.
// I used Socket.io to open a "path" between the server and the client.
// This seemed to me the simplest way to perform the task.
// During the code I wrote some notes for the parts that I think need an explanation.

const main = async () => {
  try {
    await db.connect(dbUrl);
  } catch (except) {
    console.log("Error connection to DB");
    console.error(except);
    process.exit(1);
  }

  const app = express();
  app.use(
    cors({
      origin: frontUrl,
      optionsSuccessStatus: 200,
      credentials: true,
    })
  );
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
  });

  // These variables change and used in different functions
  let userId;
  let newUserId = false;

  const newUser = async (clientId) => {
    // This function is called whenever there is a new user.
    count = 0;
    if (!userId) {
      // Here I am testing to see if a new user has logged in.
      userId = clientId;
    } else if (userId !== clientId) {
      console.log("new user is here");
      newUserId = true;
      userId = clientId;
    }
    console.log("new user called");
    const timeForMessage = Math.floor(Math.random() * (5 - 1)) + 1;
    const timeBetweenMessage = Math.floor(Math.random() * (11 - 5)) + 5;
    await User.Schema.statics.create(
      // Create a new user and save it into the Database
      timeForMessage,
      timeBetweenMessage,
      clientId
    );
    handleNotifications();
  };

  let timer;
  const sendNotifications = (res, timeBetweenMessage) => {
    // Handles sending notifications, validates messages delivered to a client
    if (newUserId) {
      // Reset the notifications counter and restart due to accepting a new user
      newUserId = false;
      count = 0;
    } else {
      if (count >= res.message.length) {
        // If the user clicks the last notification the counter should reset
        count = 0;
        clearTimeout(timer);
        return handleNotifications();
      }
      timer = setTimeout(() => {
        // Additional validation for notification output
        if (
          res.message[count] !== undefined &&
          res.message[count] !== null &&
          res.message[count].read === false
        ) {
          console.log(`message sent after ${timeBetweenMessage} sec`);
          socket.emit("message", res.message[count]);
        }
        count++;
        clearTimeout(timer);
        handleNotifications();
      }, timeBetweenMessage * 1000);
    }
  };
  const handleNotifications = () => {
    // Check for user's read notifications
    User.Model.findOne({ userId: userId }, (err, res) => {
      let notReadMgs = res.message.some((msg) => msg.read === false);
      if (notReadMgs) {
        if (count >= res.message.length) {
          count = 0;
        }
        sendNotifications(res, res.timeBetweenMessage);
      } else {
        socket.emit("message", false);
        console.log("no more new notifications");
      }
    });
  };

  const socket = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });
  // Every time a new user logs in, this function is called
  socket.on("connection", async (client) => {
    console.log("client connected...");
    newUser(client.id);
    client.on("click", async (index) => {
      // Mark read notification
      count++; // Raise the counter by 1 to skip the next notification
      User.Model.findOne({ userId: userId }).then((item) => {
        item.message[index].read = true;
        item.markModified("message");
        item.save();
      });
    });
  });
};

main();

// Thank you for devoting me some of your time.
