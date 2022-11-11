/**
 * Класс аудиоплеера
 */
export default class MusicPlayer {

    /**
     * Признак, что плеер в работе
     * @private
     */
    private inAction = false;

    /**
     * todo мб придумать какой-то свой тайпинг
     * html-тэг аудиоплеера
     * @private
     */
    private music: any = document.getElementById("music");

    /**
     * Список аудиофайлов
     * @private
     */
    private audioList: string[] = [];

    /**
     * Мапа с громкостью аудиофайлов
     * @private
     */
    private audioMap: Map<string, number> = new Map([
        ['nani', 0.1],
        ['continue', 0.3],
        ['george', 0.15],
        ['aaa', 0.5],
        ['woo', 0.4],
        ['hit', 0.1],
        ['crab', 0.7],
        ['haha', 0.3],
        ['probitie', 0.05],
        ['zhesht', 0.5],
        ['crab', 0.1],
        ['xfiles', 0.2],
        ['leroy', 0.8],
        ['nenado', 0.1],
        ['nya', 0.45],
        ['kuda', 0.6],
        ['gigachad', 0.6],
        ['espanoles', 0.3],
    ]);

    /**
     * Очередь проигрывания
     * @private
     */
    private queue: string[] = [];

    /**
     * Сменить и вызвать аудиофайл
     * @param songName - название трека
     * @returns {string}
     */
    public changeSong(songName: string) {
        const audioName = songName.slice(1, songName.length);
        const exist = this.audioList.includes(audioName);

        if (!exist) {
            return;
        }
        if (this.inAction) {
            this.queue.push(audioName);
            return;
        }
        this.changeSrcAngPlay(audioName);
    }

    /**
     * Проиграть след. в очереди команду
     * @param audioName
     * @private
     */
    private changeSrcAngPlay(audioName: string) {
        this.music.src = "../src/music/bank/" + audioName + ".mp3";
        this.music.volume = this.audioMap.get(audioName) ? this.audioMap.get(audioName) : 1;
        this.music.load();
        this.playSong();
    }


    /**
     * Проиграть мелодию
     * @returns {string}
     */
    private playSong() {
        if (this.inAction) {
            return 'Проигрыватель уже запущен.'
        }
        this.inAction = true;

        this.music.play();
        this.music.onended = () => {
            this.inAction = false;
            if (this.queue.length > 0) {
                const nextSong = this.queue.shift();
                this.changeSrcAngPlay(nextSong);
            }
        }
    }


    /**
     * Загрузить в HTML аудио из директории music/bank
     * @param songList
     */
    public loadSongs(songList: string[]) {
        this.audioList = [];
        songList.forEach(songName => {
            const source = document.createElement('source');
            this.audioList.push(songName.replace('.mp3', ''));
            source.src = '../src/music/bank/' + songName;
            source.type = 'audio/mpeg';
            this.music.appendChild(source);
        });
    }

    /**
     * Получить список актуальных аудиокоманд
     * @returns {*}
     */
    public getSongList() {
        return this.audioList.join(' ');
    }


    /**
     * Включает рандомные фразы в рандомное время
     * можно наполнить массив randomTime интервалами через которые будут проигранны звуковые композиции
     */
    public turnOnRandomizer() {
        const length = this.audioList.length;
        const randomItem = this.audioList[Math.floor((Math.random() * length))];
        //const randomTime = [600];

        setTimeout(() => {
            this.changeSrcAngPlay(randomItem);
            this.turnOnRandomizer();
        }, 600 * 1000);
    }


}