import {Enjoyer} from "../types/Enjoyer";
import MusicPlayer from "../music/MusicPlayer.js";
import {Context} from "../types/Context";
import {Chat} from "../types/Chat";

/**
 * Игра "босс качалки", в которой вы должны победить хитрого противника в лице "solleo"
 * с шансом в 1% может выпасть босс "oellos" с редким лутом
 */
export default class BossBattle {

    /**
     * Здоровье босса
     * @private
     */
    private bossHP: number;
    /**
     * Запущена ли игра
     * @private
     */
    private isActive: boolean;
    /**
     * Участники битвы
     * @private
     */
    private partyEnjoyers: Enjoyer[] = [];
    /**
     * Босс
     * @private
     */
    private imageList: any[] = [];
    /**
     * Поле боя
     * @private
     */
    private battlefield: any = document.getElementById("main");
    /**
     * Проигрыватель аудиофайлов
     * @private
     */
    private musicPlayer: MusicPlayer;
    /**
     * Чат
     * @private
     */
    private chat: Chat;

    /**
     * Начать игру
     * @param startHp
     * @param chat
     * @param musicPlayer
     */
    public startGame(startHp: number, chat: Chat, musicPlayer: MusicPlayer) {
        this.chat = chat;
        this.musicPlayer = musicPlayer;
        if (this.isActive) {
            chat.announce('Игра уже запущена!');
        }
        this.isActive = true;
        this.bossHP = startHp;
        this.musicPlayer.changeSong('!letsgo');
        chat.announce('Вы вызвали босса "solleo" с ' + this.bossHP + ' единиц здоровья');
    }

    /**
     * Ударить босса
     */
    public hit(context: Context) {
        if (!this.isActive) {
            return;
        }
        let enjoyer = this.partyEnjoyers.find(enj => enj.id === context['user-id']);
        if (!enjoyer) {
            enjoyer = new Enjoyer(context['user-id'], context.username, 0);
            this.partyEnjoyers.push(enjoyer);
        }

        let song = '!woo';

        const rollToHit = Math.floor(Math.random() * 10) + 1;
        if (rollToHit > 5) {
            song = '!probitie';
            this.bossHP -= 1;
            enjoyer.score += 15;
            if (rollToHit > 9) {
                song = '!spank';
                this.bossHP -= 1;
                enjoyer.score += 35;
            }
            if (this.bossHP <= 0) {
                enjoyer.score += 50;
                this.endGame();
                return;
            }
            this.musicPlayer.changeSong(song);

            this.chat.announce('У босса осталось ' + this.bossHP + ' единиц здоровья');
            this.imageList[0].className = 'hitting';
            setTimeout(this.hide.bind(this), 1500);
        } else {
            this.imageList[0].className = 'slide';
            setTimeout(this.hide.bind(this), 1500);
            this.musicPlayer.changeSong(song);
            enjoyer.score += 5;
        }

    }

    /**
     * Спрятать Van'а
     * @private
     */
    private hide() {
        this.imageList[0].className = 'waiting';
    }

    /**
     * Закончить игру
     * @private
     */
    public endGame() {
        this.isActive = false;
        this.musicPlayer.changeSong('!aaa');
        this.imageList[0].className = 'lose';
        setTimeout(this.hide.bind(this), 3000);
        //todo выводить топ-3 или какую-то стату
        this.chat.announce('Босс побеждён!');

        let totalPoints = 0;
        const money = Math.floor(Math.random() * 1000) + 1;
        this.partyEnjoyers.forEach(member => totalPoints += member.score);
        const coef = money / totalPoints;
        this.partyEnjoyers.forEach(member => member.income = (member.score * coef).toFixed(0));
        this.partyEnjoyers.sort(BossBattle.sortByScore);
        const top1 = this.partyEnjoyers.shift();
        this.chat.announce(top1.name + ' внёс больше всего импакта и получил ' + top1.income + ' деняг');
        this.partyEnjoyers.forEach(top => this.chat.announce(top.name + ' получил ' + top.income))
    }


    /**
     * Загрузить в HTML картинки из директории bank
     * @param songList
     */
    public loadImages(images: string[]) {
        images.forEach(image => {
            const img = document.createElement('img');
            img.src = '../src/games/bank/' + image;
            img.className = 'waiting';
            this.battlefield.appendChild(img);
            this.imageList.push(img);
        });
    }

    /**
     * Сортировка массива по количеству очков
     * @param member1
     * @param member2
     */
    static sortByScore(member1: Enjoyer, member2: Enjoyer) {
        if (member1.score > member2.score) {
            return 1;
        } else {
            return -1;
        }
    }
}