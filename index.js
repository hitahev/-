const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// あなたのBotのトークン
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// Google Apps ScriptのWebhook URL
const WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxKQrjj5dFW4VYYMHG02K54HCZJ_LC2uck2IzYBRUmOyMWbQPbpiKQiMtvfMsUiNelH/exec';

// 対象とするチャンネルID（開発者モードでコピーしたIDをここに）
const ALLOWED_CHANNEL_ID = '1364556969058373702';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
});

client.on('ready', () => {
  console.log(`ログイン完了: ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  // 指定チャンネル以外は無視する
  if (message.channel.id !== ALLOWED_CHANNEL_ID) return;

  const payload = {
    content: message.content,
  };

  try {
    await axios.post(WEBHOOK_URL, payload);
    console.log('Google Sheetsに送信しました:', payload);

    // ✅ リアクションをつける（ここが追加部分！）
    await message.react('✅'); // 絵文字は好きなものに変えてOK
  } catch (error) {
    console.error('送信エラー:', error);
    await message.react('❌'); // エラーのときはバツマーク（任意）
  }
});

client.login(DISCORD_TOKEN);