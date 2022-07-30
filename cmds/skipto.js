const {SlashCommandBuilder}=require('@discordjs/builders');
const {
    MessageEmbed, Modal, MessageActionRow, TextInputComponent, MessageButton,
}=require('discord.js');
const chalk=require('chalk');

require("discord-player/smoothVolume");

module.exports={
    data: new SlashCommandBuilder()
        .setName('skipto')
        .setDescription('Skip to a song!')
        .addIntegerOption((option) => option
            .setName('number')
            .setRequired(true)
            .setDescription('Track number.')),

    async execute(interaction, client, player) {
        let vol=interaction.options.getInteger('number');

        if (!interaction.member.voice.channelId) return await interaction.reply({
            embeds: [{
                title: "You are not in a voice channel!",
                color: 0xFF0000
            }],
            ephemeral: true
        });
        if (interaction.guild.me.voice.channelId&&interaction.member.voice.channelId!==interaction.guild.me.voice.channelId) return await interaction.reply({
            embeds: [{
                title: "You are not in my voice channel!",
                color: 0xFF0000
            }],
            ephemeral: true
        });

        let q=player.getQueue(`${ interaction.guild.id }`);
        let max=q.tracks.length;
        let min=1

        if (vol<min||vol>max) return await interaction.reply({
            embeds: [{
                title: "Invalid track position!",
                color: 0xFF0000
            }],
            ephemeral: true
        });

        if (!q||q===undefined||q.length===0) return await interaction.reply({
            embeds: [{
                title: "Nothing is playing!",
                color: 0x00ff00,
            }],
            ephemeral: true
        });

        interaction.reply({
            embeds: [{
                title: `Skipped to track number ${vol}`,
                color: 0x00ff00,
            }],
            ephemeral: true
        });
        await q.skipTo(vol-1);
    },
};
