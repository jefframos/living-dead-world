import * as PIXI from 'pixi.js';

import BaseButton from '../BaseButton';
import CompanionData from '../../../data/CompanionData';
import CookieManager from '../../../CookieManager';
import DifficultyButton from './DifficultyButton';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameStaticData from '../../../data/GameStaticData';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
import MainScreenModal from '../MainScreenModal';
import PrizeManager from '../../../data/PrizeManager';
import UIList from '../../../ui/uiElements/UIList';
import UIUtils from '../../../utils/UIUtils';
import Utils from '../../../core/utils/Utils';
import WeaponData from '../../../data/WeaponData';
import signals from 'signals';

export default class LocationButton extends PIXI.Container {
    constructor() {
        super();
        this.margin = 20

        this.containerBackground = new PIXI.TilingSprite(PIXI.Texture.from('floor_5'), 256, 256);
        this.containerBackground.width = 170
        this.containerBackground.height = 200

        //this.addChild(this.containerBackground)

        this.enemiesContainer = new PIXI.Container();
        //this.addChild(this.enemiesContainer)


        this.shade = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_blur'), 20, 20, 20, 20);
        this.shade.width = 20
        this.shade.height = 20
        this.shade.tint = 0
        this.shade.alpha = 0.5
        this.addChild(this.shade)


        this.uiList = new UIList();
        this.addChild(this.uiList)

        this.descriptionList = new UIList();
        this.addChild(this.descriptionList)

        this.bottomList = new UIList();
        this.addChild(this.bottomList)

        this.levelName = UIUtils.getPrimaryLabel("Name")
        this.uiList.addElement(this.levelName)
        this.levelName.style.wordWrap = 120
        this.levelName.style.fontSize = 22

        this.levelTime = UIUtils.getPrimaryLabel("Name")
        this.uiList.addElement(new PIXI.Container())

        this.levelNameDescription = UIUtils.getPrimaryLabel("")
        this.descriptionList.addElement(this.levelNameDescription)
        this.levelNameDescription.style.wordWrap = 120
        this.levelNameDescription.style.fontSize = 18

        this.levelTimeDescription = UIUtils.getPrimaryLabel("Time")
        this.descriptionList.addElement(this.levelTimeDescription)
        this.levelTimeDescription.style.fontSize = 18

        this.dificultyDescription = UIUtils.getPrimaryLabel("Difficulty")
        this.descriptionList.addElement(this.dificultyDescription)
        this.dificultyDescription.style.fontSize = 18



        this.easy = new DifficultyButton(1)
        this.medium = new DifficultyButton(2)
        this.hard = new DifficultyButton(3)
        this.master = new DifficultyButton(4)
        this.bottomList.addElement(this.easy)
        this.bottomList.addElement(this.medium)
        this.bottomList.addElement(this.hard)
        this.bottomList.addElement(this.master)

        this.levelsButton = [this.easy, this.medium, this.hard, this.master]

        this.easy.onClick.add(() => {
            this.onStageSelected.dispatch(this, 0);
        })

        this.medium.onClick.add(() => {
            this.onStageSelected.dispatch(this, 1);
        })


        this.hard.onClick.add(() => {
            this.onStageSelected.dispatch(this, 2);
        })
        this.master.onClick.add(() => {
            this.onStageSelected.dispatch(this, 3);
        })

        this.currentHighscore = UIUtils.getPrimaryLabel("Highscore: 0")
        //this.bottomList.addElement(new PIXI.Container())
        // this.bottomList.addElement(this.currentHighscore)
        this.currentHighscore.style.fontSize = 18
        this.currentHighscore.style.fill = 0x22ff00

        this.uiList.w = 10
        this.uiList.h = 10

        this.bottomList.x = this.margin;

        this.uiList.x = 0//this.margin;
        this.uiList.y = this.margin;

        this.descriptionList.x = this.margin
        this.descriptionList.y = this.margin
        this.rows = 0;

        this.starsSprites = [];

        // this.starsList = new UIList();
        // this.starsList.w = this.containerBackground.width - 20
        // this.starsList.h = 30
        // for (var i = 0; i < 5; i++) {
        //     const star = new PIXI.Sprite.from(UIUtils.getIconUIIcon('enemy-kill'));
        //     this.starsList.addElement(star, { fitHeight: 0.8 })
        //     this.starsSprites.push(star)
        //     star.tint = 0;
        // }
        // this.starsList.updateHorizontalList();

        // this.uiList.addElement(this.starsList)

        this.onStageSelected = new signals.Signal();
        this.baseButton = new BaseButton('square_button_0008');
        //this.addChild(this.baseButton)
        this.baseButton.alpha = 0;
        this.baseButton.onButtonClicked.add(() => {
            this.onStageSelected.dispatch(this);
        })



        this.lockContainer = new PIXI.Container()
        this.lockSprite = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 20, 20, 20, 20);
        this.lockSprite.width = 170
        this.lockSprite.height = 200
        this.lockSprite.tint = 0
        this.lockSprite.alpha = 0.9
        this.lockSprite.interactive = true;

        this.lockIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('lockIcon'))
        this.lockIcon.anchor.set(0.5);

        this.lockContainer.addChild(this.lockSprite)
        this.lockContainer.addChild(this.lockIcon)
        this.addChild(this.lockContainer)



        this.maskShape = new PIXI.NineSlicePlane(PIXI.Texture.from('tile'), 20, 20, 20, 20);
        this.addChild(this.maskShape)

        // this.maskShape = new PIXI.NineSlicePlane(PIXI.Texture.from('square_button_0011'), 20, 20, 20, 20);
        // this.addChild(this.maskShape)

        this.enemiesContainer.mask = this.maskShape;

        this.border = new PIXI.NineSlicePlane(PIXI.Texture.from('wire-box'), 20, 20, 20, 20);
        //this.addChild(this.border)
    }
    setData(data, isLock) {
        this.containerBackground.texture = PIXI.Texture.from(data.views.groundTexture, data.views.groundWidth, data.views.groundWidth)
        this.levelName.text = data.views.levelName + '\n' + Utils.floatToTime(data.waves.lenght)
        this.fullData = data;
        //this.levelTime.text = Utils.floatToTime(data.waves.lenght)
        this.uiList.updateHorizontalList()

        const allEnemiesOnLevel = {};
        const allEnemiesOnLevelArray = [];
        data.waves.waves.forEach(element => {

            element.waves.forEach(wave => {
                if (Array.isArray(wave.entity)) {
                    wave.entity.forEach(element => {
                        if (!allEnemiesOnLevel[element]) {
                            allEnemiesOnLevel[element] = 1
                            allEnemiesOnLevelArray.push(GameStaticData.instance.getEntityById('enemy', element))
                        }
                    });
                } else {
                    if (!allEnemiesOnLevel[wave.entity]) {
                        allEnemiesOnLevel[wave.entity] = 1
                        allEnemiesOnLevelArray.push(GameStaticData.instance.getEntityById('enemy', wave.entity))
                    }
                }

            });

        });

        allEnemiesOnLevelArray.sort((a, b) => {
            const nameA = a.id.toUpperCase(); // ignore upper and lowercase
            const nameB = b.id.toUpperCase(); // ignore upper and lowercase
            if (nameA < nameB) {
                return -1;
            }
            if (nameA > nameB) {
                return 1;
            }

            // names must be equal
            return 0;
        });
        //allEnemiesOnLevelArray.sort((a, b) => { return a.entityData.tier - b.entityData.tier })

        console.log(allEnemiesOnLevelArray)
        const allSprites = [];

        allEnemiesOnLevelArray.forEach(element => {

            const animData = GameStaticData.instance.getDataById('animation', 'entity', element.animationData.idle)
            const frameId = animData.animationData.params.addZero ? '01' : '1';
            const sprite = new PIXI.Sprite.from(animData.animationData.spriteName + frameId)
            this.enemiesContainer.addChildAt(sprite, 0)
            sprite.anchor.x = 0.2//animData.animationData.params.anchor.x
            sprite.anchor.y = 1//animData.animationData.params.anchor.y
        });
        this.enemiesContainer.children.sort((a, b) => { return a.height - b.height })
        for (let index = 0; index < this.enemiesContainer.children.length; index++) {
            const element = this.enemiesContainer.children[index];
            if (index > 0) {
                element.x = this.enemiesContainer.children[index - 1].x + this.enemiesContainer.children[index - 1].width * 0.6

            } else {
                element.x = 0
            }
        }
        this.enemiesContainer.scale.set(0.32)

        this.lockContainer.visible = isLock

        // for (let index = 0; index < data.waves.difficulty; index++) {
        //     const element = this.starsSprites[index];
        //     element.tint = 0xFFFFFF;
        // }

    }
    updateData() {
        let unlocked = 0
        for (let index = 0; index < this.levelsButton.length; index++) {
            const highScore = CookieManager.instance.getLevelComplete(this.fullData.views.id, index)
            const element = this.levelsButton[index];
            element.setStatus(highScore)
            if(highScore >= 0){
                unlocked ++
            }
            element.unlock();
        }
        
        if(unlocked >= 3){
            this.levelsButton[3].unlock();
        }else{
            this.levelsButton[3].lock();

        }
        // if (highScore > 0) {
        //     this.currentHighscore.text = 'COMPLETED\nHighscore: ' + highScore
        //     this.currentHighscore.visible = true;
        // } else {
        //     this.currentHighscore.text = 'Highscore: -'

        //     this.currentHighscore.visible = false;
        // }
    }
    updateSize(width, height) {

        this.maskShape.width = width - this.margin * 2
        this.maskShape.height = height - this.margin * 2

        this.maskShape.x = this.margin * 2;
        this.maskShape.y = this.margin

        this.enemiesContainer.x = this.margin * 2 + 10// width - this.enemiesContainer.width
        this.enemiesContainer.y = height - this.margin - 5

        this.shade.width = width - this.margin
        this.shade.height = height// 70

        this.shade.x = this.margin
        this.shade.y = height / 2 - this.shade.height / 2;

        this.baseButton.resize(width - this.margin * 2, height - this.margin * 2)
        this.containerBackground.width = width - this.margin * 2 - this.margin
        this.containerBackground.height = height - this.margin * 2

        this.containerBackground.x = this.margin * 2
        this.containerBackground.y = this.margin

        this.border.x = this.containerBackground.x
        this.border.y = this.containerBackground.y
        this.border.width = this.containerBackground.width
        this.border.height = this.containerBackground.height

        this.baseButton.x = this.containerBackground.x
        this.baseButton.y = this.containerBackground.y

        this.uiList.w = this.containerBackground.width
        this.uiList.h = this.containerBackground.height - 20
        this.uiList.updateHorizontalList()

        this.descriptionList.w = this.uiList.w
        this.descriptionList.h = this.uiList.h / 2
        this.descriptionList.updateHorizontalList()
        this.descriptionList.visible = false;

        this.bottomList.w = this.uiList.w * 0.66
        this.bottomList.x = this.uiList.w * 0.4
        this.bottomList.h = this.uiList.h / 2
        this.bottomList.y = this.uiList.h / 2
        this.bottomList.updateHorizontalList()


        this.lockSprite.width = this.containerBackground.width
        this.lockSprite.height = this.containerBackground.height

        this.lockIcon.x = this.lockSprite.width / 2
        this.lockIcon.y = this.lockSprite.height / 2
        this.lockContainer.x = this.containerBackground.x
        this.lockContainer.y = this.containerBackground.y



    }

}