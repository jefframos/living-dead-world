import * as PIXI from 'pixi.js';
import * as dat from 'dat.gui';

import CharacterBuildScreen from './CharacterBuildScreen';
import Game from '../../Game';
import GameScreen from './GameScreen';
import GameStaticData from '../data/GameStaticData';
import MainMenu from './MainMenu';
import ScreenManager from '../../screenManager/ScreenManager';
import ScreenTransition from './ScreenTransition';
import config from '../../config';

export default class MainScreenManager extends ScreenManager {
    static Screens = {
        GameScreen: 'GameScreen',
        MainMenu: 'MainMenu',
        CharacterBuild: 'CharacterBuild',
    }
    static ScreensTarget = {
        ScreenContainer: Game.ScreenManagerContainer,
        GameplayContainer: null,
    }
    constructor() {
        super();
        //this.screensContainer = Game.ScreenManagerContainer;

        GameStaticData.instance.initialize();

        this.settings = {
            fps: 60
        }
        window.GUI = new dat.GUI({ closed: false });
        window.GUI.add(this.settings, 'fps', 1, 120).listen();

        this.backgroundContainer = new PIXI.Container();
        this.addChild(this.backgroundContainer);
        this.setChildIndex(this.backgroundContainer, 0);

        this.gameplayScreen = new GameScreen(MainScreenManager.Screens.GameScreen, MainScreenManager.ScreensTarget.GameplayContainer);
        this.addScreen(this.gameplayScreen);

        this.mainMenuScreen = new MainMenu(MainScreenManager.Screens.MainMenu, MainScreenManager.ScreensTarget.ScreenContainer)
        this.addScreen(this.mainMenuScreen);

        this.mainMenuScreen.onStartGame.add(() => {
            this.redirectToGame();
        })

        this.characterBuilding = new CharacterBuildScreen(MainScreenManager.Screens.CharacterBuild, MainScreenManager.ScreensTarget.ScreenContainer)
        this.addScreen(this.characterBuilding);

        this.forceChange(MainScreenManager.Screens.MainMenu);


        this.timeScale = 1;

        this.popUpContainer = new PIXI.Container();
        this.addChild(this.popUpContainer);


        this.popUpList = [];


        this.currentPopUp = null;
        this.prevPopUp = null;


        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams) {
            if (urlParams.get('noEnemy')) {
                window.noEnemy = true;
            }
            if (urlParams.get('char') !== null) {
                window.customChar = parseInt(urlParams.get('char'));
            }
            if (urlParams.get('debug')) {
                window.debugMode = true;
            }
            if (urlParams.get('builder')) {
                this.forceChange(MainScreenManager.Screens.CharacterBuild);
            }
            if (urlParams.get('game')) {
                this.forceChange(MainScreenManager.Screens.GameScreen);
            }
        }

        this.isPaused = false;

        window.onAdds.add(() => {
            this.isPaused = true;
        })

        window.onStopAdds.add(() => {
            this.isPaused = false;
        })

        // this.screenTransition = new ScreenTransition();
        // this.addChild(this.screenTransition);

        // this.screenTransition.x = config.width/2;

        if (!window.debugMode) {
            window.GUI.hide()
        }

        Game.Instance.onAspectChanged.add((isPortrait) => {
            this.aspectChange(isPortrait)
        })

    }
    addCoinsParticles(pos, quant = 5, customData = {}) {
        this.particleSystem.show(pos, quant, customData)
    }

    showPopUp(label, param = null) {

        if (this.currentPopUp) //} && this.currentPopUp.label != label)
        {
            this.prevPopUp = this.currentPopUp;
        }
        for (var i = 0; i < this.popUpList.length; i++) {
            if (this.popUpList[i].label == label) {
                if (this.particleSystem) {
                    this.particleSystem.killAll();
                }
                this.popUpList[i].show(param);
                this.popUpContainer.addChild(this.popUpList[i]);
                this.currentPopUp = this.popUpList[i];
                if (!this.prevPopUp) {
                    this.prevPopUp = this.popUpList[i];
                }
            }
        }
    }
    forceChange(screenLabel, param) {

        super.forceChange(screenLabel, param);
        // this.screenTransition.startTransitionOut();               
    }
    change(screenLabel, param) {
        super.change(screenLabel, param);

    }
    redirectToGame(harder) {
        window.HARDER = harder
        this.change(MainScreenManager.Screens.GameScreen);
        //this.showPopUp('init')
    }
    update(delta) {
        this.settings.fps = window.FPS

        if (this.isPaused) return;
        super.update(delta * this.timeScale);

        if (this.currentPopUp) {
            this.currentPopUp.update(delta * this.timeScale)
        }
        if (this.prevPopUp && this.prevPopUp.toRemove && this.prevPopUp.parent) {
            this.prevPopUp.parent.removeChild(this.prevPopUp);
            this.prevPopUp = null;
        }
    }

    toGame() {
        if (this.currentScreen.label == MainScreenManager.Screens.GameScreen) {
            this.currentScreen.resetGame();
            this.particleSystem.killAll();
        }
    }
    toLoad() { }
    toStart() {
        this.showPopUp('init')
    }

    shake(force = 1, steps = 4, time = 0.25) {
        let timelinePosition = new TimelineLite();
        let positionForce = (force * 50);
        let spliterForce = (force * 20);
        let speed = time / steps;
        for (var i = steps; i >= 0; i--) {
            timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
                x: Math.random() * positionForce - positionForce / 2,
                y: Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.screensContainer, speed, {
            x: 0,
            y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}