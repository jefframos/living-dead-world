import * as PIXI from 'pixi.js';

import BodyPartsListScroller from '../../../ui/buildCharacter/BodyPartsListScroller';
import CardView from '../../deckBuilding/CardView';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import MainScreenModal from '../MainScreenModal';
import UIList from '../../../ui/uiElements/UIList';
import Utils from '../../../core/utils/Utils';
import signals from 'signals';

export default class LoadoutContainer extends MainScreenModal {
    constructor() {
        super();


        this.slotSize = 120
        this.onUpdateMainWeapon = new signals.Signal();
        this.weaponsScroller = new BodyPartsListScroller({ w: this.slotSize * 4, h: this.slotSize }, { width: this.slotSize + 10, height: this.slotSize + 10 }, { x: 10, y: 10 })
        this.contentContainer.addChild(this.weaponsScroller);

        this.equippableWeapons = [];

        this.slotsList = new UIList();

        this.slotsList.w = this.slotSize;
        this.slotsList.h = (this.slotSize + 10) * 4;
        this.contentContainer.addChild(this.slotsList);

        this.currentWeaponSlot = new CardView('square_0006', this.slotSize, this.slotSize);
        this.slotsList.addElement(this.currentWeaponSlot, { align: 0 });

        this.currentWeaponSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableWeapons)
        })

        this.currentMaskSlot = new CardView('square_0006', this.slotSize, this.slotSize);
        this.slotsList.addElement(this.currentMaskSlot, { align: 0 });

        this.currentTrinketSlot = new CardView('square_0006', this.slotSize, this.slotSize);
        this.slotsList.addElement(this.currentTrinketSlot, { align: 0 });

        this.currentCompanionSlot = new CardView('square_0006', this.slotSize, this.slotSize);
        this.slotsList.addElement(this.currentCompanionSlot, { align: 0 });
        this.currentCompanionSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableCompanions)
        })

        this.slotsList.updateVerticalList()

    }
    addBackgroundShape() {
        // this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('infoBack'), 20, 20, 20, 20);
        // this.container.addChild(this.infoBackContainer);
    }
    show() {
        super.show();


        const cards = GameStaticData.instance.getAllCards()

        this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(GameData.instance.currentEquippedWeaponData.id))
        this.currentWeaponSlot.update(1)
        this.currentWeaponSlot.resetPivot()

        this.currentMaskSlot.setData(null)
        this.currentMaskSlot.update(1)
        this.currentMaskSlot.resetPivot()

        this.currentTrinketSlot.setData(null)
        this.currentTrinketSlot.update(1)
        this.currentTrinketSlot.resetPivot()

        //GameData.instance.changeCompanion('FLY_DRONE')

        const companion = GameData.instance.currentEquippedCompanion

        this.currentCompanionSlot.setData(companion ? EntityBuilder.instance.getCompanion(companion.id) : null)
        this.currentCompanionSlot.update(1)
        this.currentCompanionSlot.resetPivot()


        this.equippableWeapons = [];
        let availableCards = [0,1,2,3, 5, 7, 8, 9,10,11,12]

        for (let index = 0; index < availableCards.length; index++) {
            const card = new CardView('square_0006', this.slotSize, this.slotSize);
            let dt = EntityBuilder.instance.getWeapon(cards[availableCards[index]].weaponId)
            card.setData(dt, 0)
            card.update(1)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                GameData.instance.changeMainWeapon(card.cardData.id);
                this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(card.cardData.id))
                this.onUpdateMainWeapon.dispatch(card.cardData);
            })
            this.equippableWeapons.push(card)
        }

        this.equippableCompanions = [];
        cards.forEach(element => {
            if (element.entityData.type === 'Companion') {
                const card = new CardView('square_0006', this.slotSize, this.slotSize);
                let dt = EntityBuilder.instance.getCompanion(element.id)
                card.setData(dt, 0)
                card.update(1)
                card.resetPivot()
                card.onCardClicked.add((card) => {
                    GameData.instance.changeCompanion(card.cardData.id);
                    this.currentCompanionSlot.setData(EntityBuilder.instance.getCompanion(card.cardData.id))
                    // this.onUpdateMainWeapon.dispatch(card.cardData);
                })
                this.equippableCompanions.push(card)
            }
        });

        // let availableCompanions = [3, 5, 7, 8, 9, 3, 5, 7, 8, 9, 3, 5, 7, 8, 9, 3, 5, 7, 8, 9, 3, 5, 7, 8, 9, 3]

        // for (let index = 0; index < availableCards.length; index++) {
        //     const card = new CardView('square_0006', this.slotSize, this.slotSize);
        //     let dt = EntityBuilder.instance.getCompanion(cards[availableCards[index]].weaponId)
        //     card.setData(dt, 0)
        //     card.update(1)
        //     card.resetPivot()
        //     card.onCardClicked.add((card) => {
        //         GameData.instance.changeMainWeapon(card.cardData.id);
        //         this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(card.cardData.id))
        //         this.onUpdateMainWeapon.dispatch(card.cardData);
        //     })
        //     this.equippableWeapons.push(card)
        // }

        console.log(cards)


        this.updateListView(this.equippableWeapons)

        this.slotsList.updateVerticalList(true)
        this.resize()

    }
    updateListView(slots) {
        this.currentSlots = slots;
        this.weaponsScroller.removeAllItems();
        this.weaponsScroller.addItens(this.currentSlots)

    }
    update(delta) {
        super.update(delta);
    }
    resize(res, newRes) {
        super.resize(res, newRes)
        if (!this.currentSlots) {
            return;
        }

        const margin = 20;

        this.weaponsScroller.removeAllItems();

        this.weaponsScroller.gridDimensions.j = Math.floor((Game.Borders.width - 130) / this.weaponsScroller.scale.x / (this.slotSize + margin))
        this.weaponsScroller.resize({ w: this.weaponsScroller.gridDimensions.j * (this.slotSize + margin) + 20 - margin, h: ((Game.Borders.height / 2) / this.weaponsScroller.scale.y - 50 - 80) }, { width: this.slotSize + margin, height: this.slotSize + margin })
        this.weaponsScroller.addItens(this.currentSlots)

        this.weaponsScroller.y = Game.Borders.height - 90 - this.weaponsScroller.rect.h
        this.weaponsScroller.x = (Game.Borders.width - 80) / 2 - (this.weaponsScroller.rect.w) / 2


        this.slotsList.x = Game.Borders.width / 2 - this.slotSize - 150
        this.slotsList.y = Game.Borders.height / 2 - this.slotsList.h

        this.slotsList.scale.set(Utils.scaleToFit(this.slotsList, Game.Borders.height / 2 - 80))

    }

}