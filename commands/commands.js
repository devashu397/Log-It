const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("commands")
    .setDescription("Shows the list of all available commands"),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const embed = new discord.EmbedBuilder()
      .setColor("DarkGold")
      .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
      .setTitle("Commands for Log It")
      .setDescription(
        "`set-log-channel` - Set a channel for recieving logs\n`remove-log-channel` - Remove the log channel\n`ping` - Shows the latency and uptime of the bot\n`invite` - Get a link to invite me to your server"
      )
      .setFooter({
        text: "I only have slash commands",
      });

    await interaction.reply({
      embeds: [embed],
    });
  },
};
