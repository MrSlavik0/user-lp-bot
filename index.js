const { VK } = require('vk-io');
let bots = [];
let commands = [];

class Bot {
    constructor (token, user_id, isRestart = false) {
        let vk = new VK({ token: token, pollingUserId: user_id });
        if(isRestart == false) {
            bots.push(user_id);
            new Command(/^(?:restart)$/i, async (message) => {
                restartPolling(message.senderId, message.vk);
            }, user_id);
        }
        vk.updates.startPolling();
        vk.updates.on('new_message', async function (message) {
            if(message.senderId !== user_id) {
                return;
            }
            if(!message.text) {
                return;
            }
            const answer = (text) => {
                vk.api.messages.edit({ peer_id: message.peerId, message_id: message.id, message: `[БОТ] => ${text}` });
                return true;
            }
            const command = commands.filter(cmd => cmd.userId == user_id).find(cmd => cmd.regexp.test(message.text));
            if(!command) {
                command = commands.filter(cmd => cmd.userId == "all").find(cmd => cmd.regexp.test(message.text));
                if(!command) {
                    return false;
                }
            }
            Object.defineProperty(message, 'vk', {
                enumerable: false,
                value: vk
            });
            message.args = message.text.match(command.regexp);
            await command.process(message, answer);
        });

        this.loggerConversation = async function (exit = false) {
            console.log('LOGGER TO STARTED!');
            if(exit == true) {
                vk.updates.on(['chat_invite_user'], async function (message) {
                    if(message.senderId == user_id) {
                        return;
                    }
                    vk.api.messages.removeChatUser({ chat_id: message.chatId, user_id: user_id });
                    let [user] = await vk.api.users.get({ user_id: message.senderId });
                    vk.api.messages.send({ user_id: user_id, message: `[LOG] => [id${user.id}|${user.first_name} ${user.last_name}] добавил Вас в чат.` });
                })
            } else {
                vk.updates.on(['chat_invite_user'], async function (message) {
                    if(message.senderId == user_id) {
                        return;
                    }
                    let [user] = await vk.api.users.get({ user_id: message.senderId });
                    vk.api.messages.send({ user_id: user_id, message: `[LOG] => [id${user.id}|${user.first_name} ${user.last_name}] добавил Вас в чат.` });
                })
            }
        }
    }
}

class Command {
    constructor (regexp, process, user_id) {
        commands.push({ 
            regexp,
            process,
            userId: user_id
        });
        return commands.length;
    }
}

function restartPolling (user_id, vk) {
    if(!bots.find(id => id == user_id)) {
        return false;
    }
    vk.updates.stop();
    new Bot (vk.options.token, vk.options.pollingUserId, isRestart = true);
}

module.exports = {
    Command,
    Bot
};