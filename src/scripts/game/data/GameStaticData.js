import { Assets } from 'pixi.js';
import Game from '../../Game';

export default class GameStaticData {

    static _instance;
    static get instance() {
        if (!GameStaticData._instance) {
            GameStaticData._instance = new GameStaticData();
        }
        return GameStaticData._instance;
    } 

    constructor() {

        this.enemies = []
        let enemiesData = Game.MainLoader.resources['enemies1'].data.enemies

        enemiesData.forEach(element => {
            this.enemies.push(element);
        });
    }
}