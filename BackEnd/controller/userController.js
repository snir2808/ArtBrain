const { v4: uuidv4 } = require("uuid");

const User = require("../models/newUser");

const timeForMessage = Math.floor(Math.random() * (4 - 1)) + 1;
const timeBetweenMessage = Math.floor(Math.random() * (10 - 5)) + 5;

const createUsers = async (req, res, next) => {
  const createUser = new User({
    userId: uuidv4(),
    timeForMessage: timeForMessage,
    timeBetweenMessage: timeBetweenMessage,
    message: [
      {
        type: "info",
        text: "Big sale next week",
      },
      {
        type: "info",
        text: "New auction next month",
      },
      {
        type: "warning",
        text: "Limited edition books for next auction",
      },
      {
        type: "success",
        text: "New books with limited edition coming next week",
      },
      {
        type: "error",
        text: "Last items with limited time offer",
      },
    ],
  });
  try {
    await createUser.save();
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ createUser });
};
exports.createUsers = createUsers;
