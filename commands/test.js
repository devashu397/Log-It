const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("test")
    .setDescription("Test command"),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    await interaction.reply({
      content: "Hello World!",
    });
  },
};
