const qrcode = require("qrcode-terminal");
const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Client, LocalAuth } = require("whatsapp-web.js");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  console.log(msg);

  const chat = await msg.getChat();
  const chatId = await chat.getInviteCode();

  console.log(chat);
  console.log(chatId);
});

client.initialize();

app.post("/message", async (req, res) => {
  const { inviteLink, message } = req.body;

  const { id } = await client.getInviteInfo(inviteLink);

  const chatId = id._serialized;

  client
    .sendMessage(chatId, message)
    .then(() => {})
    .catch((e) => console.log("error", e));
});

app.listen(5000, () => {
  console.log("server run on port 5000");
});

// chatId = 120363025549513678@g.us
// invite link = CGyKZqaxb0S6L5sz4RCsj5
