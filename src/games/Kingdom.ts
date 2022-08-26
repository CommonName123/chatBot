import {Chat} from "../types/Chat";
import {Citizen} from "../types/Citizen";


/**
 * Игра "королевство", в которой вы должны устроить буни или же держать крестьян в ежовых руковицах
 */
export default class Kingdom {
    private peopleOfKingdom: Citizen[] = [];
    private king: Citizen = null;
    private firstPhase = false;
    private isActive = false;
    private timeoutTaxes = false;
    private chat: Chat;

    /**
     * Начать игру
     * @param timer - время до выборов
     * @param chat - в каком именно чате идёт игра
     */
    public start(timer: number, chat: Chat) {
        this.chat = chat;
        this.isActive = true;
        this.firstPhase = true;
        setTimeout(this.firstElection.bind(this), timer * 1000);
    }

    /**
     * Первые выборы, король это рандомный участник
     */
    private firstElection() {
        this.chat.announce('Голосование завершено!');
        this.king = this.peopleOfKingdom[Math.floor(Math.random() * this.peopleOfKingdom.length)];
        this.king.isKing = true;
        this.chat.announce(this.king.name + ' теперь король. Живите с этим.');
        this.firstPhase = false;
    }

    /**
     * Новый участник
     * @param context
     */
    public join(context: any) {
        if (!this.firstPhase) {
            this.chat.announce('Королевство уже сформированно.');
            return;
        }
        const citizen = new Citizen(context['user-id'], context.username);
        this.peopleOfKingdom.push(citizen);
        this.chat.announce(citizen.name + ' присоединяется к королевству.');
    }

    /**
     * Собрать налоги
     */
    public taxes(id: string) {
        if (this.king.id !== id) {
            this.chat.announce('Ты чтоль король?Я за тебя не голосовал!');
            return;
        }
        if (this.timeoutTaxes) {
            this.chat.announce('Нельзя быть таким жадным и так часто собирать налоги');
            return;
        }
        this.chat.announce('Король собирает налоги');
        let countTaxes = 0;
        this.peopleOfKingdom.forEach((citizen: Citizen) => {
            if (!citizen.isKing) {
                if (citizen.money > 0) {
                    const tax = citizen.money * 0.13;
                    citizen.money -= tax;
                    this.king.money += tax;
                    countTaxes += tax;
                }
            }
        });
        this.chat.announce('Король собрал налоги в размере ' + countTaxes);
        this.timeoutTaxes = true;
        setTimeout(this.turnOffTimeout.bind(this), 600000);
    }

    /**
     * Выключить таймаут сбора налогов
     * @private
     */
    private turnOffTimeout() {
        this.timeoutTaxes = false;
    }

    /**
     * Сбор урожая
     */
    public harvest(id: string) {
        const citizen = this.peopleOfKingdom.find(cit => cit.id === id);
        const earned = Math.floor(Math.random() * 100) + 1;
        citizen.money += earned;
        if (earned < 20) {
            this.chat.announce(citizen.name + ' заработал лишь ' + earned + ' у.е.');
        } else if (earned > 80) {
            this.chat.announce(citizen.name + ' упорно трудился и заработал аж ' + earned + ' у.е.');
        } else {
            this.chat.announce(citizen.name + ' заработал ' + earned + ' у.е.');
        }
    }
}



