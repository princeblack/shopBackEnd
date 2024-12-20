const Message = require('../models/Message');

const getMessages = async (req, res) => {
  const { userId } = req.params;
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getMessages};
