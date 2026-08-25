const express = require("express");
const { webhookCallback} = require("grammy");
const bot = require("../bot/bot.js");

const router = express.Router();

router.post("/telegram-webhook", webhookCallback(bot, "express"));

module.exports = router;