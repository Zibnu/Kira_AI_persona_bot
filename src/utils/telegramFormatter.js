/**
 * Escape karakter khusus HTML untuk Telegram API
 * @param {string} text 
 * @returns {string}
 */
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

/**
 * Mengonversi output Markdown standar (CommonMark/GFM) dari AI 
 * menjadi format HTML yang aman dan didukung oleh Telegram API.
 * 
 * @param {string} markdown - Teks markdown mentah dari AI
 * @returns {string} - Teks terformat HTML untuk Telegram parse_mode: "HTML"
 */
function markdownToTelegramHtml(markdown) {
    if (!markdown || typeof markdown !== "string") return "";

    // 1. Simpan code block (```lang ... ``` atau ``` ... ```)
    const codeBlocks = [];
    let text = markdown.replace(/```(?:(\w+)\r?\n)?([\s\S]*?)```/g, (match, lang, code) => {
        const index = codeBlocks.length;
        const escapedCode = escapeHtml(code.trim());
        const langAttr = lang ? ` class="language-${escapeHtml(lang)}"` : "";
        codeBlocks.push(`<pre><code${langAttr}>${escapedCode}</code></pre>`);
        return `\uFFF0CODEBLOCK${index}\uFFF0`;
    });

    // 2. Simpan inline code (`code`)
    const inlineCodes = [];
    text = text.replace(/`([^`\r\n]+)`/g, (match, code) => {
        const index = inlineCodes.length;
        inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
        return `\uFFF0INLINECODE${index}\uFFF0`;
    });

    // 3. Escape HTML pada sisa teks biasa
    text = escapeHtml(text);

    // 4. Ubah Markdown Header (# Header, ## Header, dst.) -> <b>Header</b>
    text = text.replace(/^#{1,6}\s+(.+)$/gm, "<b>$1</b>");

    // 5. Ubah Bullet points (* atau - di awal baris) -> simbol bullet Unicode (•)
    text = text.replace(/^[\t ]*[\*\-]\s+/gm, "• ");

    // 6. Ubah Bold + Italic: ***text*** -> <b><i>text</i></b>
    text = text.replace(/\*\*\*(.*?)\*\*\*/g, "<b><i>$1</i></b>");

    // 7. Ubah Bold: **text** atau __text__ -> <b>text</b>
    text = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
    text = text.replace(/__(.*?)__/g, "<b>$1</b>");

    // 8. Ubah Italic: *text* atau _text_ -> <i>text</i>
    text = text.replace(/(?<!\w)\*([^*\r\n]+?)\*(?!\w)/g, "<i>$1</i>");
    text = text.replace(/(?<!\w)_([^_\r\n]+?)_(?!\w)/g, "<i>$1</i>");

    // 9. Ubah Strikethrough: ~~text~~ -> <s>text</s>
    text = text.replace(/~~(.*?)~~/g, "<s>$1</s>");

    // 10. Ubah Link: [title](url) -> <a href="url">title</a>
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2">$1</a>');

    // 11. Kembalikan inline code & code block yang disimpan di awal
    inlineCodes.forEach((code, index) => {
        text = text.replace(`\uFFF0INLINECODE${index}\uFFF0`, () => code);
    });

    codeBlocks.forEach((block, index) => {
        text = text.replace(`\uFFF0CODEBLOCK${index}\uFFF0`, () => block);
    });

    return text;
}

module.exports = {
    escapeHtml,
    markdownToTelegramHtml,
};
