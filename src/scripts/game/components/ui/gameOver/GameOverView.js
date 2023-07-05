import EntityBuilder from "../../../screen/EntityBuilder";
import Game from "../../../../Game";
import GameObject from "../../../core/gameObject/GameObject";
import GameView from "../../../core/view/GameView";
import LoadoutCardView from "../../deckBuilding/LoadoutCardView";
import PrizeCollectContainer from "../prizes/PrizeCollectContainer";
import PrizeManager from "../../../data/PrizeManager";
import RenderModule from "../../../core/modules/RenderModule";
import UIList from "../../../ui/uiElements/UIList";
import UIUtils from "../../../utils/UIUtils";
import Utils from "../../../core/utils/Utils";
import signals from "signals";

export default class GameOverView extends GameObject {
    constructor() {
        super();

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
        this.blocker.alpha = 0.5;
        this.container.addChildAt(this.blocker, 0);


        this.contentContainer = new PIXI.Container();
        this.container.addChild(this.contentContainer);

        this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0008'), 20, 20, 20, 20);
        this.contentContainer.addChild(this.infoBackContainer);

        this.infoBackContainer.width = 500;
        this.infoBackContainer.height = 700;


        this.prizeBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.infoBackContainer.addChild(this.prizeBox);
        this.prizeBox.width = this.infoBackContainer.width - 20
        this.prizeBox.height = this.infoBackContainer.height / 2 - 70
        this.prizeBox.x = 10
        this.prizeBox.y = this.infoBackContainer.height / 2 + 60


        this.victoryContainer = new PIXI.Container()
        this.infoBackContainer.addChild(this.victoryContainer);

        this.gameOverContainer = new PIXI.Container()
        this.infoBackContainer.addChild(this.gameOverContainer);

        this.defeatTitleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0006'), 20, 20, 20, 20);
        this.gameOverContainer.addChild(this.defeatTitleBox);
        this.defeatTitleBox.width = this.infoBackContainer.width / 1.5
        this.defeatTitleBox.height = 80
        this.defeatTitleBox.x = this.infoBackContainer.width / 2 - this.defeatTitleBox.width / 2
        this.defeatTitleBox.y = -40

        this.defeatLabel = UIUtils.getSecondaryLabel('Defeated', { fontSize: 48 })
        this.defeatLabel.anchor.set(0.5)
        this.defeatLabel.x = this.defeatTitleBox.width / 2
        this.defeatLabel.y = this.defeatTitleBox.height / 2
        this.defeatTitleBox.addChild(this.defeatLabel)


        this.blurDefeated = new PIXI.Sprite.from('round-blur')
        this.blurDefeated.anchor.set(0.5)
        this.blurDefeated.scale.set(Utils.scaleToFit(this.blurDefeated, this.infoBackContainer.height / 3))
        this.blurDefeated.scale.x = this.blurDefeated.scale.y * 1.2
        this.blurDefeated.x = this.infoBackContainer.width / 2
        this.blurDefeated.y = this.infoBackContainer.height / 4
        this.gameOverContainer.addChild(this.blurDefeated)
        this.blurDefeated.tint = 0xfc0000
        this.blurDefeated.alpha = 0.5

        this.tryAgainLabel = UIUtils.getSpecialLabel1('Game Over!', { fontSize: 48 })
        this.tryAgainLabel.anchor.set(0.5)
        this.tryAgainLabel.x = this.infoBackContainer.width / 2
        this.tryAgainLabel.y = this.infoBackContainer.height / 4
        this.gameOverContainer.addChild(this.tryAgainLabel)

        this.finalTimeLabel = UIUtils.getSecondaryLabel('00:25', { fontSize: 24 })
        this.finalTimeLabel.anchor.set(0.5)
        this.finalTimeLabel.x = this.infoBackContainer.width / 2
        this.finalTimeLabel.y = this.infoBackContainer.height / 4 + 120
        this.gameOverContainer.addChild(this.finalTimeLabel)

        this.titleBox = new PIXI.NineSlicePlane(PIXI.Texture.from('modal_container0004'), 20, 20, 20, 20);
        this.victoryContainer.addChild(this.titleBox);
        this.titleBox.width = this.infoBackContainer.width / 1.5
        this.titleBox.height = 80
        this.titleBox.x = this.infoBackContainer.width / 2 - this.titleBox.width / 2
        this.titleBox.y = -40

        this.victoryLabel = UIUtils.getSecondaryLabel('Victory', { fontSize: 48 })
        this.victoryLabel.anchor.set(0.5)
        this.victoryLabel.x = this.titleBox.width / 2
        this.victoryLabel.y = this.titleBox.height / 2
        this.titleBox.addChild(this.victoryLabel)


        this.roundBlur = new PIXI.Sprite.from('round-blur')
        this.roundBlur.anchor.set(0.5)
        this.roundBlur.scale.set(Utils.scaleToFit(this.roundBlur, this.infoBackContainer.height / 3))
        this.roundBlur.scale.x = this.roundBlur.scale.y * 1.2
        this.roundBlur.x = this.infoBackContainer.width / 2
        this.roundBlur.y = this.infoBackContainer.height / 4
        this.victoryContainer.addChild(this.roundBlur)
        this.roundBlur.tint = 0xfc8c0b
        this.roundBlur.alpha = 0.5

        this.shine = new PIXI.Sprite.from('shine')
        this.shine.anchor.set(0.5)
        this.shine.scale.set(Utils.scaleToFit(this.shine, this.infoBackContainer.height / 3))
        this.shine.x = this.infoBackContainer.width / 2
        this.shine.y = this.infoBackContainer.height / 4
        this.victoryContainer.addChild(this.shine)
        this.shine.tint = 0xfff700
        this.shine.alpha = 0.5


        this.congratulationsLabel = UIUtils.getSpecialLabel1('Congratulations!', { fontSize: 48 })
        this.congratulationsLabel.anchor.set(0.5)
        this.congratulationsLabel.x = this.infoBackContainer.width / 2
        this.congratulationsLabel.y = this.infoBackContainer.height / 4
        this.victoryContainer.addChild(this.congratulationsLabel)


        this.enemyCountBox = new PIXI.NineSlicePlane(PIXI.Texture.from('grid1'), 50, 0, 50, 0);
        this.enemyCountBox.width = this.infoBackContainer.width
        this.enemyCountBox.height = 50
        this.enemyCountBox.y = this.infoBackContainer.height / 2
        this.infoBackContainer.addChild(this.enemyCountBox);



        this.uiEndStatsList = new UIList();
        this.uiEndStatsList.h = 50;
        this.uiEndStatsList.w = this.infoBackContainer.width - 50;
        this.enemyCountBox.addChild(this.uiEndStatsList)


        const deathIcon = new PIXI.Sprite.from('new_item')
        this.uiEndStatsList.addElement(deathIcon, { fitHeight: 0.8, align: 1 })

        this.enemyCounnt = UIUtils.getSecondaryLabel('32659', { fontSize: 32 })
        this.uiEndStatsList.addElement(this.enemyCounnt)


        const coinIcon = new PIXI.Sprite.from('coin1l')
        this.uiEndStatsList.addElement(coinIcon, { fitHeight: 0.8, align: 1 })

        this.coinsCount = UIUtils.getSecondaryLabel('32659', { fontSize: 32 })
        this.uiEndStatsList.addElement(this.coinsCount)


        this.uiEndStatsList.updateHorizontalList()





        this.confirmButton = UIUtils.getPrimaryLargeLabelButton(() => {
            if (this.gameOverWin) {
                this.onConfirmGameOver.dispatch();
            } else {
                this.showGameOverPrizes();
            }
        }, 'Continue')
        this.confirmButton.updateBackTexture('square_button_0005')

        this.contentContainer.addChild(this.confirmButton)


        this.prizesContainer = new PIXI.Container();
        this.prizeBox.addChild(this.prizesContainer)


        this.reviveButton = UIUtils.getPrimaryLargeLabelButton(() => {
            this.onRevivePlayer.dispatch();
        }, 'Revive', 'video-trim')
        this.reviveButton.updateBackTexture('square_button_0004')

        this.prizesContainer.addChild(this.reviveButton)


        this.collectButton = UIUtils.getPrimaryLargeLabelButton(() => {
            this.collectPrizes();
        }, 'Collect')
        this.collectButton.updateBackTexture('square_button_0001')

        this.prizesContainer.addChild(this.collectButton)

    }

    show(win = true, data = {}, hasGameOverToken = true) {
        //win = !win

        this.gameOverStarted = false;
        this.gameOverContainer.visible = !win
        this.victoryContainer.visible = win

        this.collectButton.interactive = true;
        this.collectButton.scale.set(1)

        this.gameOverWin = win;

        this.enemyCounnt.text = data.enemiesKilled
        this.finalTimeLabel.text = Utils.floatToTime(Math.floor(data.time));


        this.uiEndStatsList.updateHorizontalList()

        if (this.currentShowingPrizes) {
            this.currentShowingPrizes.forEach(element => {
                this.prizesContainer.removeChild(element)

            });
        }

        if (win) {
            const prizes = PrizeManager.instance.getMetaPrize([-1], 1, 2, false)
            this.showPrize(prizes)

            this.confirmButton.visible = false;
            this.reviveButton.visible = false;
            this.collectButton.visible = true;
        } else {
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

        if(this.gameOverStarted){
            return;
        }
        console.log("ADD PARTICLES HERE")

        this.gameOverStarted = true;
        this.currentShowingPrizes.forEach(element => {
            TweenLite.killTweensOf(element, true)

        });


        setTimeout(() => {
            this.onConfirmGameOver.dispatch();
        }, 500);

    }
    showGameOverPrizes() {
        this.reviveButton.visible = false;
        this.confirmButton.visible = false;
        this.collectButton.visible = true;

        const prizes = PrizeManager.instance.getMetaPrize([-1], 0, 1, false)
        this.showPrize(prizes)
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
        this.confirmButton.x = this.infoBackContainer.width / 2 - this.confirmButton.width / 2
        this.confirmButton.y = 740

        this.reviveButton.scale.set(Math.cos(Game.Time * 15) * 0.05 + 0.95 + 0.2)
        this.reviveButton.x = this.prizeBox.width / 2 - this.reviveButton.width / 2
        this.reviveButton.y = this.prizeBox.height / 2 - this.reviveButton.height / 2
        this.collectButton.x = this.prizeBox.width / 2 - this.collectButton.width / 2
        this.collectButton.y = 120


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
                    texture = 'coin3l'
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
                    texture = UIUtils.getIconUIIcon(element)
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
                prize = new LoadoutCardView(UIUtils.baseButtonTexture + '_0006', 100, 100);
                prize.setData(element.entityData, element.value.level)
                prize.resetPivot()
            } else {
                prize = new PIXI.Sprite.from(element.texture)
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