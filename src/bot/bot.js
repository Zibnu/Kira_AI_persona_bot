const { Bot } = require("grammy");
const dbService = require("../services/dbService.js");
const { handleOnBoarding } = require("./handlers/onBoardingHandler.js");
const { handleMainChat } = require("./handlers/chatHandler.js");
require("dotenv").config();

const bot = new Bot(process.env.TELE_BOT);

bot.command("start", async (ctx) => {
    const userId = ctx.from.id.toString();
    try {
        let user = await dbService.getUser(userId);

        if(!user) {
            await dbService.createUser(userId);
        } else {
            await dbService.updateUserStatus(userId, "asking_ai_name");
        }

        await ctx.reply(
            "Halo! Selamat datang.\nSiapa nama AI Asisten yang ingin kamu buat?"
    );
    } catch (error) {
        console.error("/start: Error", error);
        await ctx.reply("Terjadi kesalahan saat memulai bot silahkan untuk mencoba kembali");
    }
});

bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;

    try {
        let user = await dbService.getUser(userId);
        console.log(`User ${user}`);

        if(!user) {
            user = await dbService.createUser(userId);
        }

        if(user.onboarding_status !== "completed") {
            return await handleOnBoarding(ctx, user, text);
        }

        return handleMainChat(ctx, user, text);
    } catch (error) {
        console.error("message handler Error", error);
        await ctx.reply("Terjadi masalah teknis, silahkan coba beberapa saat lagi.");
    }
})

module.exports = bot;