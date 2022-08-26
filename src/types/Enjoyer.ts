/**
 * Класс для участника битвы с боссом
 */
export class Enjoyer {
    readonly id: string;        // идентификатор
    readonly name: string;      // имя
    readonly strength: number;  // сила
    public score = 0;           // счёт
    public income!:string;      // деньги

    constructor(id: string, name: string, strength: number) {
        this.id = id;
        this.name = name;
        this.strength = strength;
    }
}