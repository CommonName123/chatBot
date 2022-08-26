import GGChat from "./GGChat";
import TwitchChat from "./TwitchChat";
import axios from "axios";
import MusicPlayer from "./music/MusicPlayer";
import BossBattle from "./games/BossBattle";
import {Context} from "./types/Context";
import Commands from "./commands/Commands";
import {Chat} from "./types/Chat";
import Cleaner from "./games/Cleaner";
import Kingdom from "./games/Kingdom";


/**
 * Модуль чатбота
 */
export default class ChatManager {


    /**
     * Модуль команд
     */
    public commandModule: Commands = new Commands();


    /**
     * Чат Twitch
     */
    public twitchChat: TwitchChat = new TwitchChat();

    /**
     * Чат ГГ
     */
    // public ggchat: GGChat = new GGChat()


    /**
     * Проигрыватель аудиокоманд
     */
    public musicPlayer: MusicPlayer = new MusicPlayer();

    /**
     * Выключен ли звук
     */
    public isMuted = false;

    /**
     * Игра битва с боссом
     * @private
     */
    private bossBattle: BossBattle = new BossBattle();


    public initialize() {
        this.twitchChat.initialize();
        this.twitchChat.manager = this;


        //this.ggchat.initialize();
        //this.ggchat.manager = this;


        this.commandModule.manager = this;
        axios
            .get('http://localhost:3000/getSongList')
            .then(res => {
                this.musicPlayer.loadSongs(res.data);
                this.commandModule.musicPlayer = this.musicPlayer;
            })
            .catch(error => console.log(error));
        axios
            .get('http://localhost:3000/getImageList')
            .then(res => {
                this.bossBattle.loadImages(res.data);
                this.commandModule.bossBattle = this.bossBattle;
            })
            .catch(error => console.log(error));
    }


    /**
     * Отправить сообщение в БД
     * @param context
     * @param msg
     */
    private sendMessageInDb(context: Context, msg: string) {
        axios
            .post('http://localhost:3000/addMessage', {context, msg})
            .catch((error) => {
                console.log(error);
            });
    }


    /**
     * Создать карточку с сообщением
     * @param message - сообщение
     */
    public createCard(message: string) {
        const newCard = document.createElement("div");
        const span = document.createElement("span");


        span.innerHTML = message;

        newCard.className = "card-style";
        newCard.appendChild(span);

        const list = document.getElementById("list");

        list.appendChild(newCard);

        list.scrollTop = list.scrollHeight;
    }


    /**
     * Обработать сообщение
     * @param command
     * @param context
     * @param message
     * @param chat
     * @private
     */
    public messageService(command: string, context: Context, message: string, chat: Chat) {
        if (!this.isMuted) {
            this.musicPlayer.changeSong(command);
        }
        this.sendMessageInDb(context, message);
        // if (chat.chatType === "GG") {
        //     msg = this.ggchat.createCard(context, message);
        // } else {
        const msg = this.twitchChat.createCard(context, message);
        // }
        this.createCard(msg)
    }

    public parseMessage(target: string, context: Context, message: string, chat: Chat) {
        this.commandModule.checkAndPerform(target, context, message, chat);
    }

    public changeMuteState() {
        this.isMuted = !this.isMuted;
    }


}
const chatManager = new ChatManager();
chatManager.initialize();