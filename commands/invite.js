const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get a link to invite me to your server"),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(client, interaction) {
    const row = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setLabel("Invite Me")
        .setStyle(discord.ButtonStyle.Link)
        .setURL(
          "https://discord.com/api/oauth2/authorize?client_id=1040994999627681903&permissions=8&scope=applications.commands%20bot"
        )
    );

    await interaction.reply({
      content: "Click on the below button to **Invite Me**",
      components: [row],
    });
  },
};
