const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true,
  },

  channelId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("server", schema);
