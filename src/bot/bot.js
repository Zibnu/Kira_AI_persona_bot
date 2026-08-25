const { Bot } = require("grammy");
const dbService = require("../services/dbService.js");
const { handleOnBoarding } = require("./handlers/onBoardingHandler.js");
const { handleMainChat } = require("./handlers/chatHandler.js");
require("dotenv").config();

const bot = new Bot(process.env.TELE_BOT);

bot.command("start", async (ctx) => {
    const userId = ctx.from.id.toString();
    let user = await dbService.getUser(userId);

    if(!user) {
        await dbService.createUser(userId);
    } else {
        await dbService.updateUserStatus(userId, "asking_ai_name");
    }

    await ctx.reply(
        "Halo! Selamat datang.\nSiapa nama AI Asisten yang ingin kamu buat?"
    );
});

bot.on("message:text", async (ctx) => {
    const userId = ctx.from.id.toString();
    const text = ctx.message.text;

    let user = await dbService.getUser(userId);

    if(!user) {
        user = await dbService.createUser(userId);
        return ctx.reply("Halo! Selamat datang.\nSiapa nama AI Asisten yang ingin kamu buat?");
    }

    if(user.onboarding_status !== "completed") {
        return handleOnBoarding(ctx, user, text);
    } else {
        return handleMainChat(ctx, user, text);
    }
})

module.exports = bot;