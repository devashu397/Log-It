const schema = require("../schemas/server");
const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("set-log-channel")
    .setDescription("Set the log channel for your server")
    .addChannelOption((option) =>
      option
        .setName("log_channel")
        .setDescription("Select a channel")
        .setRequired(true)
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const logChannel = interaction.options.getChannel("log_channel");

    let data;
    try {
      data = await schema.findOne({
        guildId: interaction.guild.id,
      });

      if (!data) {
        data = await schema.create({
          guildId: interaction.guild.id,
          channelId: logChannel.id,
        });

        const logChannelEmbed = new discord.EmbedBuilder()
          .setColor("DarkGold")
          .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
          .setTitle("Successfully set the log channel")
          .setDescription(
            `Log channel: ${logChannel}\nSet by: ${interaction.user}`
          )
          .setTimestamp();

        await interaction.reply({
          embeds: [logChannelEmbed],
        });

        logChannel.send({
          content: `This channel has been set as the log channel for ${client.user}`,
        });
      } else {
        const alreadyEmbed = new discord.EmbedBuilder()
          .setColor("DarkGold")
          .setDescription(`You have already set the log channel`);

        await interaction.reply({
          embeds: [alreadyEmbed],
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
