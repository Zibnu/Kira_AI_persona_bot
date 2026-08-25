const genAI = require("../config/gemini.js");

async function generateAIResponse({ botName, botPersona, userName, userBio, history, userText }) {
    let limitedHistory = (history.length > 10) ? history.slice(-10) : (history || []);

    const chat = genAI.chats.create({
        model: "gemini-3.1-flash-lite",
        history: limitedHistory,
        config: {
            systemInstruction: `                                                                                                                                  
                Nama kamu: ${botName}                                                                                                                                 
                Kepribadian & Karakter kamu: "${botPersona || 'Teman santai dan asik'}"                                                                               
                Nama user yang mengobrol denganmu: "${userName || 'Teman'}"
                Latar belakang user yang mengobrol denganmu: "${userBio || 'Teman'}"                                                                                  
                                                                                                                                                                      
                ATURAN CHATTING (PENTING):                                                                                                                            
                1. Selalu berbicara sesuai dengan kepribadian dan gaya bahasamu secara konsisten.                                                                     
                2. Bersikaplah seperti sedang mengobrol di Telegram/WhatsApp: santai, luwes, dan alami.                                                               
                3. HINDARI jawaban panjang yang bertele-tele seperti artikel/esai. Jika user hanya bercanda, menyapa, atau bertanya singkat, balas secara singkat (1-3
  kalimat saja) dan to-the-point.                                                                                                                                     
                4. Hanya berikan penjelasan panjang jika user secara eksplisit memintanya (misal: "jelaskan detail...", "buatkan tutorial...").                       
                5. Gunakan format Markdown Telegram (*tebal*, _miring_, \`code\`) seperlunya agar rapi.                                                               
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