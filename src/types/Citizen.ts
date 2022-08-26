/**
 * Интерфейс для жителей королевства
 */
export class Citizen {

    readonly id: string;   // идентификатор
    readonly name: string; // имя
    public isKing = false; // является ли королём
    public money: number;  // количество денег

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
}