const { VK } = require('vk-io');
let bots = [];
let commands = [];

class Bot {
    constructor (token, user_id, isRestart = false) {
        let vk = new VK({ token: token, pollingUserId: user_id });
        if(isRestart == false) {
        bots.push(user_id);
        vk.api.messages.send({ user_id: user_id, message: `[БОТ] => Система успешно запущена.` }).then(run => {
            console.log('USER LONGPOLL BOT ID: ' + user_id + ' RUNNED!');
            new Command(/^(?:restart)$/i, async (message) => {
                restartPolling(message.senderId, message.vk);
            }, user_id);
        }).catch((error) => {
            return console.log('LONGPOLL RUNNED ERROR');
        });
    } else {
        vk.api.messages.send({ user_id: user_id, message: `[БОТ] => Система успешно перезагружена.` }).then(run => {
            console.log('USER LONGPOLL BOT ID: ' + user_id + ' RESTARTED!');
        }).catch((error) => {
            return console.log('LONGPOLL RESTARTED ERROR');
        });
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
                return;
            }
            Object.defineProperty(message, 'vk', {
                enumerable: false,
                value: vk
            });
            message.args = message.text.match(command.regexp);
            await command.process(message, answer);
        });
    }
}

class Command {
    constructor (regexp, process, user_id) {
        commands.push({ 
            regexp: regexp,
            process: process,
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
