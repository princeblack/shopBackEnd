const OnlineUser = require('../models/OnlineUser');

const addOnlineUser = async (userId, location) => {
  try {
    const { country, region, city } = location;
    await OnlineUser.findOneAndUpdate(
      { userId },
      { country, region, city, lastActive: Date.now() },
      { upsert: true }
    );
  } catch (error) {
    console.error('Erreur lors de l’ajout d’un utilisateur en ligne:', error.message);
  }
};

const getOnlineUsers = async (req, res) => {
  try {
    const onlineUsers = await OnlineUser.find({});
    res.json(onlineUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getOnlineUsers, addOnlineUser};
