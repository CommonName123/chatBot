import {PollCandidate} from "../types/PollCandidate";
import {Chat} from "../types/Chat";

/**
 * Модуль для голосования в чате
 */
export default class Poll {
    /**
     * Идёт ли в данный момент голосование
     * @private
     */
    private isActive = false;

    /**
     * Варианты за кого голосовать
     * @private
     */
    private candidatesInPoll: PollCandidate[] = [];

    /**
     * Список проголосовавших
     * @private
     */
    private voters: string[] = [];

    /**
     * Чат
     * @private
     */
    private chat: Chat;

    /**
     * Начать голосование
     * @param chat
     * @param candidates
     * @returns {string}
     */
    public startPoll(chat: Chat, candidates: string[]) {
        if (!this.chat) {
            this.chat = chat;
        }
        if (this.isActive) {
            this.chat.announce('В данный момент уже идёт голосование');
        }

        // закончить голосование после таймера
        setTimeout(this.endPoll, parseInt(candidates.shift()) * 1000);

        candidates.forEach(item => {
            const candidate = new PollCandidate(item, 0);
            this.candidatesInPoll.push(candidate);
        });
        this.isActive = true;
        this.chat.announce('Началось голосование. Кандидаты:' + candidates.join(' '));
    }

    /**
     * Проголосовать за что-либо
     * @param userId - id пользователя, который голосует
     * @param candidate - кандидат пользователя
     */
    public vote(userId: string, candidate: string) {
        if (!this.isActive) {
            return 'голосование не ведётся в данный момент';
        }
        const candidateIndex = this.candidatesInPoll.findIndex(x => x.name === candidate);
        if (candidateIndex !== -1) {
            if (this.voters.includes(userId)) {
                return 'Вы уже голосовали';
            }
            this.voters.push(userId);
            this.candidatesInPoll[candidateIndex].score += 1;
            this.chat.announce('Ваш голос учтён');
        } else {
            this.chat.announce('Неверный кандидат');
        }
    }

    /**
     * Окончание голосования
     * @returns {string}
     */
    private endPoll() {
        let result = '';
        this.candidatesInPoll.forEach(candidate => {
            result += candidate.name + ' получил ' + candidate.score + ' голосов;'
        });
        this.chat.announce('Результаты ' + result);
        this.prepareForNextPoll();
    }

    /**
     * Подготовиться к след. голосованию
     * помыть полы,убрать стулья
     */
    private prepareForNextPoll() {
        this.candidatesInPoll = [];
        this.voters = [];
        this.isActive = false;
    }
}
