const supabase = require("../config/supabase.js");

async function getUser(userId) {
    const { data } = await supabase.from("users")
                                    .select("*")
                                    .eq("user_id", userId)
                                    .single();

    return data;
}

async function createUser(userId) {
    const { data } = await supabase.from("users")
                                    .insert({
                                        user_id: userId,
                                        onboarding_status: "asking_ai_name",
                                    })
                                    .select()
                                    .single();

    return data;
}

async function updateUserStatus(userId, status, bio = null) {
    const updateData = { onboarding_status: status};
    if(bio) updateData.user_bio = bio;

    await supabase.from("uses").update(updateData).eq("user_id", userId);
}

async function upsertPersona(userId, botName) {
    await supabase.from("bot_personas").upsert({
        user_id: userId,
        bot_name: botName,
        updated_at: new Date(),
    });
}

async function getPersona(userId) {
    const { data } = await supabase.from("bot_personas")
                                    .select("*")
                                    .eq("user_id", userId)
                                    .single();

    return data;
}

async function getChatHistory(userId) {
    const { data } = await supabase.from("chat_history")
                                    .select("messages")
                                    .eq("user_id", userId)
                                    .single();

    return data?.messages || [];
}

async function saveChartHistory(userId, messages) {
    await supabase.from("chat_history").upsert({
        user_id: userId,
        messages,
        updated_at: new Date(),
    });
}

module.exports = {
    getUser,
    createUser,
    updateUserStatus,
    upsertPersona,
    getPersona,
    getChatHistory,
    saveChartHistory,
};