const dbService = require("../../services/dbService.js");

async function handleOnBoarding(ctx, user, text) {
    const userId = user.user_id;

    if(user.onboarding_status === "asking_ai_name") {
        await dbService.upsertPersona(userId, text);
        await dbService.updateUserStatus(userId, "asking_ai_persona");
        return ctx.reply(
            `Nama AI diatur ke: *${text}*!\n\nSekarang tentukan *sifat/kepribadian* AI kamu.\n\nContoh:\n- _"Teman akrab yang suka bercanda dan sedikit sarkas"_\n-
            _"Partner ngobrol santai yang ramah dan suportif"_\n- _"Asisten pintar yang to-the-point dan profesional"_
            `,
            { parse_mode: "Markdown"},
        );
    }

    if(user.onboarding_status === "asking_ai_persona") {
        const persona = await dbService.getPersona(userId);
        await dbService.upsertPersona(userId, persona.bot_name, text);
        await dbService.updateUserStatus(userId, "asking_user_info");
        return ctx.reply(
            `Karakter AI berhasil disimpan!\n\nTerakhir, ceritakan sedikit tentang diri kamu (nama panggilan, hobi, atau kesibukan kamu):`,
            { parse_mode: "Markdown"}
        )
    }

    if(user.onboarding_status === "asking_user_info") {
        await dbService.updateUserStatus(userId, "completed", text);
        return ctx.reply(
            `🎉 *Selesai!* Persona AI dan profil kamu sudah aktif.\n\nSekarang kamu bisa langsung mulai mengobrol!`,
            { parse_mode: "Markdown"}
        )
    }
}

module.exports = { handleOnBoarding };