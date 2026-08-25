const dbService = require("../../services/dbService");

async function handleOnBoarding(ctx, user, text) {
    const userId = user.user_id;

    if(user.onboarding_status === "asking_ai_name") {
        await dbService.upsertPersona(userId, text);
        await dbService.updateUserStatus(userId, "asking_user_info");
        return ctx.repply(
            `
            Nama AI berhasil diatur ke: *${text}*!\n\nSekarang ceritakan sedikit tentang diri kamu (nama panggilan, 
            hobi, atau profesi kamu).
            `,
            { parse_mode: "Markdown"},
        );
    }

    if(user.onboarding_status === "asking_user_info") {
        await dbService.updateUserStatus(userId, "completed", text);
        return ctx.repply(
            `Selesai! Data kamu dan persona AI sudah tersimpan.\n\nSekarang kamu bisa mulai mengobrol!`
        );
    }
}

module.exports = { handleOnBoarding };