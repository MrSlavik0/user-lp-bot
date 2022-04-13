user-bot
=====================
USER-BOT - a module for creating a personal VK page bot
=====================
**`Installation`**
```node
npm install user-bot
```

`Using`
```node
const { Bot, Command } = require("user-bot");

new Bot(<TOKEN>, <USER_ID>);
new Command(<COMMAND REGEXP>, <COMMAND FUNCTION>, <USER_ID>);
```

> Initially, one command "restart" is created in the bot to restart the bot.

`An example of a simple page bot`
```node
const { Bot, Command } = require("user-bot");
new Bot (process.env.USER_TOKEN, process.env.USER_ID);

new Command(
    /^(?:бот)$/i, 
    async (message, answer) => {
        return answer(`Ok`);
    }, 
    process.env.USER_ID
);
```

`To create a common command for all users, set the user_id parameter to "all"`
```node
new Command(
    /^(?:вк)$/i, 
    async (message, answer) => {
        return answer(message.vk.options.pollingUserId);
    }, 
    "all"
);
```

`Logging adding to chats`
```node
const { Bot } = require("user-bot");

let bot = new Bot ('1df7f07400be0ec3b797fa6bc12d2f98fb79990a639bfc0d671c14b9793ab4e4c96fbf7f027ae82d6af94', 123456789);
bot.loggerConversation(false); // true - leaves the chat
```