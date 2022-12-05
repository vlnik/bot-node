const TelegramApi = require("node-telegram-bot-api");
const { gameOptions, againOptions } = require("./options");
const token = "5886730812:AAECsC65gYAig_-dQwJhldZMD06DnfSL7Xg";

const bot = new TelegramApi(token, { polling: true });

const chats = {};

const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Я загадаю цифру от 1 до 9, а ты должен ее отгадать.`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, "Отгадывай", gameOptions);
};

const start = () => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получить информацию о пользователе" },
    { command: "/game", description: "Игра Угадай цифру" },
  ]);

  bot.on("message", (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      bot.sendSticker(
        chatId,
        "https://telegramix.ru/cdn/sticker/256/80/90f5570a284e7dad.webp"
      );
      return bot.sendMessage(chatId, `Добро пожаловать!`);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`
      );
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй еще раз!`);
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data == chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Поздравляю! Ты отгадал цифру ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал цифру ${chats[chatId]}, а ты выбрал ${data}`,
        againOptions
      );
    }
  });
};

start();
