const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const createChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      messsage: "UserId param not sent with request",
    });
  }

  const isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.userId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    const chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.userId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id });
      res.status(200).json(FullChat);
    } catch (error) {
      return res.status(400).json({
        messsage: error.messsage,
      });
    }
  }
};

const fetchChats = async (req, res) => {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.userId } },
    });

    if (!chats.length) {
      return res.status(400).json({
        messsage: "No chats found",
      });
    }

    const targerIds = chats
      .map((chat) => {
        return chat.users;
      })
      .map((el) => el.filter((user) => user != req.userId));

    const targetUsersInfo = await User.find({
      _id: { $in: targerIds },
    });

    //concate targetUsersInfo and chats
    const targetUsersInfoAndChats = targetUsersInfo.map((user) => {
      const userChats = chats
        .filter((chat) => {
          return chat.users.includes(user._id);
        })
        .map((chat) => {
          return {
            _id: chat._id,
            chatName: chat.chatName,
            isGroupChat: chat.isGroupChat,
            latestMessage: chat.latestMessage,
          };
        });

      return {
        targetInfo: {
          _id: user._id,
          name: user.name,
          email: user.email,
          pic: user.pic,
        },
        chatInfo: {
          chatId: userChats[0]._id,
          // isGroupChat: userChats[0].isGroupChat,
          latestMessage: userChats[0].latestMessage,
        },
      };
    });

    res.status(200).json(targetUsersInfoAndChats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  createChat,
  fetchChats,
};
