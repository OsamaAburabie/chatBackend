const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
//setup express
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`The server has started on port ${PORT}`)
);

//setup mongoose
mongoose.connect(
  process.env.MONGODB_CONNECTION_STRING,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("MongoDb connection established");
  }
);

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/message", require("./routes/messageRoute"));

//==========================================================

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "https://telegram-jollychic.web.app",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("get-task", (taskId) => {
    socket.join(taskId);
    socket.on("send-message", (message) => {
      socket.broadcast.to(taskId).emit("receive-message", message);
    });
  });

  console.log("a user connected");
});
