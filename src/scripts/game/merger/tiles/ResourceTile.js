import * as PIXI from 'pixi.js';

import CircleCounter from '../../ui/hudElements/CircleCounter';
import MergeTile from './MergeTile';
import Signals from 'signals';
import UIBar from '../../ui/uiElements/UIBar';
import utils from '../../../utils';
import ProgressBar from '../ProgressBar';

export default class ResourceTile extends MergeTile {
    constructor(i, j, size, lockIcon) {
        super(i, j, size, lockIcon);



        this.onCompleteCharge = new Signals();

        this.resourceSource = new PIXI.Sprite.from('backTiles')
        this.container.addChildAt(this.resourceSource, 0)
        this.resourceSource.anchor.set(0.5)
        this.resourceSource.x = size / 2 * 0.8
        this.resourceSource.y = size / 2 * 0.8
        this.resourceSource.visible = false;

        this.backShape.alpha = 0

        this.resourceReadyToCollectSprite = new PIXI.Sprite.from('shine')
        this.container.addChildAt(this.resourceReadyToCollectSprite, 0)
        this.resourceReadyToCollectSprite.anchor.set(0.5)
        this.resourceReadyToCollectSprite.x = size / 2
        this.resourceReadyToCollectSprite.y = size / 2
        this.resourceReadyToCollectSprite.visible = false;
        this.resourceReadyToCollectSprite.scale.set(size / this.resourceReadyToCollectSprite.width)
        this.resourceReadyToCollectSprite.tint = 0x00ee33
        this.resourceReadyToCollectSprite.alpha = 0




        this.collectLabelContainer = new PIXI.Container()
        this.container.addChild(this.collectLabelContainer)

        this.readyLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.readyLabel.style.fontSize = 32
        //this.readyLabel.style.stroke = 0xffffff
        this.readyLabel.style.strokeThickness = 8
        this.readyLabel.style.fill = 0xffffff//0x00ee33
        this.collectCoinIcon = new PIXI.Sprite.from('coin')
        this.collectLabelContainer.addChild(this.collectCoinIcon)

        this.collectCoinIcon.scale.set(this.readyLabel.height / this.collectCoinIcon.height + 0.1)
        this.collectLabelContainer.addChild(this.readyLabel)
        this.readyLabel.x = this.collectCoinIcon.width + 2
        this.collectLabelContainer.x = this.backSlot.width / 2 - this.collectLabelContainer.width / 2;
        this.collectLabelContainer.visible = false;


        this.priceLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.container.addChild(this.priceLabel)
        this.priceLabel.style.fontSize = 32
        this.priceLabel.x = this.backSlot.width / 2 - this.label.width / 2;
        this.priceLabel.visible = false;



        this.costLabelContainer = new PIXI.Sprite.from(('large-square-pattern'))
        // this.costLabelContainer.width = 100
        // this.costLabelContainer.height = 30 
        this.container.addChild(this.costLabelContainer)

        this.costLabelContainer.texture = PIXI.Texture.from('large-square-pattern')

        this.initialCostLabel = new PIXI.Text('Ready', LABELS.LABEL1);
        this.initialCostLabel.style.fontSize = 32
        this.initialCostLabel.style.stroke = 0
        this.initialCostLabel.style.strokeThickness = 6


        this.costLabelContainer.x = this.backSlot.width / 2 - this.costLabelContainer.width / 2;
        this.costLabelContainer.y = this.backSlot.height - this.costLabelContainer.height;

        this.exclamationMark = new PIXI.Sprite.from('new_item')
        this.exclamationMark.anchor.set(0.5)
        this.exclamationMark.x = this.costLabelContainer.width
        this.costLabelContainer.addChild(this.exclamationMark)
        this.costLabelContainer.addChild(this.initialCostLabel)
        //this.initialCostLabel.visible = false;

        this.label.visible = false
        this.currentCollect = 0;

        this.levelBar = new ProgressBar({ width: 64, height: 12 }, 3, 3)
        this.levelBar.updateBackgroundFront(0x00FF00)
        this.levelBar.updateBackgroundColor(0x20552c)
        this.levelBar.y = size / 2 + 30
        this.levelBar.x = size / 2
        this.container.addChild(this.levelBar)

        this.particleCounter = 0


        this.particlesDelay = 0;
        // this.circleCounter = new CircleCounter(20,20)
        // this.container.addChild(this.circleCounter)
        // this.circleCounter.build()

        this.container.removeChild(this.damageTimerView)

        this.drillSin = Math.random() * 3.14 * 2

        this.textUpdateTimer = 0;

        window.gameModifyers.onActiveBonus.add((type) => {
            if (type == 'autoCollect') {
                this.findAutoCollect()
            }
        })
    }
    resetTile() {
        this.textUpdateTimer = 0;
        if (this.targetData) {
            this.setTargetData(this.targetData)
            this.removeEntity();
            this.readyToCollect = false;
        }
    }

    update(delta, timestamp) {
        //console.log(timestamp)

        super.update(delta, timestamp);
        if (this.particlesDelay > 0) {
            this.particlesDelay -= delta;
        }

        if (this.readyToCollect) {
            if (this.textUpdateTimer <= 0) {
                this.readyLabel.text = '+' + utils.formatPointsLabel(this.currentCollect)
                this.textUpdateTimer = 1
                this.collectLabelContainer.x = this.backSlot.width / 2 - this.collectLabelContainer.width / 2;
            } else {
                this.textUpdateTimer -= delta;
            }

        }
        //console.log(this.generateResource ,this.generateResourceTime)
        this.collectLabelContainer.visible = this.readyToCollect
        this.resourceReadyToCollectSprite.visible = this.readyToCollect
        if (this.readyToCollect) {
            this.resourceReadyToCollectSprite.alpha = utils.lerp(this.resourceReadyToCollectSprite.alpha, 0.5, 0.05)
            this.resourceReadyToCollectSprite.rotation += delta;
        } else {
            this.resourceReadyToCollectSprite.alpha = 0;
        }
        if (this.tileData) {
            this.sin += delta * Math.min(15 * window.gameModifyers.modifyersData.drillSpeed * 0.1, 40)
            this.drillSin += delta * Math.min(5 * window.gameModifyers.modifyersData.drillSpeed * 0.1, 40)
            this.levelBar.visible = true;
            this.levelBar.setProgressBar(this.generateResourceNormal, 0, true);


            this.levelBar.x = this.resourceReadyToCollectSprite.x - 32
            //this.circleCounter.update(this.generateResourceNormal, true)

            this.costLabelContainer.visible = false;
            if (this.particleCounter <= 0) {
                this.onShowParticles.dispatch(this)
                this.particleCounter = 1
            } else {
                this.particleCounter -= delta;
            }
        } else {
            this.levelBar.visible = false;
            this.costLabelContainer.visible = true;

            this.exclamationMark.visible = this.targetData.rawData.isFirst || window.gameEconomy.currentResources >= this.targetData.rawData.initialCost

            if (this.exclamationMark.visible) {
                this.backSlot.buttonMode = true;
                this.initialCostLabel.style.fill = 0xFFFFFF
                this.costLabelContainer.texture = PIXI.Texture.from('large-square-pattern-green')
            } else {
                this.backSlot.buttonMode = false;
                this.initialCostLabel.style.fill = 0xFF5533
                this.costLabelContainer.texture = PIXI.Texture.from('large-square-pattern-grey')
            }

            this.sin += delta
            this.drillSin += delta
            this.updateResourcePosition();
        }

    }
    forcePriceToZero() {
        this.updatePriceLabel(utils.formatPointsLabel(0))
        this.initialCost = 0;
    }
    setTargetData(data) {
        this.targetData = data;

        if (this.targetData.rawData.tileImageSrc) {
            this.resourceSource.texture = PIXI.Texture.from(this.targetData.rawData.tileImageSrc)
            this.resourceSource.visible = true;
            this.resourceSource.scale.set(this.size / this.resourceSource.width * this.resourceSource.scale.x * 0.6)
            this.resourceSource.scale.set(1)
            this.resourceSource.x = this.backSlot.height / 2
        }
        this.updatePriceLabel(utils.formatPointsLabel(this.targetData.rawData.initialCost))
        this.initialCost = this.targetData.rawData.initialCost
    }
    updatePriceLabel(value) {
        this.initialCostLabel.text = value
        this.initialCostLabel.x = this.costLabelContainer.width / 2 - this.initialCostLabel.width / 2;
        this.initialCostLabel.y = this.costLabelContainer.height / 2 - this.initialCostLabel.height / 2 - 1;
    }
    addEntity(tile) {
        super.addEntity(tile);
    }
    updatePosition() {

        if (this.tileData) {
            if (this.tileData.isRight) {
                this.positionOffset.x = 60 + this.entityScale + Math.cos(this.drillSin) * 4
                this.tileSprite.scale.x = Math.abs(this.tileSprite.scale.x)

            } else {

                this.positionOffset.x = -60 - this.entityScale + Math.cos(this.drillSin) * 4
                this.positionOffset.y = -this.tileSprite.height * (1 - this.tileSprite.anchor.y)
                this.tileSprite.scale.x = Math.abs(this.tileSprite.scale.x) * -1
            }
        }

        this.resourceSource.x = this.backSlot.height / 2 + Math.sin(this.sin)

        this.tileSprite.x = this.backSlot.width / 2 + this.positionOffset.x;
        this.tileSprite.y = this.backSlot.height / 2 + this.positionOffset.y;
    }
    updateResourcePosition() {
        this.resourceSource.y = this.backSlot.height / 2 + Math.sin(this.sin) * 5
    }
    enterAnimation() {
        this.tileSprite.anchor.set(0.5, 0.8)
        this.entityScale = this.size / this.tileSprite.width * 0.5 * this.tileSprite.scale.x
        this.tileSprite.scale.set(this.entityScale)
        this.tileSprite.alpha = 0
        this.animSprite = true;
        this.updatePosition();
        TweenLite.to(this.tileSprite, 0.25, {
            alpha: 1
        })
    }
    updateResource(delta, dateTimeStamp) {
        if (!this.tileData) return;
        if (this.readyToCollect && !this.tileData.shouldAccumulateResources()) {
            return;
        }
        super.updateResource(delta, dateTimeStamp)
    }
    startCharging() {
        this.tileData = null;
        this.currentChargeTime = this.defaultChargeTime;
        this.levelBar.visible = true;
        this.levelBar.setProgressBar(0, 0, true);
    }
    completeCharge() {
        this.onCompleteCharge.dispatch();
    }
    lookAt(target) {

    }
    updateSavedStats(stats) {
        this.tileData.setLevel(stats.currentLevel)


    }
    resourceReady() {
        this.readyToCollect = true;

        if (window.gameModifyers.bonusData.resourceSpeed == 1) {
            this.generateResourceTime = this.generateTimeDefault
        }

        this.currentCollect += this.tileData.getResources();

        if (this.tileData.getGenerateResourceTime() > 0.1) {
            COOKIE_MANAGER.addPendingResource(this.tileData, this.currentCollect)
        }
        this.findAutoCollect();

        //this.onGenerateResource.dispatch(this, this.tileData);
    }
    findAutoCollect() {
        if (!this.readyToCollect) return;
        if (window.gameModifyers.modifyersData.autoCollectResource || window.gameModifyers.bonusData.autoCollectResource) {

            let quant = 3;
            if (this.particlesDelay > 0) {
                quant = 0;
            }

            if (this.particlesDelay <= 0) {
                this.particlesDelay = 2
            }


            //window.gameEconomy.addResources(this.currentCollect)
            //console.log(quant)
            //this.onGenerateResource.dispatch(this, this.tileData, this.currentCollect, quant, true);
            this.collectResources()

        }
    }
    collectResources() {
        if (!this.readyToCollect) return
        this.onGenerateResource.dispatch(this, this.tileData, this.currentCollect, true);
        this.readyToCollect = false;
        this.resourceReadyToCollectSprite.alpha = 0
        this.generateResourceNormal = 0
        this.levelBar.setProgressBar(this.generateResourceNormal, 0);
    }
    onMouseMoveOver(forced = false) {
        this.overState()
        if ((this.isOver || forced) && this.readyToCollect) {
            let skipParticles = this.particlesDelay <= 0
            this.onGenerateResource.dispatch(this, this.tileData, this.currentCollect, skipParticles);
            if (this.particlesDelay <= 0) {
                this.particlesDelay = 2
            }
            this.readyToCollect = false;
            this.currentCollect = 0;
        }
    }
    onMouseUp(e) {
        this.onMouseMoveOver(true)
        this.isOver = false;
        this.mouseDown = false;
        this.onUp.dispatch(this);

    }
    hold() {
        if (!this.tileData) {
            return;
        }
        this.label.visible = false
        this.holding = true;
        this.onHold.dispatch(this);
    }
    onMouseCancel(e) {
        this.isOver = false;
        this.outState();
        if (!this.mouseDown) {
            return;
        }
    }
}