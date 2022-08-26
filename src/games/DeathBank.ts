/**
 * Мапа с кастомными смертями
 */
const DeathBank: string[] = [
    'Из-за угла выбежала чихуахуа и Вы умерли от страха',
    'Вы прочитали в ИА "Панорама" новость о конце света и решили уйти самостоятельно',
    'Утонул в стакане с водой',
    'Играл в жизнь и проиграл'
];

function getRandomDeath(){
    const random = Math.floor(Math.random() * DeathBank.length);
    return DeathBank[random];
}

export default {getRandomDeath};

