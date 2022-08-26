/**
 * Модуль для активности в чате
 * Время от времени запускает какую-то картинку, чтобы её убрать надо написать команду !clean
 */
export default class Cleaner {

    /**
     * Поле для появления картинки
     * @private
     */
    private field: any = document.getElementById("main");
    /**
     * Путь до первого паука
     * @private
     */
    private spiderPath = '../src/games/bank/spider.png';

    /**
     * Путь до второго паука
     * @private
     */
    private spider2Path = '../src/games/bank/spider2.png';

    private spiderImg: any;

    private spider2Img: any;

    private spiderExist = false;


    /**
     * Запуск модуля
     * @private
     */
    public start() {
        this.addSpiders();
        setTimeout(this.showSpiders.bind(this), 600000);
    }

    /**
     * Показать паука
     */
    public showSpiders() {
        if (!this.spiderExist) {
            this.spiderImg.style.display = null;
            this.spiderExist = true;
            setTimeout(this.showSpiders.bind(this), 600000);
        } else {
            this.spider2Img.style.display = null;
        }
    }

    /**
     * Очистка экрана
     * @private
     */
    public clean() {
        this.spiderImg.style.display = 'none';
        this.spider2Img.style.display = 'none';
        this.spiderExist = false
        setTimeout(this.showSpiders.bind(this), 600000);
    }

    /**
     * Добавить пауков
     * @private
     */
    private addSpiders() {
        const img = document.createElement('img');
        img.src = this.spiderPath;
        img.className = 'spider';
        this.spiderImg = img;
        this.field.appendChild(img);

        const img2 = document.createElement('img');
        img2.src = this.spider2Path;
        img2.className = 'spider2';
        this.spider2Img = img2;
        this.field.appendChild(img2);


        this.spiderImg.style.display = 'none';
        this.spider2Img.style.display = 'none';
    }
}