import CharacterBuildScreenCustomizationView from "../customization/CharacterBuildScreenCustomizationView";
import CharacterCustomizationContainer from "../customization/CharacterCustomizationContainer";
import EntityBuilder from "../../../screen/EntityBuilder";
import Game from "../../../../Game";
import GameData from "../../../data/GameData";
import GameObject from "../../../core/gameObject/GameObject";
import GameView from "../../../core/view/GameView";
import LoadoutCardView from "../../deckBuilding/LoadoutCardView";
import LocalizationManager from "../../../LocalizationManager";
import PrizeCollectContainer from "../prizes/PrizeCollectContainer";
import PrizeManager from "../../../data/PrizeManager";
import RenderModule from "../../../core/modules/RenderModule";
import RewardsManager from "../../../data/RewardsManager";
import UIList from "../../../ui/uiElements/UIList";
import UIUtils from "../../../utils/UIUtils";
import Utils from "../../../core/utils/Utils";
import signals from "signals";

export default class GameOverView extends GameObject {
    constructor() {
        super();

        this.slotSize = 100;

        this.gameView = new GameView(this);
        this.gameView.layer = RenderModule.UILayerOverlay;
        this.gameView.view = new PIXI.Container();

        this.onConfirmGameOver = new signals.Signal();
        this.onRevivePlayer = new signals.Signal();
        this.container = this.gameView.view;



        this.blocker = new PIXI.Sprite.from('base-gradient');
        this.blocker.width = 1000
        this.blocker.height = 1000
        this.blocker.interactive = true;
        this.blocker.tint = 0;
        this.blocker.alpha = 1;
        this.container.addChildAt(this.blocker, 0);


        this.backShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, -5000, 10000, 10000)
        this.container.addChildAt(this.backShape, 0);
        this.backShape.tint = 0
        this.backShape.alpha = 0.8

        this.contentContainer = new PIXI.Container();
        this.container.addChild(this.contentContainer);

        this.infoBackContainer = new PIXI.Container()//new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0008'), 20, 20, 20, 20);
        this.sizeShape = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0008'), 20, 20, 20, 20);
        this.infoBackContainer.addChild(this.sizeShape)
        this.sizeShape.alpha = 0
        this.contentContainer.addChild(this.infoBackContainer);

        this.sizeShape.width = 600;
        this.sizeShape.height = 500;


        this.prizeBox = new PIXI.Container()//new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.infoBackContainer.addChild(this.prizeBox);

        this.prizeSizeShape = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0008'), 20, 20, 20, 20);
        this.prizeBox.addChild(this.prizeSizeShape)
        this.prizeSizeShape.alpha = 0

        this.prizeSizeShape.width = this.infoBackContainer.width - 20
        this.prizeSizeShape.height = this.infoBackContainer.height / 2 - 70
        this.prizeBox.x = 10
        this.prizeBox.y = this.infoBackContainer.height / 2 + 60


        this.victoryContainer = new PIXI.Container()
        this.infoBackContainer.addChild(this.victoryContainer);

        this.gameOverContainer = new PIXI.Container()
        this.infoBackContainer.addChild(this.gameOverContainer);

        this.defeatTitleBox = new PIXI.Container()//PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.gameOverContainer.addChild(this.defeatTitleBox);
        this.defeatTitleBox.width = this.infoBackContainer.width / 1.5
        this.defeatTitleBox.height = 80
        this.defeatTitleBox.x = this.infoBackContainer.width / 2 - this.defeatTitleBox.width / 2
        this.defeatTitleBox.y = -40


        const defeatStyle = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAngle: 1.5,
            dropShadowBlur: 5,
            fill: [
                "#ff0000",
                "#ff7b00"
            ],
            fontFamily: window.MAIN_FONT,
            fontSize: 96,
            fontVariant: "small-caps",
            fontWeight: "bolder",
            strokeThickness: 5
        });


        const victoryStyle = new PIXI.TextStyle({
            dropShadow: true,
            dropShadowAngle: 1.5,
            dropShadowBlur: 5,
            fill: [
                "#8cff00",
                "#00ffbf"
            ],
            fontFamily: window.MAIN_FONT,
            fontSize: 96,
            fontVariant: "small-caps",
            fontWeight: "bolder",
            strokeThickness: 5
        });


        this.defeatLabel = new PIXI.Text(LocalizationManager.instance.getLabel('DEFEAT'), defeatStyle);
        this.defeatLabel.anchor.set(0.5)
        this.defeatLabel.x = this.defeatTitleBox.width / 2
        this.defeatLabel.y = this.defeatTitleBox.height / 2
        this.defeatTitleBox.addChild(this.defeatLabel)


        this.blurDefeated = new PIXI.Sprite.from('round-blur')
        this.blurDefeated.anchor.set(0.5)
        this.blurDefeated.scale.set(Utils.scaleToFit(this.blurDefeated, 300))
        this.blurDefeated.scale.x = this.blurDefeated.scale.y * 1.2
        this.blurDefeated.x = this.infoBackContainer.width / 2
        this.gameOverContainer.addChild(this.blurDefeated)
        this.blurDefeated.tint = 0xfc0000
        this.blurDefeated.alpha = 0.5

        this.tryAgainLabel = UIUtils.getSpecialLabel1(LocalizationManager.instance.getLabel('GAME_OVER'), { fontSize: 48 })
        this.tryAgainLabel.anchor.set(0.5)
        this.tryAgainLabel.x = this.infoBackContainer.width / 2
        this.tryAgainLabel.y = this.infoBackContainer.height / 4 - 50
        this.gameOverContainer.addChild(this.tryAgainLabel)

        this.blurDefeated.y = this.tryAgainLabel.y

        // this.finalTimeLabel.anchor.set(0.5)
        //this.finalTimeLabel.x = this.infoBackContainer.width / 2
        //this.finalTimeLabel.y = this.infoBackContainer.height / 4 + 140
        //this.infoBackContainer.addChild(this.finalTimeLabel)

        this.titleBox = new PIXI.Container()//new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0004'), 20, 20, 20, 20);
        this.victoryContainer.addChild(this.titleBox);
        this.titleBox.width = this.infoBackContainer.width / 1.5
        this.titleBox.height = 80
        this.titleBox.x = this.infoBackContainer.width / 2 - this.titleBox.width / 2
        this.titleBox.y = -40


        this.victoryLabel = new PIXI.Text(LocalizationManager.instance.getLabel('VICTORY'), victoryStyle);
        this.victoryLabel.anchor.set(0.5)
        this.victoryLabel.x = this.titleBox.width / 2
        this.victoryLabel.y = this.titleBox.height / 2
        this.titleBox.addChild(this.victoryLabel)


        this.roundBlur = new PIXI.Sprite.from('round-blur')
        this.roundBlur.anchor.set(0.5)
        this.roundBlur.scale.set(Utils.scaleToFit(this.roundBlur, 300))
        this.roundBlur.scale.x = this.roundBlur.scale.y * 1.2
        this.roundBlur.x = this.infoBackContainer.width / 2
        this.victoryContainer.addChild(this.roundBlur)
        this.roundBlur.tint = 0xfc8c0b
        this.roundBlur.alpha = 0.5

        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(Utils.scaleToFit(this.shine, 220))
        this.shine.x = this.infoBackContainer.width / 2
        this.victoryContainer.addChild(this.shine)
        this.shine.tint = 0xfff700
        this.shine.alpha = 0.3


        this.congratulationsLabel = UIUtils.getSpecialLabel1(LocalizationManager.instance.getLabel('CONGRATULATIONS'), victoryStyle)
        this.congratulationsLabel.anchor.set(0.5)
        this.congratulationsLabel.style.fontSize = 48
        this.congratulationsLabel.style.fontWeight = 100
        this.congratulationsLabel.style.fill = [
            "#00ccff",
            "#00ffbf"
        ],
            this.congratulationsLabel.x = this.infoBackContainer.width / 2
        this.congratulationsLabel.y = 100//this.infoBackContainer.height / 4
        this.victoryContainer.addChild(this.congratulationsLabel)

        this.shine.y = this.congratulationsLabel.y
        this.roundBlur.y = this.congratulationsLabel.y

        this.enemyCountBox = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.enemyCountBox.width = this.infoBackContainer.width
        this.enemyCountBox.height = 350
        this.enemyCountBox.y = 150
        this.infoBackContainer.addChild(this.enemyCountBox);



        this.uiEndStatsList = new UIList();
        this.uiEndStatsList.h = 300;
        this.uiEndStatsList.w = 10;
        this.uiEndStatsList.x = this.infoBackContainer.width/2;
        this.enemyCountBox.addChild(this.uiEndStatsList)


        const sizeIcons = 40
        const deathIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('enemy-kill'))
        deathIcon.scale.set(Utils.scaleToFit(deathIcon, sizeIcons))
        deathIcon.anchor.set(1.1, 0)
        //this.uiEndStatsList.addElement(deathIcon,,{align:0} { fitHeight: 0.8, align: 1 })

        this.enemyCounnt = UIUtils.getSecondaryLabel('32659', { fontSize: 32 })
        
        this.enemyCounnt.addChild(deathIcon)

        const coinIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('softCurrency'))
        coinIcon.scale.set(Utils.scaleToFit(coinIcon, sizeIcons))
        coinIcon.anchor.set(1.1, 0)
        //this.uiEndStatsList.addElement(coinIcon,,{align:0} { fitHeight: 0.8, align: 1 })
        
        this.coinsCount = UIUtils.getSecondaryLabel('0', { fontSize: 32 })
        
        this.coinsCount.addChild(coinIcon)
        
        
        const hardIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('hardCurrency'))
        hardIcon.scale.set(Utils.scaleToFit(hardIcon, sizeIcons))
        hardIcon.anchor.set(1.1, 0)
        //this.uiEndStatsList.addElement(hardIcon,,{align:0} { fitHeight: 0.8, align: 1 })
        
        this.hardCount = UIUtils.getSecondaryLabel('0', { fontSize: 32 })
        
        this.hardCount.addChild(hardIcon)
        
        const specialIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('highscore'))
        specialIcon.scale.set(Utils.scaleToFit(specialIcon, sizeIcons))
        specialIcon.anchor.set(1.1, 0)
        //this.uiEndStatsList.addElement(specialIcon,,{align:0} { fitHeight: 0.8, align: 1 })
        
        this.specialCount = UIUtils.getSecondaryLabel('0', { fontSize: 32 })
        this.specialCount.addChild(specialIcon)
        
        const timeIcon = new PIXI.Sprite.from(UIUtils.getIconUIIcon('ingame-timer'))
        timeIcon.scale.set(Utils.scaleToFit(timeIcon, sizeIcons))
        timeIcon.anchor.set(1.1, 0)
        this.finalTimeLabel = UIUtils.getSecondaryLabel('0', { fontSize: 32 })
        
        this.uiEndStatsList.addElement(this.finalTimeLabel,{align:0})
        this.uiEndStatsList.addElement(this.hardCount,{align:0})
        this.uiEndStatsList.addElement(this.specialCount,{align:0})
        this.uiEndStatsList.addElement(this.enemyCounnt,{align:0})
        this.uiEndStatsList.addElement(this.coinsCount,{align:0})
        this.finalTimeLabel.addChild(timeIcon)


        this.uiEndStatsList.updateVerticalList()

        this.confirmButton = UIUtils.getPrimaryLargeLabelButton(() => {
            if (this.gameOverWin) {
                this.onConfirmGameOver.dispatch();
            } else {
                //this.showGameOverPrizes();
                this.redirect();
            }
        }, LocalizationManager.instance.getLabel('CONTINUE'))
        this.confirmButton.updateBackTexture('square_button_0005')

        this.contentContainer.addChild(this.confirmButton)


        this.prizesContainer = new PIXI.Container();
        this.prizeBox.addChild(this.prizesContainer)


        this.reviveButton = UIUtils.getPrimaryLargeLabelButton(() => {

            RewardsManager.instance.doReward(() => {

                this.onRevivePlayer.dispatch();
            }, {}, true)

        }, LocalizationManager.instance.getLabel('REVIVE'), UIUtils.getIconUIIcon('video'))
        this.reviveButton.updateBackTexture('square_button_0004')

        this.prizesContainer.addChild(this.reviveButton)


        this.collectButton = UIUtils.getPrimaryLargeLabelButton(() => {
            //this.collectPrizes();
            this.redirect(this.currentWinState);
        }, LocalizationManager.instance.getLabel('CONTINUE'))

        this.collectButton.updateBackTexture('square_button_0002')

        this.prizesContainer.addChild(this.collectButton)

    }

    show(win = true, data = {}, hasGameOverToken = true) {
        //win = !win

        this.currentWinState = win;
        if (!win) {
            SOUND_MANAGER.play('Musical-Beep-Loop-02', 0.5)
        } else {
            SOUND_MANAGER.play('magic', 0.75)
        }
        RewardsManager.instance.gameplayStop();
        this.endGameData = data;

        this.gameOverStarted = false;
        this.gameOverContainer.visible = !win
        this.victoryContainer.visible = win

        this.collectButton.interactive = true;
        this.collectButton.scale.set(1)

        this.gameOverWin = win;

        this.enemyCounnt.text = this.endGameData.enemiesKilled
        this.finalTimeLabel.text = Utils.floatToTime(Math.floor(Math.max(0, this.endGameData.time)));
        this.coinsCount.text = this.endGameData.coins;
        this.specialCount.text = this.endGameData.points

        this.uiEndStatsList.updateVerticalList()

        if (this.currentShowingPrizes) {
            this.currentShowingPrizes.forEach(element => {
                this.prizesContainer.removeChild(element)

            });
        }
        const hardCurrency = Math.max(0, Math.floor(this.endGameData.time / 60))

        if (win) {
            //const prizes = PrizeManager.instance.getMetaPrize([-1], 1, 3, false)
            //this.showPrize(prizes)

            this.confirmButton.visible = false;
            this.reviveButton.visible = false;

            this.collectButton.visible = true;
            this.collectButton.interactive = false;
            TweenLite.killTweensOf(this.collectButton)
            this.collectButton.alpha = 0;
            TweenLite.to(this.collectButton, 0.5, {
                delay: 0.5, alpha: 1, onStart: () => {
                    this.collectButton.interactive = true;
                }
            })

            this.hardCount.text = hardCurrency * 2

            GameData.instance.addHardCurrency(hardCurrency * 2)
            GameData.instance.addSpecialCurrency(this.endGameData.special)

        } else {
            this.hardCount.text = hardCurrency
            if (!hasGameOverToken) {
                this.showGameOverPrizes(0)
            } else {
                this.confirmButton.visible = true;
                this.reviveButton.visible = true;
                this.collectButton.visible = false;
            }
        }
    }
    collectPrizes() {

        if (this.gameOverStarted) {
            return;
        }

        this.gameOverStarted = true;
        this.currentShowingPrizes.forEach(element => {
            TweenLite.killTweensOf(element, true)

        });

        this.redirect();
    }
    redirect(fromWin) {

        setTimeout(() => {

            this.onConfirmGameOver.dispatch(fromWin);

        }, 10);

    }
    showGameOverPrizes() {
        this.reviveButton.visible = false;
        this.confirmButton.visible = false;

        this.collectButton.visible = true;
        this.collectButton.interactive = false;
        TweenLite.killTweensOf(this.collectButton)
        this.collectButton.alpha = 0;
        TweenLite.to(this.collectButton, 0.5, {
            delay: 0.5, alpha: 1, onStart: () => {
                this.collectButton.interactive = true;
            }
        })

        //const prizes = PrizeManager.instance.getMetaPrize([-1], 0, 1, false)
        //this.showPrize(prizes)


        const hardCurrency = Math.max(0, Math.floor(this.endGameData.time / 60))
        GameData.instance.addHardCurrency(hardCurrency)
        GameData.instance.addSpecialCurrency(this.endGameData.special)
    }
    enable() {
        super.enable();
        this.container.visible = true;
    }

    disable() {
        super.disable();
        this.container.visible = false;
    }
    update(delta, unscaledDelta) {
        super.update(delta, unscaledDelta);
        this.shine.rotation += unscaledDelta * 5
        if (!Game.IsPortrait) {
            this.contentContainer.scale.set(0.8)
        } else {
            this.contentContainer.scale.set(1)

        }

        this.contentContainer.x = Game.Borders.width / 2 - this.contentContainer.width / 2
        this.contentContainer.y = Utils.lerp(this.contentContainer.y, Game.Borders.height / 2 - this.contentContainer.height / 2 + 20, 0.5);
        this.infoBackContainer.y = 50
        this.confirmButton.x = this.infoBackContainer.width / 2 - this.confirmButton.width / 2
        this.confirmButton.y = 650

        this.reviveButton.scale.set(Math.cos(Game.Time * 15) * 0.05 + 0.95 + 0.2)
        this.reviveButton.x = this.prizeBox.width / 2 - this.reviveButton.width / 2
        this.reviveButton.y = 130
        this.collectButton.x = this.prizeBox.width / 2 - this.collectButton.width / 2
        this.collectButton.y = 150


        //this.prizesContainer.x = Utils.lerp(this.prizesContainer.x ,this.prizeBox.width / 2 - this.prizesContainer.width / 2, 0.5);
        this.prizesContainer.y = 20;


        this.blocker.width = Game.Borders.width
        this.blocker.height = Game.Borders.height

    }



    showPrize(data) {
        let drawPrizes = [];
        for (let index = 0; index < data.type.length; index++) {
            const element = data.type[index];
            const value = data.value[index];
            let entityData = null;
            let texture = '';
            switch (element) {
                case PrizeManager.PrizeType.Coin:
                    texture = 'coin1'
                    break;
                case PrizeManager.PrizeType.Companion:
                    entityData = EntityBuilder.instance.getCompanion(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Key:
                    texture = 'active_engine'
                    break;
                case PrizeManager.PrizeType.MasterKey:
                    texture = 'active_engine'
                    break;
                case PrizeManager.PrizeType.Mask:
                    entityData = EntityBuilder.instance.getMask(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Shoe:
                    entityData = EntityBuilder.instance.getShoe(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Trinket:
                    entityData = EntityBuilder.instance.getTrinket(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Weapon:
                    entityData = EntityBuilder.instance.getWeapon(value.id)
                    texture = entityData.entityData.icon
                    break;
                case PrizeManager.PrizeType.Wearable:
                    let tex = CharacterCustomizationContainer.instance.getSlotImage(value.value.area, value.value.id)
                    texture = tex
                    break;
            }
            drawPrizes.push({ texture, entityData, value })
        }
        console.log(data, drawPrizes)
        if (this.currentShowingPrizes) {
            this.currentShowingPrizes.forEach(element => {
                this.prizesContainer.removeChild(element)

            });
        }
        this.currentShowingPrizes = []
        for (var i = 0; i < drawPrizes.length; i++) {
            const element = drawPrizes[i];

            let prize = null
            if (element.entityData) {
                prize = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
                prize.setData(element.entityData, element.value.level, 70)
                prize.resetPivot()
                prize.hideLevelLabel()

            } else {


                prize = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', this.slotSize, this.slotSize);
                prize.setIcon(element.texture, 70)
                prize.resetPivot()
                prize.hideLevelLabel()

                //  prize = new PIXI.Sprite.from(element.texture)
                // prize.scale.set(Utils.scaleToFit(prize, 70))
            }
            prize.x = 110 * i + this.prizeBox.width / 2 - (drawPrizes.length * 110 / 2)

            this.currentShowingPrizes.push(prize)
            this.prizesContainer.addChild(prize)

            prize.alpha = 0;
            TweenLite.to(prize, 0.5, {
                delay: i * 0.25 + 0.35, alpha: 1, onStart: () => {
                }
            })

            prize.y = -20
            TweenLite.to(prize, 0.5, {
                delay: i * 0.25 + 0.35, y: 0, ease: Elastic.easeOut
            })

        }
    }

}