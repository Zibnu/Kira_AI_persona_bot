const dbService = require("../../services/dbService.js");
const aiService = require("../../services/aiService.js");
const { markdownToTelegramHtml } = require("../../utils/telegramFormatter.js");

async function handleMainChat(ctx, user, text) {
    const userId = user.user_id;

    await ctx.replyWithChatAction("typing");

    try {
        const persona = await dbService.getPersona(userId);
        const history = await dbService.getChatHistory(userId);

        const { reply, updateHistory } = await aiService.generateAIResponse({
            botName: persona.bot_name,
            botPersona: persona.system_prompt,
            userName: user.user_name,
            userBio: user.user_bio,
            history,
            userText: text,
        });

        await dbService.saveChartHistory(userId, updateHistory);

        const formattedReply = markdownToTelegramHtml(reply);

        try {
            await ctx.reply(formattedReply, { parse_mode: "HTML" });
        } catch (parseError) {
            console.warn("HTML parse gagal, mengirim sebagai plain text:", parseError.message);
            await ctx.reply(reply);
        }
    } catch (error) {
        console.error("Gemini Error", error);
        await ctx.reply("Aduh bro sorry sistem gw error pas hubungin ke AI nya sabar ya!!");
    }
}

module.exports = { handleMainChat };