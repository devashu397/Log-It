const schema = require("../schemas/server");
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("remove-log-channel")
    .setDescription("Remove the log channel for your server"),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    let data;
    try {
      data = await schema.findOne({
        guildId: interaction.guild.id,
      });

      if (!data) {
        const notChannelEmbed = new discord.EmbedBuilder()
          .setColor("DarkGold")
          .setDescription("You have not set any log channel");

        await interaction.reply({
          embeds: [notChannelEmbed],
        });
      } else {
        data = await schema.deleteOne({
          guildId: interaction.guild.id,
        });

        const removeEmbed = new discord.EmbedBuilder()
          .setColor("DarkGold")
          .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
          .setTitle("Successfully removed the log channel")
          .setDescription(`Removed by: ${interaction.user}`)
          .setTimestamp();

        await interaction.reply({
          embeds: [removeEmbed],
        });
      }
    } catch (err) {
      console.log(err);
      await interaction.reply({
        content:
          "There was an error while executing this command...\nTry again later...",
        ephemeral: true,
      });
    }
  },
};
