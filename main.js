// Телеграм бот: "Дьявольские вкусняшки"


const TelegramApi = require("node-telegram-bot-api");
const options = require("./options.js");

const token = "5753524666:AAF7Fflu_Qcnv0llQxFBnp26pYtXiqwe0tc";
const bot = new TelegramApi(token, {polling: true});

const chats = {};


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадаю цифру от 0 до 9, а ты должен её угадать`);
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадывай`, options.gameOptions);
}

const start = () => {
    bot.setMyCommands([
        {command: "/start", description: `Начальное приветствие`},
        {command: "/info", description: `Получить информацию о пользователе`},
        {command: "/game", description: `Игра угадай цифру`}
    ])
    
    bot.on("message", async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if(text === "/start") {
            await bot.sendSticker(chatId, `src/images/good_morning.webp`);
            return bot.sendMessage(chatId, `Добро пожаловать в телеграм бот ffaRR_IT`);
        };
    
        if(text === "/info") {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`);
        }
    
        if(text === "/game") {
            return startGame(chatId);
        }
    
        return bot.sendMessage(chatId, `Я тебя не понимаю, попробуй ещё раз!`);
    });

    bot.on("callback_query", async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        console.log(chats[chatId], data);

    
        if(data === "/again") {
            return startGame(chatId);
        }
    
        if(+data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${data}`, options.againOptions);
        } else {
            return bot.sendMessage(chatId, `К сожалению, ты не угадал, бот загадал цифру ${chats[chatId]}`, options.againOptions);
        }
    })
}



start()

