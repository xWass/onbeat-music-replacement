const {
    Client, Collection, Intents, MessageEmbed,
}=require('discord.js');
const {REST}=require("@discordjs/rest");
const {Routes}=require("discord-api-types/v9");
const fs=require('fs');
require('dotenv').config();
const chalk=require("chalk");
const {Player}=require("discord-player");

const intents=new Intents();
intents.add(
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES
);
const client=new Client({intents, partials: ['MESSAGE', 'REACTION'], allowedMentions: {parse: ['users']}});


const player=new Player(client);

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`Now playing **${ track.title }**`))






const cmds=fs.readdirSync('./cmds').filter((file) => file.endsWith('.js'));
const commands=[];
for (const file of cmds) {
    const command=require(`./cmds/${ file }`);
    commands.push(command.data.toJSON());
}


const rest=new REST({version: "9"}).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("Started refreshing application [/] commands.");

        await rest.put(
            Routes.applicationGuildCommands("930117271802773514", "992884532833423450"),
            {body: commands},
        );

        console.log("Successfully reloaded application [/] commands.");
    } catch (error) {
        console.error(error);
    }
})();

client.once('ready', async () => {
    for (const file of commandFiles) {
        console.log(`${ chalk.yellowBright('[SLASH COMMAND LOADED]') } ${ file }`);
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    const command=client.SlashCommands.get(interaction.commandName);

    if (!command) return;
    console.log(`${ chalk.yellowBright('[EVENT FIRED]') } interactionCreate with command ${ interaction.commandName }`);
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        interaction.reply({content: `${ error }`, ephemeral: true});
    }
});
client.login(process.env.TOKEN);