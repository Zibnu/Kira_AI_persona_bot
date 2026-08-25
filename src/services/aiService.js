const genAI = require("../config/gemini.js");

async function generateAIResponse(botName, userBio, history, userText) {
    let limitedHistory = history.length > 10 ? history.slice(-10) : history;

    const chat = genAI.chats.create({
        model: "gemini-3.7-flash",
        history: limitedHistory,
        config: {
            systemInstruction: `
            Nama kamu adalah ${botName}. Kamu mengobrol dengan user yang memiliki latar belakang/bio:
            "${userBio}". Selalu tanggapi pesan user dengan gaya bahasa persona ${botName} secara konsisten.
            `
        }
    })

    const response = await chat.sendMessage({ message: userText });

    const updateHistory = await chat.getHistory();
    return {
        reply: response.text,
        updateHistory,
    }
}

module.exports = { generateAIResponse };