import * as PIXI from 'pixi.js';

import AcessoryData from '../../data/AcessoryData';
import BaseButton from '../ui/BaseButton';
import CompanionData from '../../data/CompanionData';
import EntityData from '../../data/EntityData';
import Game from '../../../Game';
import GameData from '../../data/GameData';
import InteractableView from '../../view/card/InteractableView';
import LoadoutCardView from '../deckBuilding/LoadoutCardView';
import MergeCardView from './MergeCardView';
import Pool from '../../core/utils/Pool';
import PrizeManager from '../../data/PrizeManager';
import UIUtils from '../../core/utils/UIUtils';
import Utils from '../../core/utils/Utils';
import signals from 'signals';

export default class ItemMergeSystem {
    constructor(container, slotSize = 100) {
        this.container = container;
        this.slotSize = slotSize;
        this.tempMergeDraw = [];

        this.mergeContainer = new PIXI.Container();
        this.container.addChild(this.mergeContainer);

        this.modalTexture = 'modal_container0006'

        this.containerBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(this.modalTexture), 20, 20, 20, 20);
        this.containerBackground.width = 500
        this.containerBackground.height = 120

        this.cardsContainer = new PIXI.Container();
        this.mergeContainer.addChild(this.containerBackground)
        this.mergeContainer.addChild(this.cardsContainer)


        this.mergeSectionButton = UIUtils.getPrimaryLabelButton(() => {
            this.combineCurrentItems();
        }, "Combine")
        this.container.addChild(this.mergeSectionButton)
        this.mergeSectionButton.resize(250, 80)

        this.previews = [];
        const cardSize = 100
        const margin = 20

        for (let index = 0; index < 3; index++) {
            const card = Pool.instance.getElement(MergeCardView)

            card.resize(cardSize, cardSize)
            card.resetPivot()

            card.what = Math.floor(Math.random() * 350)
            //card.rotation = Math.PI / 4

            this.cardsContainer.addChild(card);

            card.onCardClicked.add((card) => {
                if (card.cardData) {

                    if (this.returnToList(card.cardData, card.level)) {
                        card.setData(null);
                    }
                }
            })


            card.x = (cardSize + margin) * index;

            this.previews.push(card);
        }

        this.previewMerge = Pool.instance.getElement(MergeCardView)
        this.cardsContainer.addChild(this.previewMerge);

        this.previewMerge.resize(cardSize, cardSize)
        this.previewMerge.resetPivot()

        this.previewMerge.x = (cardSize + margin) * 3 + 20;

        this.onUpgradeItem = new signals.Signal();
    }
    combineCurrentItems() {

        var dataType = 'weapons'

        console.log(this.previewMerge.cardData)
        if (this.previewMerge.cardData instanceof AcessoryData) {
            if (this.previewMerge.cardData.bodyPart == "shoe") {
                dataType = 'shoes'
            } else if (this.previewMerge.cardData.bodyPart == "trinket") {
                dataType = 'trinkets'
            }
        } else if (this.previewMerge.cardData instanceof CompanionData) {
            dataType = 'companions'
        }
        PrizeManager.instance.updateItem(dataType, this.previewMerge.cardData, this.previewMerge.level)

        this.previews.forEach(element => {
            GameData.instance.removeFromInventory(dataType, { id: element.cardData.id, level: element.level })
        });

        this.onUpgradeItem.dispatch();
        //         switch(this.previewMerge.cardData.entityType){
        // case EntityData.EntityDataType.Companion:
        //     dataType = 'companions'
        //     case EntityData.EntityDataType:
        //     dataType = 'companions'
        //     break;


        // weapons: [{ id: 'PISTOL_01', level: 0 }, { id: 'SUB_MACHINE_GUN_01', level: 0 }, { id: 'SNIPER_01', level: 0 }, { id: 'MINIGUN_01', level: 0 }, { id: 'SHOTGUN_01', level: 0 }, { id: 'PLAYER_MULTISHOT', level: 0 }],
        // 	bodyParts: [],
        // 	companions: [{ id: 'DOG-1', level: 0 }, { id: 'DOG-2', level: 0 }, { id: 'CAT-1', level: 0 }, { id: 'FISH-1', level: 0 }, { id: 'FROG-1', level: 0 }, { id: 'BIRD-1', level: 0 }],
        // 	masks: [{ id: 'MASK_01', level: 0 }],
        // 	trinkets: [{ id: 'TRINKET_01', level: 0 }],
        // 	shoes: [{ id: 'SHOE_01', level: 0 }, { id: 'SHOE_02', level: 0 }, { id: 'SHOE_03', level: 0 }, { id: 'SHOE_04', level: 0 }, { id: 'SHOE_05', level: 0 }, { id: 'SHOE_06', level: 0 }, { id: 'SHOE_07', level: 0 }, { id: 'SHOE_08', level: 0 }],
    }
    buildMergeView(mergeData) {
        //POOLING DOESNT WORK PROPERLY
        //this.destroyCards();

        this.previews.forEach(element => {
            element.setData(null);
        });
        this.updateMergeState();
        this.tempMergeDraw = [];
        for (const key in mergeData) {
            const element = mergeData[key];
            if (element.total >= 3) {

                for (let index = 0; index < element.total; index++) {

                    const card = Pool.instance.getElement(MergeCardView)
                    card.resize(this.slotSize, this.slotSize)
                    card.setData(element.data, element.level)
                    card.resetPivot()
                    card.unlock();
                    card.onCardClicked.removeAll()
                    card.onCardClicked.add((card) => {
                        if (card.cardData) {
                            if (card.locked) {
                                this.removeFromSlot(card.cardData, card.level);
                                card.unlock();
                            }
                            else if (this.addOnBlankSlot(card.cardData, card.level)) {
                                card.lock();
                            }
                        }
                    })


                    this.tempMergeDraw.push(card);
                }
            }
        }
        this.container.visible = true;

        return this.tempMergeDraw;
    }
    returnToList(data, level) {

        for (let index = 0; index < this.tempMergeDraw.length; index++) {
            const element = this.tempMergeDraw[index];

            if (element.locked) {
                if (element.cardData.id == data.id && element.level == level) {
                    element.unlock()
                    this.updateMergeState();
                    return true;
                }
            }

        }
        this.updateMergeState();

    }
    removeFromSlot(data, level) {
        const rebuildList = []
        for (let index = 0; index < this.previews.length; index++) {
            const element = this.previews[index];
            if (element.cardData) {
                if (element.cardData.id == data.id && element.level == level) {
                    element.setData(null)
                    break;
                }
            }
        }

        for (let index = 0; index < this.previews.length; index++) {
            const element = this.previews[index];

            if (element.cardData) {
                rebuildList.push({ data: element.cardData, level: level })
                element.setData(null)
            }
        }

        rebuildList.forEach(element => {
            this.addOnBlankSlot(element.data, element.level);
        });
        this.updateMergeState();

    }
    addOnBlankSlot(data, level) {
        for (let index = 0; index < this.previews.length; index++) {
            const element = this.previews[index];
            if (!element.cardData) {
                element.setData(data, level);
                this.updateMergeState();
                return true;
            }

        }

        this.updateMergeState();
    }
    updateMergeState() {
        let canMerge = false;
        for (let index = 0; index < this.previews.length - 1; index++) {
            const element = this.previews[index];
            const elementNext = this.previews[index + 1];
            if (element && elementNext && element.cardData && elementNext.cardData) {
                if (element.cardData.id == elementNext.cardData.id && element.level == elementNext.level) {
                    canMerge = true;
                } else {
                    canMerge = false;
                    break;
                }
            } else {
                canMerge = false;
                break;
            }

        }
        if (canMerge) {
            this.previewMerge.setData(this.previews[0].cardData, this.previews[0].level + 1);
            this.mergeSectionButton.visible = true;
        } else {
            this.previewMerge.setData(null);
            this.mergeSectionButton.visible = false;
        }
    }
    hide() {
        this.container.visible = false;
    }
    destroyCards() {
        this.tempMergeDraw.forEach(element => {
            if (element.parent) {
                element.parent.removeChild(element);
            }
            Pool.instance.returnElement(element)
        });
    }
    resize(res, newRes) {

        //this.containerBackground.width = Game.Borders.width / 2 - 10
        //this.containerBackground.height = Game.Borders.height / 2 -50
        this.mergeContainer.x = - this.containerBackground.width / 2
        this.mergeContainer.y = - this.containerBackground.height - 20

        this.mergeSectionButton.x = -this.mergeSectionButton.width / 2;
        this.mergeSectionButton.y = - this.containerBackground.height - this.mergeSectionButton.height - 40

        this.container.scale.set(Utils.scaleToFit(this.container, Game.Borders.width / 2))

        Utils.centerObject(this.cardsContainer, this.mergeContainer)
    }

}