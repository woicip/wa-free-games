const { Client, MessageMedia } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const axios = require('axios').default;
const chalk = require('chalk');
const apiUrl = process.argv[2];

client.on('qr', qr => {
    console.log(chalk.cyan("Please scan the QR code for getting access ..."));
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log(chalk.green('Free Games WhatsApp bot is ready to rock!'));
});

client.on('message', async (message) => {
    const from = message.from;
    const msg = message.body;
    console.log(`${chalk.magentaBright(from)}: ${msg}`);

    if(msg === '!freegames'){
        client.sendMessage(message.from, 'Memuat game gratis ...');

        const { data } = await axios.get(apiUrl);
        
        data.games.forEach(async (game) => {
            const media = await MessageMedia.fromUrl(game.cover, { unsafeMime: true });
            client.sendMessage(message.from, media, { caption: `*${game.status}*\n${game.name}\n${game.date}\n${game.url}` });
        });
    }

})

client.initialize();