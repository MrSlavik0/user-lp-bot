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
new Bot("token", user_id);
new Command(regexp, process, user_id);
```

> Initially, one command "restart" is created in the bot to restart the bot.

`An example of a simple page bot`
```node
const { Bot, Command } = require("user-bot");
new Bot ('1df7f07400be0ec3b797fa6bc12d2f98fb79990a639bfc0d671c14b9793ab4e4c96fbf7f027ae82d6af94', 123456789);
new Command(/^(?:бот)$/i, async (message, answer) => {
    return answer(`Ok`);
}, 123456789);```
