const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const getAllMessages = async (req, res) => {
  try {
    const chatId = req.params.chatId;
    // const skip = parseInt(req.query.skip);
    // const limit = 5;

    const checkChat = await Chat.find({
      _id: chatId,
      $and: [{ users: { $elemMatch: { $eq: req.userId } } }],
    });

    if (!checkChat.length) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    const targerId = checkChat[0].users.filter((user) => {
      if (user != req.userId) {
        return user;
      }
    });

    const messages = await Message.find({ chatId: chatId });
    const targetUser = await User.findOne({
      _id: targerId[0],
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.json({
      messages,
      targetUser: {
        _id: targetUser._id,
        name: targetUser.name,
        pic: targetUser.pic,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const sendMessage = async (req, res) => {
  const { chatId, content, _id, date, sender } = req.body;
  if (!chatId || !content) {
    return res.status(400).json({
      messsage: "ChatId or message not sent with request",
    });
  }

  try {
    const chat = await Chat.findOne({
      _id: chatId,
      $and: [{ users: { $elemMatch: { $eq: req.userId } } }],
    });
    if (!chat) {
      return res.status(400).json({
        messsage: "Chat not found or it doesn't belong to you",
      });
    }

    const newMessage = {
      _id,
      sender: sender,
      content: content,
      chatId: chatId,
      date,
    };

    const msg = await new Message(newMessage).save();
    chat.latestMessage = msg;
    chat.save();
    res.status(200).json(msg);
  } catch (error) {
    return res.status(400).json({
      messsage: error.messsage,
    });
  }
};

const deleteMessage = async (req, res) => {
  const { chatId, messageId } = req.body;
  if (!chatId || !messageId) {
    return res.status(400).json({
      messsage: "ChatId or messageId not sent with request",
    });
  }

  try {
    const chat = await Chat.findOne({ _id: chatId });
    if (!chat) {
      return res.status(400).json({
        messsage: "Chat not found",
      });
    }

    const tobeDeletedMsg = chat.messages.id(messageId);

    if (!tobeDeletedMsg) {
      return res.status(400).json({
        messsage: "Message not found",
      });
    }

    if (tobeDeletedMsg.sender != req.userId) {
      return res.status(400).json({
        messsage: "You are not authorized to delete this message",
      });
    }

    tobeDeletedMsg.remove();
    await chat.save();
    res.status(200).json({ message: "Message deleted", chat: tobeDeletedMsg });
  } catch (error) {
    return res.status(400).json({
      messsage: error.messsage,
    });
  }
};

const getSingleTargetInfo = async (req, res) => {
  const chatId = req.params.chatId;
  try {
    const chats = await Chat.find({
      _id: chatId,
      users: { $elemMatch: { $eq: req.userId } },
    });

    if (!chats.length) {
      return res.status(400).json({
        messsage: "No chats found",
      });
    }

    const targetUserId = chats[0].users.filter((user) => {
      if (user != req.userId) {
        return user;
      }
    });

    const targetUser = await User.findOne({
      _id: targetUserId[0],
    });

    if (!targetUser) {
      return res.status(400).json({
        messsage: "User not found",
      });
    }

    res.status(200).json({
      targetInfo: {
        _id: targetUser._id,
        name: targetUser.name,
        pic: targetUser.pic,
        email: targetUser.email,
      },
    });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

module.exports = {
  sendMessage,
  deleteMessage,
  getAllMessages,
  getSingleTargetInfo,
};
