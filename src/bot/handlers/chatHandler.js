const dbService = require("../../services/dbService.js");
const aiService = require("../../services/aiService.js");

async function handleMainChat(ctx, user, text) {
    const userId = user.user_id;

    await ctx.replyWithChatAction("typing");

    try {
        const persona = await dbService.getPersona(userId);
        const history = await dbService.getChatHistory(userId);

        const { reply, updateHistory } = await aiService.generateAIResponse(
            persona.bot_name,
            persona.system_prompt,
            user.user_bio,
            history,
            text
        );

        await dbService.saveChartHistory(userId, updateHistory);

        try {
            await ctx.reply(reply, { parse_mode: "Markdown" });
        } catch (parseError) {
            console.warn("Markdown parse gagal, mengirim sebagai plain text:", parseError.message);
            await ctx.reply(reply);
        }
    } catch (error) {
        console.error("Gemini Error", error);
        await ctx.reply("Aduh bro sorry sistem gw error pas hubungin ke AI nya sabar ya!!");
    }
}

module.exports = { handleMainChat };