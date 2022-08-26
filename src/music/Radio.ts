import axios from "axios";
import myInfo from  "../myInfo.json";

/**
 * Модуль для вывода информации о треках из радио
 */
export default class Radio {

    private user = 'OladyshekX';

    /**
     * Получить текущий трек с радио
     */
    public getCurrentTrack():Promise<string> {
        return axios.get('http://ws.audioscrobbler.com/2.0/', {
            params: {
                method: 'user.getrecenttracks',
                user: this.user,
                api_key: myInfo.radioApi,
                format: 'json'
            }
        })
            .then(response => (response.data.recenttracks.track[0].artist['#text'] + ' - ' + response.data.recenttracks.track[0].name))
            .catch(error => error);
    }
}