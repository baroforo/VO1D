import {
    EmbedBuilder,
    AuditLogEvent,
    ChannelType
} from "discord.js";

const LOG_CHANNEL_NAME = "📰logs";

export default function setupLogs(client) {

    async function sendLog(guild, embed) {
        if (!guild) return;

        const channel = guild.channels.cache.find(
            c =>
                c.name === LOG_CHANNEL_NAME &&
                c.type === ChannelType.GuildText
        );

        if (!channel) return;

        channel.send({ embeds: [embed] }).catch(() => {});
    }

    // =========================
    // MESSAGE DELETE
    // =========================
    client.on("messageDelete", async (message) => {
        if (!message.guild) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🗑️ Message Deleted")
            .addFields(
                { name: "Author", value: message.author?.tag || "Unknown" },
                { name: "Channel", value: message.channel?.toString() || "Unknown" },
                { name: "Content", value: message.content?.slice(0, 1024) || "No content / attachment" }
            )
            .setTimestamp();

        sendLog(message.guild, embed);
    });

    // =========================
    // MESSAGE EDIT
    // =========================
    client.on("messageUpdate", async (oldMsg, newMsg) => {
        if (!newMsg.guild) return;
        if (oldMsg.content === newMsg.content) return;

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("✏️ Message Edited")
            .addFields(
                { name: "User", value: newMsg.author?.tag || "Unknown" },
                { name: "Before", value: oldMsg.content?.slice(0, 1024) || "None" },
                { name: "After", value: newMsg.content?.slice(0, 1024) || "None" },
                { name: "Channel", value: newMsg.channel?.toString() || "Unknown" }
            )
            .setTimestamp();

        sendLog(newMsg.guild, embed);
    });

    // =========================
    // MEMBER JOIN
    // =========================
    client.on("guildMemberAdd", (member) => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("📥 Member Joined")
            .setDescription(`${member.user.tag}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp();

        sendLog(member.guild, embed);
    });

    // =========================
    // MEMBER LEAVE
    // =========================
    client.on("guildMemberRemove", (member) => {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("📤 Member Left")
            .setDescription(`${member.user.tag}`)
            .setTimestamp();

        sendLog(member.guild, embed);
    });

    // =========================
    // ROLES
    // =========================
    client.on("roleCreate", (role) => {
        const embed = new EmbedBuilder()
            .setColor("Purple")
            .setTitle("➕ Role Created")
            .setDescription(role.name)
            .setTimestamp();

        sendLog(role.guild, embed);
    });

    client.on("roleDelete", (role) => {
        const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("➖ Role Deleted")
            .setDescription(role.name)
            .setTimestamp();

        sendLog(role.guild, embed);
    });

    // =========================
    // CHANNELS
    // =========================
    client.on("channelCreate", (channel) => {
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("📁 Channel Created")
            .setDescription(channel.name)
            .setTimestamp();

        sendLog(channel.guild, embed);
    });

    client.on("channelDelete", (channel) => {
        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🗑️ Channel Deleted")
            .setDescription(channel.name)
            .setTimestamp();

        sendLog(channel.guild, embed);
    });

    client.on("channelUpdate", (oldC, newC) => {
        if (oldC.name === newC.name) return;

        const embed = new EmbedBuilder()
            .setColor("Yellow")
            .setTitle("✏️ Channel Updated")
            .addFields(
                { name: "Before", value: oldC.name },
                { name: "After", value: newC.name }
            )
            .setTimestamp();

        sendLog(newC.guild, embed);
    });

    // =========================
    // BANS
    // =========================
    client.on("guildBanAdd", (ban) => {
        const embed = new EmbedBuilder()
            .setColor("DarkRed")
            .setTitle("🔨 User Banned")
            .setDescription(ban.user.tag)
            .setTimestamp();

        sendLog(ban.guild, embed);
    });

    client.on("guildBanRemove", (ban) => {
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 User Unbanned")
            .setDescription(ban.user.tag)
            .setTimestamp();

        sendLog(ban.guild, embed);
    });

    // =========================
    // VOICE
    // =========================
    client.on("voiceStateUpdate", (oldState, newState) => {
        const member = newState.member;

        if (!oldState.channel && newState.channel) {
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("🎤 Voice Join")
                .setDescription(`${member.user.tag} joined ${newState.channel.name}`)
                .setTimestamp();

            sendLog(newState.guild, embed);
        }

        if (oldState.channel && !newState.channel) {
            const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle("🎤 Voice Leave")
                .setDescription(`${member.user.tag} left ${oldState.channel.name}`)
                .setTimestamp();

            sendLog(oldState.guild, embed);
        }
    });
}
