const express = require("express");
const bot = require("./src/bot/bot.js");
const webhook = require("./src/routes/webhookRoute.js");
require("dotenv").config();
const app = express();

app.use(express.json());
app.use(webhook);

app.get("/", (req, res) => {
    res.send("Server Bot AI is Runing");
})

const PORT = process.env.PORT;

    app.listen(PORT, async () => {
        console.log(`Server Is Runing on ${PORT}`);

        if(process.env.WEBHOOK_URL) {
            const fullWebhookUrl = `${process.env.WEBHOOK_URL}/telegram-webhook`;
            try {
                await bot.api.setWebhook(fullWebhookUrl);
                console.log(`Webhook telegram di daftarkan ke ${fullWebhookUrl}`);
            } catch (webhookErr) {
                console.error("Gagal Mendaftarkan webhook ke telegram", webhookErr.message);
            }
        }
    });
