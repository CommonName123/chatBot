/**
 * Класс для чат-команд
 */
export class Command {
    public description: string;      // описание
    readonly preform:(target: string, context: any, msg: string,[arg]?:any)=>void;             // выполнение

    constructor(description: string, preform: (target: string, context: any, msg: string,[arg]?:any)=>void) {
        this.description = description;
        this.preform = preform;
    }
}