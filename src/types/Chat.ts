import {Context} from "./Context";
import MusicPlayer from "../music/MusicPlayer";

/**
 * Абстрактный класс для чат-модулей
 */
export abstract class Chat {
    public chatType:string;
    public musicPlayer:MusicPlayer;



    public timeout(username:string,time:number,reason:string){}
    public announce(message:string){}
    public createCard(context:Context,msg:string){}

    public changeSong(songName:string){

    }
}