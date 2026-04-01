const Message = require("../models/message.model");

exports.getMessagesWithUser = async (req, res) => {
  try {
    const currentUser = req.user._id;
    const userID = req.params.userID;

    const messages = await Message.find({
      $or: [
        { from: currentUser, to: userID },
        { from: userID, to: currentUser },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("from to", "username fullName");

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createMessage = async (req, res) => {
  try {
    const from = req.user._id;
    const to = req.body.to;

    const type =
  req.body["messageContent[type]"] || req.body.messageContent?.type;

let text =
  req.body["messageContent[text]"] || req.body.messageContent?.text;

    // 👉 nếu là file
    if (type === "file" && req.files && req.files.file) {
      text = req.files.file[0].path;
    }

    const message = await Message.create({
      from,
      to,
      messageContent: {
        type,
        text,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLastMessages = async (req, res) => {
  try {
    const currentUser = req.user._id;

    const lastMessages = await Message.aggregate([
      {
        $match: {
          $or: [{ from: currentUser }, { to: currentUser }],
        },
      },
      { $sort: { createdAt: -1 } },

      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$from", currentUser] },
              then: "$to",
              else: "$from",
            },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },

      {
        $replaceRoot: { newRoot: "$lastMessage" },
      },
    ]).sort({ createdAt: -1 });

    await Message.populate(lastMessages, {
      path: "from to",
      select: "username fullName",
    });

    res.json(lastMessages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
