import * as PIXI from 'pixi.js';
import * as signals from 'signals';
import utils from '../../../utils';
import TextBox from '../../ui/TextBox';

export default class GameTutorial extends PIXI.Container {
    constructor(mainScreen) {
        super();

        this.mainScreen = mainScreen;

        this.tutorialSteps = [
            {
                text: 'tutorial_1',
                target: this.mainScreen.resourceSystemRight.resourceSlots[0].backShape,
                callback: () => {
                    this.mainScreen.resourceSystemRight.purchaseSlot(this.mainScreen.resourceSystemRight.resourceSlots[0])
                },
                handOffset: { x: -10, y: 60 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: -40, y: 0 }

            },
            {
                text: 'tutorial_2',
                handOffset: { x: 0, y: 30 },
                hitOffset: { x: 0, y: 0 },
                handMoveTo: { x: 0, y: -80 },
                textBoxOffset: { x: -40, y: 0 },
                onShow: () => {                    
                    setTimeout(() => {
                        this.next();
                    }, 3000);

                },
                hideHitBox: true,
                target: this.mainScreen.resourceSystemRight.resourceSlots[0].backShape,
                event: this.mainScreen.resourceSystemRight.resourceSlots[0].onOver,
            },
            {
                text: 'tutorial_3',
                target: this.mainScreen.openShop.backShape,
                toShow: [this.mainScreen.openShop, this.mainScreen.shopButtonsList],
                callback: () => {
                    this.mainScreen.openPopUp(this.mainScreen.entityShop);
                },
                handOffset: { x: 0, y: 0 },
                hitOffset: { x: -40, y: -40 },
                textBoxOffset: { x: 60, y: -40 }
            },
            {
                text: 'tutorial_4',
                targetF: () => {
                    return this.mainScreen.entityShop.currentItens[0].shopButton
                },
                toShow: [this.mainScreen.openShop, this.mainScreen.shopButtonsList],
                onShow: () => {
                    window.gameEconomy.addResources(25);
                },
                callback: () => {
                    this.mainScreen.entityShop.currentItens[0].onShopItem(this.mainScreen.entityShop.currentItens[0].shopButton);
                    setTimeout(() => {
                        this.mainScreen.entityShop.hide();
                    }, 150);
                    this.mainScreen.statsList.visible = true;
                },
                handOffset: { x: 40, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: -40, y: -20 }
            },
            {
                text: 'tutorial_5',
                target: this.mainScreen.mergeSystem1.pieceGeneratorsList[0].backShape,
                toShow: [this.mainScreen.enemiesContainer, this.mainScreen.uiContainer, this.mainScreen.mergeSystemContainer],
                onShow: () => {
                    this.mainScreen.openShop.visible = false;
                },
                hideHitBox: true,
                event: this.mainScreen.mergeSystem1.onEntityAdd,
                handMoveTo: { x: 0, y: -180 },
                handOffset: { x: 0, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: 80, y: -280 }
            },
            {
                text: 'tutorial_6',
                target: this.mainScreen.mergeSystem1.pieceGeneratorsList[0].backShape,
                toShow: [this.mainScreen.enemiesContainer, this.mainScreen.uiContainer, this.mainScreen.mergeSystemContainer],
                onShow: () => {
                },
                hideHitBox: true,
                event: this.mainScreen.mergeSystem1.onEntityMerge,
                handMoveTo: { x: 0, y: -180 },
                handOffset: { x: 0, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: 80, y: -280 }
            },
            {
                text: 'tutorial_7',
                target: this.mainScreen.openMergeShop.backShape,
                toShow: [this.mainScreen.openMergeShop, this.mainScreen.shopButtonsList],
                callback: () => {
                    window.gameEconomy.addResources(25);
                    this.mainScreen.openPopUp(this.mainScreen.mergeItemsShop);
                    this.mainScreen.openPopUp(this.mainScreen.mergeItemsShop);
                    COOKIE_MANAGER.endTutorial(1);

                    this.mainScreen.mergeItemsShop.updateToggleValue()
                },
                handOffset: { x: 0, y: 0 },
                hitOffset: { x: -40, y: -40 },
                textBoxOffset: { x: -40, y: -40 }
            },
            {
                text: 'tutorial_8',
                targetF: () => {
                    return this.mainScreen.mergeItemsShop.currentItens[0].shopButton
                },
                toShow: [],
                callback: () => {
                    this.mainScreen.mergeItemsShop.currentItens[0].onShopItem(this.mainScreen.mergeItemsShop.currentItens[0].shopButton);
                    setTimeout(() => {
                        this.mainScreen.mergeItemsShop.hide();
                    }, 150);
                },
                handOffset: { x: 40, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: -40, y: -20 }
            },
            {
                text: 'tutorial_9',
                target: this.mainScreen.openSettingsShop.backShape,
                toShow: [this.mainScreen.openSettingsShop, this.mainScreen.shopButtonsList],
                onShow: () => {
                    this.mainScreen.openShop.visible = false;
                    this.mainScreen.openMergeShop.visible = false;
                },
                callback: () => {
                    window.gameEconomy.addResources(3000);
                    this.mainScreen.openPopUp(this.mainScreen.generalShop);
                },
                handOffset: { x: 0, y: 0 },
                hitOffset: { x: -40, y: -40 },
                textBoxOffset: { x: 250, y: -40 }
            },
            {
                text: 'tutorial_10',
                targetF: () => {
                    return this.mainScreen.generalShop.currentItens[0].shopButton
                },
                toShow: [],
                callback: () => {
                    this.mainScreen.generalShop.currentItens[0].onShopItem(this.mainScreen.generalShop.currentItens[0].shopButton);
                    setTimeout(() => {
                        this.mainScreen.generalShop.hide();
                    }, 150);
                },
                handOffset: { x: 40, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: -40, y: -20 }
            },
            //  {
            //     text: 'tutorial_11',
            //     targetF: () => {
            //         return this.mainScreen.damageBonus
            //     },
            //     toShow: [this.mainScreen.bonusTimerList, this.mainScreen.damageBonus],
            //     callback: () => {
            //         this.mainScreen.damageBonus.confirmConfirm();
            //     },
            //     handOffset: { x: 0, y: 30 },
            //     hitOffset: { x: -60, y: -40 },
            //     textBoxOffset: { x: -120, y: 0 }
            // },
            {
                text: 'tutorial_12',
                target: this.mainScreen.mergeSystemContainer,
                toShow: [],
                onShow: () => {
                    this.handIconContainer.visible = false;
                    this.visibleList.forEach(element => {
                        element.visible = true;
                    });
                    setTimeout(() => {
                        this.endTutorial(2);
                    }, 8000);
                },
                callback: () => {
                },
                hideHitBox: true,
                handOffset: { x: 40, y: 0 },
                hitOffset: { x: 0, y: 0 },
                textBoxOffset: { x: 140, y: -200 }
            },
        ]
        this.boundingButtom = new PIXI.Graphics().beginFill(0x445566).drawRect(0, 0, 140, 140);
        this.addChild(this.boundingButtom);
        this.boundingButtom.alpha = 0
        this.boundingButtom.interactive = true;
        this.boundingButtom.buttonMode = true;
        this.boundingButtom.on('mousedown', this.onTutorialCallback.bind(this)).on('touchstart', this.onTutorialCallback.bind(this));

        this.handIcon = new PIXI.Sprite.from('hand')
        this.handIcon.anchor.set(0.1, 0.1)

        this.handIconContainer = new PIXI.Container();
        this.handIconContainer.addChild(this.handIcon);
        this.addChild(this.handIconContainer);

        this.handIconContainer.x = 500
        this.handIconContainer.y = 2500

        this.textBox = new TextBox(20, 'small-no-pattern-white');
        this.addChild(this.textBox);
        this.textBox.label.style.fontSize = 22
        this.textBox.label.style.fill = 0x15376c

        this.textBox.updateText("Test")

        this.currentListener = null;
        this.currentCallback = null;
        this.tutorialStep;
        this.tutorialStepID = 10;
    }
    onEventNext() {
        if (!this.currentListener) return;
        this.currentListener.remove(this.onEventNext.bind(this))
        this.next()
    }
    endTutorial() {
        this.visibleList.forEach(element => {
            element.visible = true;
        });
        this.started = false;
        this.visible = false;

        COOKIE_MANAGER.endTutorial();
    }
    start() {
        //console.log(this.mainScreen.entityShop.currentItems[0])
        this.started = true

        this.visibleList = []

        this.visibleList.push(this.mainScreen.entityShop.openShop)
        this.visibleList.push(this.mainScreen.mergeItemsShop.openShop)
        this.visibleList.push(this.mainScreen.generalShop.openShop)

        this.visibleList.push(this.mainScreen.enemiesContainer)
        this.visibleList.push(this.mainScreen.bonusTimerList)
        this.visibleList.push(this.mainScreen.shopButtonsList)
        this.visibleList.push(this.mainScreen.openShop)
        this.visibleList.push(this.mainScreen.openMergeShop)
        this.visibleList.push(this.mainScreen.openSettingsShop)
        this.visibleList.push(this.mainScreen.resourcesContainer)
        this.visibleList.push(this.mainScreen.statsList)
        this.visibleList.push(this.mainScreen.shopsLabel)
        this.visibleList.push(this.mainScreen.mergeSystemContainer)
        this.visibleList.push(this.mainScreen.uiContainer)

        this.visibleList.push(this.mainScreen.damageBonus)
        this.visibleList.push(this.mainScreen.timeBonus)
        this.visibleList.push(this.mainScreen.speedBonus)
        this.visibleList.push(this.mainScreen.autoMergeBonus)
        this.visibleList.push(this.mainScreen.prizeContainer)
        this.visibleList.push(this.mainScreen.bonusContainer)

        this.visibleList.forEach(element => {
            element.visible = false;
        });

        this.tutorialStepID = 0;
        this.updateStep();

    }

    onTutorialCallback() {
        this.currentCallback();

        this.currentCallback = null;
        this.next();
    }
    next() {
        console.log(this.tutorialStepID)
        this.tutorialStepID++;
        if (this.currentListener) {
            this.currentListener.remove(this.onEventNext.bind(this))
        }
        this.updateStep();
    }
    updateStep() {
        if (this.tutorialStepID >= this.tutorialSteps.length) {
            console.log("END")
            return;
        }
        this.tutorialStep = this.tutorialSteps[this.tutorialStepID]

        if (this.tutorialStep.toShow) {
            this.tutorialStep.toShow.forEach(element => {
                element.visible = true;
            });
        }

        if (this.tutorialStep.onShow) {
            this.tutorialStep.onShow();
        }


        this.textBox.updateText(window.localizationManager.getLabelTutorial(this.tutorialStep.text))
        this.currentListener = null;
        if (this.tutorialStep.timer) {
            setTimeout(() => {
                //this.next();
            }, this.tutorialStep.timer);
        } else {
            if (this.tutorialStep.event) {
                setTimeout(() => {
                    this.currentListener = this.tutorialStep.event
                    this.currentListener.add(this.onEventNext.bind(this))

                }, 1000);
            } else {

                this.currentCallback = this.tutorialStep.callback;
            }
        }



        var element = this.tutorialStep.target;
        if (!element && this.tutorialStep.targetF) {
            element = this.tutorialStep.targetF()
        }
        this.fitBounding(element);
    }


    fitText(element) {
    }
    fitBounding(element, delta) {
        if (!element) {
            this.boundingButtom.visible = false;
            return;
        }

        let hitOffset = this.tutorialStep.hitOffset
        if (!hitOffset) hitOffset = { x: 0, y: 0 }

        let handOffset = this.tutorialStep.handOffset
        if (!handOffset) handOffset = { x: 0, y: 0 }

        let textBoxOffset = this.tutorialStep.textBoxOffset
        if (!textBoxOffset) textBoxOffset = { x: 0, y: 0 }

        this.boundingButtom.visible = !this.tutorialStep.hideHitBox;
        let toGlobal = element.getGlobalPosition();
        let toLocal = this.toLocal(toGlobal)
        this.boundingButtom.x = toLocal.x + hitOffset.x - 10
        this.boundingButtom.y = toLocal.y + hitOffset.y - 10
        this.boundingButtom.width = element.width + 50
        this.boundingButtom.height = element.height + 30


        this.handIconContainer.x = utils.lerp(this.handIconContainer.x, this.boundingButtom.x + element.width / 2 + handOffset.x, 0.05)
        this.handIconContainer.y = utils.lerp(this.handIconContainer.y, this.boundingButtom.y + element.height / 2 + handOffset.y, 0.05)

        this.textBox.x = this.boundingButtom.x + element.width / 2 + handOffset.x - this.textBox.width + textBoxOffset.x;
        this.textBox.y = this.boundingButtom.y + element.height / 2 + handOffset.y - this.textBox.height + textBoxOffset.y

        if (this.tutorialStep.handMoveTo) {
            this.handIcon.x = utils.lerp(this.handIcon.x, this.tutorialStep.handMoveTo.x, 0.01)
            this.handIcon.y = utils.lerp(this.handIcon.y, this.tutorialStep.handMoveTo.y, 0.01)

            if (utils.distance(this.handIcon.x, this.handIcon.y, this.tutorialStep.handMoveTo.x, this.tutorialStep.handMoveTo.y) < 10) {
                this.handIcon.x = 0
                this.handIcon.y = 0
            }
        } else {
            this.handIcon.x = 0
            this.handIcon.y = 0
        }

    }

    update(delta) {
        if (!this.started) return
        var element = this.tutorialStep.target;
        if (!element && this.tutorialStep.targetF) {
            element = this.tutorialStep.targetF()
        }
        this.fitBounding(element, delta);
    }
}