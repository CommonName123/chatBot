/**
 * Класс для опции в голосовании
 */
export class PollCandidate {
    readonly name: string;      // имя
    public score = 0;           // счёт

    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }
}