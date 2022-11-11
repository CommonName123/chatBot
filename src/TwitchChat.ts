import tmi from 'tmi.js';
import SmileMap from './icons/SmileMap';
import UserIconMap from './icons/UserIconMap';
import opts from './bot.json';
import {Context} from "./types/Context";
import {Chat} from "./types/Chat";
import ChatManager from "./ChatManager";

/**
 * Модуль чатбота для Twitch
 */
export default class TwitchChat extends Chat{


    public chatType='twitch';

    /**
     * Клиент tmi
     * @private
     */
    private client = new tmi.client(opts);

    public manager:ChatManager;

    /**
     * Указатель на канал
     * @private
     */
    private chatChannel = 'oladyshekx';



    /**
     * Инициализация
     */
    public initialize() {
        this.client.on('message', this.onMessageHandler.bind(this));
        this.client.on('connected', this.onConnectedHandler);
        this.client.connect();
    }


    /**
     * Обработчик сообщений
     * @param target - идентификатор чата
     * @param context - контекст
     * @param msg - сообщение
     * @param self - сообщение от бота
     */
    private onMessageHandler(target: string, context: Context, msg: string, self: boolean) {
        if (context['message-type'] === "whisper") {
            return;
        }

        if (self) {
            this.createCard(context,msg);
            return;
        } // Ignore messages from the bot
        this.manager.parseMessage(target,context,msg,this);
    }


    /**
     * Метод после успешного соединения
     * @param addr - адрес
     * @param port - порт
     */
    private onConnectedHandler(addr: string, port: number) {
        console.log(`* Connected to ${addr}:${port}`);
    }




    /**
     * Объявление
     * @param msg
     */
    public announce(msg: string) {
        this.client.say(this.chatChannel, msg);
    }

    /**
     * Таймаут
     * @param msg
     */
    public timeout(username: string,time:number,reason:string) {
        this.client.timeout(this.chatChannel,username, time, reason);
    }

    /**
     * Отредактировать карточку для сообщения с twitch'а
     * @param context
     * @param msg
     */
    public createCard(context:Context,msg:string){
        let result = '';
        let newMsg = msg;

        const userId = context['user-id'];
        const username = context.username;
        if (username === 'ieasybot') {
            result = UserIconMap.get(username);
        } else if (userId) {
            const found = UserIconMap.get(userId);
            if (found) {
                result = found;
            }
        }

        if (context['badges-raw']) {
            result += this.badgesFunction(context);
        }

        if (context['emotes-raw']) {
            newMsg = this.emotesFunction(context, msg);
        }
        msg.split(' ').forEach(item => {
            const exist = SmileMap.get(item);
            if (exist) {
                newMsg = newMsg.replace(item, exist);
            }
        });
        result += '<span style="color:' + context.color + '">' + context.username + '</span>' + ":" + newMsg;
        return result;
    }

    /**
     * Метод для работы с сообщениями, которые содержат смайлы
     * @param context - контекст
     * @param msg - само сообщение
     */
    private emotesFunction(context: Context, msg: string) {
        let newMsg = msg;
        const positions: any[] = [];


        const emotes = context['emotes-raw'].split('/');
        emotes.forEach((emote: any) => {
            const emoteId = emote.split(':')[0];
            const position = emote.split(':')[1];
            if (position.split(',').length > 1) {
                position.split(',').forEach((item: any) => {
                    positions.push(item + '--' + emoteId);
                });
            } else {
                positions.push(position + '--' + emoteId);
            }
        });
        positions.sort(this.rangeSorter).forEach((item: any) => {
            const loadSmileUrl = 'https://static-cdn.jtvnw.net/emoticons/v2/' + item.split('--')[1] + '/default/light/2.0';
            const iconTag = '<img alt="smile" src="' + loadSmileUrl + '"</img>';
            newMsg = this.replaceRange(newMsg, parseInt(item.split('--')[0].split('-')[0]), parseInt(item.split('--')[0].split('-')[1]), iconTag);
        });
        return newMsg;
    }

    /**
     * Поставить баджик перед никнеймом, если баджик есть в мапе
     * @param context
     * @returns {string|any}
     */
    private badgesFunction(context: Context) {
        const badge = context['badges-raw'].split('/')[0];
        const existBadge = SmileMap.get(badge);
        if (existBadge) {
            return existBadge;
        }
        return '';
    }

    /**
     * Сортировщик для позиционирования эмоутов
     * @param item1 - позиция первого элемента
     * @param item2 - позиция второго элемента
     * @returns {number}
     */
    private rangeSorter(item1: any, item2: any) {
        if (parseInt(item1.split('-')[0]) > parseInt(item2.split('-')[1])) {
            return -1;
        } else {
            return 1;
        }
    }


    /**
     * Заменить текст в сообщении по индексам
     * @param original - оригинальное сообщение
     * @param startPosition - начальная позиция замены
     * @param endPosition - конечная позиция замены
     * @param newMsg - новая часть
     * @returns {string}
     */
    private replaceRange(original: string, startPosition: number, endPosition: number, newMsg: string) {
        return original.substring(0, startPosition) + newMsg + original.substring(endPosition + 1);
    }


}

//todo в свободное время стол заказов музыки

//todo на 45 фолловерах сделать в битве юзеров

//todo на 75 фолловерах сделать ХП


//todo придумать прикольную команду Rage
// хс, Сложна

//todo хэндлер на уничтожение босса при перезагрузки чата
//todo 1% на бан до конца стрима

//todo написать документацию и выложить на gitHub

//todo на 500 человек онлайна машина времени
