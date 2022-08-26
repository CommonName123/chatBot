import {Command} from "../types/Command";
import {Context} from "../types/Context";
import SmileMap from "../icons/SmileMap";
import DeathBank from "../games/DeathBank";
import axios from "axios";
import DateTimeUtils from "../utils/DateTimeUtils";
import Radio from "../music/Radio";
import Poll from "../poll/Poll";
import MusicPlayer from "../music/MusicPlayer";
import BossBattle from "../games/BossBattle";
import myInfo from "../myInfo.json";
import {Chat} from "../types/Chat";
import ChatManager from "../ChatManager";
import Cleaner from "../games/Cleaner";
import Kingdom from "../games/Kingdom";

/**
 * Модуль команд
 */
export default class Commands {


    /**
     * Радио
     */
    public radio: Radio = new Radio();


    /**
     * Голосовалка
     * @private
     */
    private poll: Poll = new Poll();


    /**
     * ID админа
     * @private
     */
    private adminId: string = myInfo.myId;


    /**
     * Проигрыватель аудиокоманд
     */
    public musicPlayer: MusicPlayer;

    /**
     * Игра битва с боссом
     * @private
     */
    public bossBattle: BossBattle;

    /**
     * Игра "Уборщик"
     * @private
     */
    public cleaner: Cleaner= new Cleaner();
    /**
     * Игра "Королевство"
     * @private
     */
    private kingdom: Kingdom = new Kingdom();

    /**
     * Последние изменения в чатботе
     * @private
     */
    private changelog = "Новая игра 'Королество', однако чат пустует и функционал до конца не проверить";

    public messageService: (command: string, context: Context, message: string, chat: Chat) => void = null;

    public changeMuteState: () => void = null;

    private chat: Chat;

    public manager: ChatManager;

    /**
     * Список общедоступных команд
     * @private
     */
    private commandMap: Map<string, Command> = new Map([
        ['!d20', new Command('бросить 20-гранник', this.rollDice.bind(this))],
        ['!goose', new Command('запустить гуся', this.drawGoose.bind(this))],
        ['!duel', new Command('@кто-то@ - провести с кем-то дуэль', this.duel.bind(this))],
        ['!devilduel', new Command('провести дуэль с Дьяволом(сложно, есть шанс получить бан)', this.devilDuel.bind(this))],
        ['!followage', new Command('показать сколько времени Вы уже отслеживаете канал', this.followAge.bind(this))],
        ['!startgame', new Command('начать битву с боссом "solleo"', this.startGame.bind(this))],
        ['!hit', new Command('сделать удар по боссу, если игра запущена', this.hit.bind(this))],
        ['!harvest', new Command('собрать урожай', this.harvest.bind(this))],
        ['!tax', new Command('собрать налоги(только для короля)', this.tax.bind(this))],
        ['!join', new Command('присоединиться к королевству', this.join.bind(this))],
        ['!help', new Command('вывести описание всех команд. Список команд пополнен и актуален на 17.05.2022', this.help.bind(this))],
        ['!song', new Command('получить список аудиокоманд', this.getSongList.bind(this))],
        ['!smile', new Command('получить список ворованных смайлов', this.getSmileList.bind(this))],
        ['!vote', new Command('проголосовать, если идёт голосование', this.vote.bind(this))],
        ['!реклама', new Command('реклама чатбота', this.ads.bind(this))],
        ['!новое', new Command('что нового сегодня', this.news.bind(this))],
        ['!флешмоб', new Command('фшелмоб/тематика этого месяца', this.theme.bind(this))],
        ['!tg', new Command('ссылка на телегу', this.tg.bind(this))],
        ['!radio', new Command('что сейчас играет', this.getCurrentTrack.bind(this))],
        ['!clean', new Command('убрать "мусор"', this.clean.bind(this))],
        ['!вкатун', new Command('типичные вопросы', this.vkatun.bind(this))],
    ]);


    /**
     * Список специальных команд
     * @private
     */
    private specialCommandsMap: Map<string, Command> = new Map([
        ['!startpoll', new Command('начать голосование(доступно только для админа)', this.polling.bind(this))],
        ['!startcleaner', new Command('запустить игру "Уборщик"', this.startCleaner.bind(this))],
        ['!startkingdom', new Command('запустить игру "Королевство"', this.startKingdom.bind(this))],
        ['!mute', new Command('включить/выключить аудиокоманды и игры', this.mute.bind(this))],
    ]);


    /**
     * Проверить является ли сообщение командой,выполнить его и обработать сообщение
     */
    public checkAndPerform(target: string, context: Context, message: string, chat: Chat) {
        this.chat = chat;
        const commandName = message.trim().toLowerCase();
        const messageArray = commandName.split(' ');
        const [command, ...restArguments] = messageArray;
        const commandObject = this.commandMap.get(command);
        if (!commandObject) {
            const specialCommands = this.specialCommandsMap.get(command);
            if (specialCommands && this.adminId === context['user-id']) {
                this.specialCommandsMap.get(commandName.split(' ')[0]).preform(target, context, message, restArguments);
                return;
            }
            this.manager.messageService(command, context, message, chat);
            return;
        }
        this.commandMap.get(commandName.split(' ')[0]).preform(target, context, message, restArguments);
    }


    /**
     * Получить текущий трек из радио
     * @private
     */
    private getCurrentTrack() {
        this.radio.getCurrentTrack().then(name => {
            this.chat.announce(name);
        });
    }

    /**
     * Запустить игру 'Уборщик'
     * @private
     */
    private startCleaner(){
        this.cleaner.start();
    }
    /**
     * Убрать что-либо с экрана
     * @private
     */
    private clean(){
        this.cleaner.clean();
    }

    /**
     * Ответ на типичный вопросы "Как войти в ОЙТИ? Какой язык выбрать? и т д"
     * @private
     */
    private vkatun(target: string, context: Context, msg: string, args: any){
        this.chat.announce("Чел, если ты задал один из типичных вопросов а-ля \"Как войти в ОЙТИ? Какой язык выбрать? и т д\" то в данном случае - никак." +
            "Очевидно ты не изучил предметную область и не поймёшь о чём спрашиваешь...погугли чел.");
    }



    /**
     * Запустить игру 'Королевство'
     * @private
     */
    private startKingdom(){
        this.kingdom.start(30,this.chat);
    }

    /**
     * Запустить игру 'Королевство'
     * @private
     */
    private join(target: string, context: Context, msg: string, args: any){
        this.kingdom.join(context);
    }



    /**
     * Собрать урожай
     * @private
     */
    private harvest(target: string, context: Context, msg: string, args: any){
        this.kingdom.harvest(context["user-id"]);
    }

    /**
     * Собрать налоги
     * @private
     */
    private tax(target: string, context: Context, msg: string, args: any){
        this.kingdom.taxes(context["user-id"]);
    }


    /**
     * Бросить кубик
     * @returns {number}
     */
    private rollDice() {
        const num = Commands.roll20Dice();
        this.chat.announce(`Вы выкинули ${num}. `);
    }

    /**
     * Вывести ссылку на телеграм-канал
     * @param target
     * @private
     */
    private tg() {
        this.chat.announce('Ссылка на Telegram канал https://t.me/oladyshekxxx');
    }


    /**
     * Вывести информацию о текущем месяце
     */
    private theme() {
        this.chat.announce('12 обезьян');
    }

    /**
     * Начать голосование
     * @param args
     */
    private polling(target: string, context: Context, msg: string, args: any) {
        this.poll.startPoll(this.chat, args);
    }


    /**
     * Выключить звуки
     */
    private mute() {
        this.manager.changeMuteState();
    }

    /**
     * Реклама чатбота
     */
    private ads() {
        this.chat.announce('Привет, похоже ты новенький в нашем чате. Позволь мне рассказать немного о себе.' +
            'Я искусственный интеллект написанный на css в sql\'е.' +
            'У меня есть много интересных команд, например !help.' +
            'На стримах мы обычно дорабатываем меня.');
    }

    /**
     * Что нового сегодня
     */
    private news() {
        this.chat.announce(this.changelog);
    }


    /**
     * Нарисовать гуся
     * @param target
     * @param context
     * @param msg
     * @param args
     */
    private drawGoose(target: string, context: Context, msg: string, args: any) {
        const goose = 'ЗАПУСКАЕМ\n' +
            '░ГУСЯ░▄▀▀▀▄░РАБОТЯГИ░░\n' +
            '▄███▀░◐░░░▌░░░░░░░\n' +
            '░░░░▌░░░░░▐░░░░░░░\n' +
            '░░░░▐░░░░░▐░░░░░░░\n' +
            '░░░░▌░░░░░▐▄▄░░░░░\n' +
            '░░░░▌░░░░▄▀▒▒▀▀▀▀▄\n' +
            '░░░▐░░░░▐▒▒▒▒▒▒▒▒▀▀▄\n' +
            '░░░▐░░░░▐▄▒▒▒▒▒▒▒▒▒▒▀▄\n' +
            '░░░░▀▄░░░░▀▄▒▒▒▒▒▒▒▒▒▒▀▄\n' +
            '░░░░░░▀▄▄▄▄▄█▄▄▄▄▄▄▄▄▄▄▄▀▄\n' +
            '░░░░░░░░░░░▌▌▌▌░░░░░\n' +
            '░░░░░░░░░░░▌▌░▌▌░░░░░\n' +
            '░░░░░░░░░▄▄▌▌▄▌▌░░░░░\n' +
            'запускаем гуся работяги';
        this.chat.announce(goose);
    }


    /**
     * Вызов списка команд
     */
    private help() {
        let result = '';
        this.commandMap.forEach((command: Command, commandKey: string) => {
            result += commandKey + ' ' + command.description + ' • ';
        })
        this.chat.announce(result);
    }

    /**
     * Начать битву с босом
     */
    private startGame() {
        this.bossBattle.startGame(10, this.chat, this.manager.musicPlayer);
    }


    /**
     * Ударить по боссу
     * @param target
     */
    private hit(target: string, context: Context) {
        this.bossBattle.hit(context);
    }

    /**
     * Получить список аудиофайлов
     * Воспроизвести аудиофайл
     * @param target
     */
    private getSongList(target: string) {
        this.chat.announce(this.musicPlayer.getSongList());
    }

    /**
     * Получить список кастомных смайлов
     * @param target
     */
    private getSmileList(target: string) {
        let smileList = '';
        for (const [key, value] of SmileMap.entries()) {
            smileList += key + ' ';
        }
        this.chat.announce(smileList);
    }


    /**
     * Проголосовать
     * @param target
     * @param context
     * @param msg
     * @param restArguments
     */
    private vote(target: string, context: Context, msg: string, restArguments: any) {
        this.poll.vote(context['user-id'], restArguments[0]);
    }


    /**
     * Дуэль с дьяволом
     */
    private devilDuel(target: string, context: Context, msg: string) {
        if (Commands.roll20Dice() < 20) {
            const reason = DeathBank.getRandomDeath();
            this.chat.timeout(context.username, 120, reason);
            this.chat.announce(context.username + " проиграл битву с Дьяволом и получает бан!");
        } else {
            //todo раздавать випки когда будет 50 фолловеров
            this.chat.announce(context.username + " Дьявола и получили випку");
        }
    }


    /**
     * Получить срок отслеживания канала
     * @param target - идентификатор чата
     * @param context - контекст
     */
    private followAge(target: string, context: Context) {
        const authorId = context['user-id'];
        if (!authorId) {
            return;
        }
        axios
            .get('http://localhost:3000/follows', {params: {authorId: authorId}})
            .then((response) => {
                let period = 'Вы не подписались';
                if (response.data.total > 0) {
                    const followInfo = response.data.data[0];
                    const oldDate = new Date(followInfo.followed_at);
                    period = DateTimeUtils.calculatePeriod(oldDate);
                }
                this.chat.announce(period);
            })
            .catch((error) => {
                this.chat.announce('Ошибка');
                console.log(error);
            });
    }

    /**
     * Рандом от 1 до 20
     * @private
     */
    private static roll20Dice() {
        const sides = 20;
        return Math.floor(Math.random() * sides) + 1;
    }

    /**
     * Команда для дуэли
     */
    private duel(target: string, context: Context, msg: string) {
        const agressor = context.username;
        const defender = msg.split(' ')[1];
        if (!defender) {
            this.chat.announce("Вы должны указать соперника!");
            return;
        }
        this.chat.announce(agressor + ' бросает вызов ' + defender);

        let result = 'После долгой битвы. ';
        const count = Math.floor(Math.random() * 10) + 1;
        if (count < 5) {
            result += agressor + ' проиграл в дуэле с ' + defender;
        } else if (count === 5) {
            result += 'Бой между ' + agressor + ' и ' + defender + ' закончился ничьёй';
        } else {
            result += agressor + ' победил в дуэле с ' + defender;
        }
        this.chat.announce(result);
    }


}