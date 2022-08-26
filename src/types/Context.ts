/**
 * Класс для контекста сообщений из чата(мб неполный)
 */
export class Context {
    public 'badge-info'!:null|string;
    public badges!:null|object;
    public 'badge-info-raw'!:null|string;
    public 'badges-raw'!:null|string;
    public 'client-nonce'!:null|string;
    public color:null|string;
    public 'display-name':string;
    public emotes!:any;
    public 'emotes-raw'!:null|string;
    public 'emote-sets'!:null|string;
    public 'first-msg'!:boolean;
    public 'message-type'!:string;
    public flags!:any;
    public id!:string;
    public mod!:boolean;
    public 'room-id'!:string;
    public subscriber!:boolean;
    public turbo!:boolean;
    public 'tmi-sent-ts'!:any;
    public 'user-id'!:string;
    public 'user-type'!:null|string;
    public username:string;
}