import axios from 'axios';
import ggdata from './ggData.json';
import {Context} from "./types/Context";
import {Chat} from "./types/Chat";
import ChatManager from "./ChatManager";
import UserIconMap from "./icons/UserIconMap";
import SmileMap from "./icons/SmileMap";

/**
 * Модуль чатбота для ГГ
 */
export default class GGChat extends Chat {

    public chatType = 'GG';

    private oldWs = "wss://chat.goodgame.ru/chat/websocket";
    private ws = "ws://chat.goodgame.ru:8081/chat/websocket"; // не работает, хз почему

    private token = '';

    public manager: ChatManager;


    /**
     * Урла для получения токена
     * @private
     */
    private authUrl = " https://goodgame.ru/ajax/chatlogin";


    private client: any = null;


    public initialize() {
        this.client = new WebSocket(this.oldWs);

        this.client.onopen = (event: any) => {
            console.log(event);
            this.auth();
        };
        this.client.onmessage = (event: any) => {
            const response = window.JSON.parse(event.data);

            if (response.type === "message") {
                const context = new Context();
                context.username = response.data.user_name;
                context["user-id"] = response.data.user_id;
                this.manager.parseMessage(response.data.user_name, context, response.data.text, this);
            }

            console.log(event);
        };
        this.client.onclose = (event: any) => {
            console.log('Закрыли соединение');
        };
        this.client.onerror = (error: any) => {
            console.log(error);
        }
    }


    /**
     * Авторизация на ГГ
     * @private
     */
    private auth() {
        axios.post("https://goodgame.ru/ajax/chatlogin", {
            login: ggdata.login,
            password: ggdata.password

        }).then(res => {
            // this.token = res.data.token;
            this.joinToChannel();
        })
    }

    private joinToChannel() {
        const auth = {
            "type": "auth",
            "data": {
                "site_id": 1,
                "user_id": 959392,
                "token": ggdata.token
            }
        };

        this.client.send(window.JSON.stringify(auth));

        const data = {
            "type": "join",
            "data": {
                "channel_id": "193963", // идентификатор канала
                "hidden": false   // для "модераторов": не показывать ник в списке юзеров
            }
        };
        this.client.send(window.JSON.stringify(data));
    }

    public createCard(context: any, msg: string) {
        let result = '';
        result += '<span style="color:' + context.color + '">' + context.username + '</span>' + ":" + msg;
        return result;
    }

    public announce(message: string) {
        const formMessage = {
            "type": "send_message",
            "data": {
                "channel_id": "193963",
                "text": message, //html-разметка эскейпится
                "hideIcon": false, // используется в служебных целях на стороне клиента
                "mobile": false // используется в служебных целях на стороне клиента
            }
        }

        this.client.send(window.JSON.stringify(formMessage));
    }

}