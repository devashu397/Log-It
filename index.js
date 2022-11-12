const config = require("./config.json");
const schema = require("./schemas/server");
const discord = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
const mongoose = require("mongoose");

const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setActivity({
    name: "Guild members",
    type: discord.ActivityType.Watching,
  });

  mongoose
    .connect(config.mongodb_srv)
    .then(() => {
      console.log("Successfully connected to MongoDB Database");
    })
    .catch((err) => {
      console.log(err);
    });
});

client.commands = new discord.Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(client, interaction);
  } catch (err) {
    console.log(err);
    await interaction.reply({
      content:
        "There was an error while executing this command...\nTry again later...",
      ephemeral: true,
    });
  }
});

client.on("messageDelete", async (message) => {
  const messageDeleteEmbed = new discord.EmbedBuilder()
    .setColor("DarkGold")
    .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
    .setTitle("Message Deleted Log")
    .setDescription(
      `Message content:\n\`\`\`${message.content}\`\`\`\nMessage was sent in: ${message.channel}\nMessage was sent by: ${message.author}`
    )
    .setTimestamp();

  let data;
  data = await schema.findOne({
    guildId: message.guild.id,
  });

  if (!data) {
    return;
  } else {
    let channelId = data.channelId;
    let channel = client.channels.cache.get(channelId);

    channel.send({
      embeds: [messageDeleteEmbed],
    });
  }
});

client.on("messageUpdate", async (oldMessage, newMessage) => {
  const messageUpdateEmbed = new discord.EmbedBuilder()
    .setColor("DarkGold")
    .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
    .setTitle("Message Updated Log")
    .setDescription(
      `Old message content:\n\`\`\`${oldMessage.content}\`\`\`\nUpdated message content:\n\`\`\`${newMessage.content}\`\`\`\nMessage was sent in: ${newMessage.channel}\nMessage was updated by: ${newMessage.author}`
    )
    .setTimestamp();

  let data;
  data = await schema.findOne({
    guildId: newMessage.guild.id,
  });

  if (!data) {
    return;
  } else {
    let channelId = data.channelId;
    let channel = client.channels.cache.get(channelId);

    channel.send({
      embeds: [messageUpdateEmbed],
    });
  }
});

client.on("channelCreate", async (channel) => {
  const auditlog = await channel.guild.fetchAuditLogs({
    limit: 1,
  });
  const entry = auditlog.entries.first();

  const channelCreateEmbed = new discord.EmbedBuilder()
    .setColor("DarkGold")
    .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
    .setTitle("Channel Created Log")
    .setDescription(
      `Channel name: ${channel.name}\nCreated by: ${entry.executor}`
    )
    .setTimestamp();

  let data;
  data = await schema.findOne({
    guildId: channel.guild.id,
  });

  if (!data) {
    return;
  } else {
    let channelId = data.channelId;
    let channel = client.channels.cache.get(channelId);

    channel.send({
      embeds: [channelCreateEmbed],
    });
  }
});

client.on("channelDelete", async (channel) => {
  const auditlog = await channel.guild.fetchAuditLogs({
    limit: 1,
  });
  const entry = auditlog.entries.first();

  const channelDeleteEmbed = new discord.EmbedBuilder()
    .setColor("DarkGold")
    .setThumbnail(`${client.user.displayAvatarURL({ size: 512 })}`)
    .setTitle("Channel Deleted Log")
    .setDescription(
      `Channel name: ${channel.name}\nDeleted by: ${entry.executor}`
    )
    .setTimestamp();

  let data;
  data = await schema.findOne({
    guildId: channel.guild.id,
  });

  if (!data) {
    return;
  } else {
    let channelId = data.channelId;
    let channel = client.channels.cache.get(channelId);

    channel.send({
      embeds: [channelDeleteEmbed],
    });
  }
});

client.login(config.bot_token);
