import * as PIXI from 'pixi.js';

import BodyPartsListScroller from '../../../ui/buildCharacter/BodyPartsListScroller';
import EntityBuilder from '../../../screen/EntityBuilder';
import Game from '../../../../Game';
import GameData from '../../../data/GameData';
import GameStaticData from '../../../data/GameStaticData';
import LoadoutCardView from '../../deckBuilding/LoadoutCardView';
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
        this.slotsList.h = (this.slotSize + 30) * 2;
        this.contentContainer.addChild(this.slotsList);


        this.slotsListInGame = new UIList();

        this.slotsListInGame.w = this.slotSize;
        this.slotsListInGame.h = (this.slotSize + 30) * 2;
        this.contentContainer.addChild(this.slotsListInGame);

        this.currentWeaponSlot = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        this.currentWeaponSlot.setIconType();
        this.slotsListInGame.addElement(this.currentWeaponSlot, { align: 0 });

        this.currentWeaponSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableWeapons)
        })

        this.currentMaskSlot = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        this.currentMaskSlot.setIconType(true);
        this.slotsList.addElement(this.currentMaskSlot, { align: 0 });
        this.currentMaskSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableMasks)
        })

        this.currentTrinketSlot = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        this.currentTrinketSlot.setIconType(true);
        this.slotsList.addElement(this.currentTrinketSlot, { align: 0 });
        this.currentTrinketSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableTrinkets)
        })

        this.currentCompanionSlot = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        this.currentCompanionSlot.setIconType();
        this.slotsListInGame.addElement(this.currentCompanionSlot, { align: 0 });
        this.currentCompanionSlot.onCardClicked.add((card) => {
            this.updateListView(this.equippableCompanions)
        })

        this.slotsList.updateVerticalList()
        this.slotsListInGame.updateVerticalList()

    }
    addBackgroundShape() {
        // this.infoBackContainer = new PIXI.NineSlicePlane(PIXI.Texture.from('infoBack'), 20, 20, 20, 20);
        // this.container.addChild(this.infoBackContainer);
    }
    show() {
        super.show();

        const fullInventory = GameData.instance.inventory;

        const cards = GameStaticData.instance.getAllCards()

        this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(GameData.instance.currentEquippedWeaponData.id), GameData.instance.currentEquippedWeapon.level)
        this.currentWeaponSlot.resetPivot()

        const mask = GameData.instance.currentEquippedMask
        console.log(mask)
        this.currentMaskSlot.setData(mask ? EntityBuilder.instance.getMask(mask.id) : null, mask ? mask.level : 0, 100)
        this.currentMaskSlot.resetPivot()

        const trinket = GameData.instance.currentEquippedTrinket
        console.log(trinket)
        this.currentTrinketSlot.setData(trinket ? EntityBuilder.instance.getTrinket(trinket.id) : null, companion ? companion.level : 0)
        this.currentTrinketSlot.resetPivot()

        const companion = GameData.instance.currentEquippedCompanion
        console.log(companion)

        this.currentCompanionSlot.setData(companion ? EntityBuilder.instance.getCompanion(companion.id) : null, companion ? companion.level : 0)
        this.currentCompanionSlot.resetPivot()


        this.equippableWeapons = [];
        let availableCards = fullInventory.weapons

        for (let index = 0; index < availableCards.length; index++) {
            const card = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
            let dt = EntityBuilder.instance.getWeapon(availableCards[index].id)
            console.log(availableCards[index].level)
            card.setData(dt, availableCards[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                GameData.instance.changeMainWeapon(card.cardData.id, card.level);
                console.log(card, card.level)
                this.currentWeaponSlot.setData(EntityBuilder.instance.getWeapon(card.cardData.id), card.level)
                this.onUpdateMainWeapon.dispatch(card.cardData);
            })
            this.equippableWeapons.push(card)
        }



        this.equippableCompanions = [];

        let removeCompanion = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        removeCompanion.resetPivot()
        removeCompanion.onCardClicked.add((removeCompanion) => {
            GameData.instance.changeCompanion(null);
            this.currentCompanionSlot.setData(null)
        })
        this.equippableCompanions.push(removeCompanion)

        let availableCompanions = fullInventory.companions

        for (let index = 0; index < availableCompanions.length; index++) {
            const card = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
            let dt = EntityBuilder.instance.getCompanion(availableCompanions[index].id)
            console.log(availableCompanions[index].level)
            card.setData(dt, availableCompanions[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                GameData.instance.changeCompanion(card.cardData.id);
                this.currentCompanionSlot.setData(EntityBuilder.instance.getCompanion(card.cardData.id), availableCompanions[index].level)
            })
            this.equippableCompanions.push(card)
        }



        this.equippableTrinkets = [];

        let removeTrinket = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        //removeTrinket.setData(dt)
        removeTrinket.resetPivot()
        removeTrinket.onCardClicked.add((removeTrinket) => {
            GameData.instance.changeTrinket(null);
            this.currentTrinketSlot.setData(null)
        })
        this.equippableTrinkets.push(removeTrinket)


        let availableTrinkets = fullInventory.trinkets

        for (let index = 0; index < availableTrinkets.length; index++) {
            let dt = EntityBuilder.instance.getEquipable(availableTrinkets[index].id)

            const card = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
            card.setData(dt, availableTrinkets[index].level)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                GameData.instance.changeTrinket(card.cardData.id);
                this.currentTrinketSlot.setData(EntityBuilder.instance.getEquipable(card.cardData.id), availableTrinkets[index].level)
            })
            this.equippableTrinkets.push(card)

        }



        this.equippableMasks = [];


        let removeMask = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
        //removeMask.setData(dt)
        removeMask.resetPivot()
        removeMask.onCardClicked.add((removeMask) => {
            GameData.instance.changeMask(null);
            this.currentMaskSlot.setData(null)
        })
        this.equippableMasks.push(removeMask)


        let availableMasks = fullInventory.masks

        for (let index = 0; index < availableMasks.length; index++) {
            let dt = EntityBuilder.instance.getEquipable(availableMasks[index].id)

            const card = new LoadoutCardView('square_0006', this.slotSize, this.slotSize);
            card.setData(dt, availableMasks[index].level, 100)
            card.resetPivot()
            card.onCardClicked.add((card) => {
                GameData.instance.changeMask(card.cardData.id);
                this.currentMaskSlot.setData(EntityBuilder.instance.getEquipable(card.cardData.id), availableMasks[index].level)
            })
            this.equippableMasks.push(card)

        }




        this.updateListView(this.equippableWeapons)

        this.slotsList.updateVerticalList()
        this.slotsListInGame.updateVerticalList()
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

        if (Game.IsPortrait) {
            this.weaponsScroller.gridDimensions.j = Math.floor((Game.Borders.width) / this.weaponsScroller.scale.x / (this.slotSize + margin))
            this.weaponsScroller.resize({ w: this.weaponsScroller.gridDimensions.j * (this.slotSize + margin) + 20 - margin, h: ((Game.Borders.height / 2) / this.weaponsScroller.scale.y - 130) }, { width: this.slotSize + margin, height: this.slotSize + margin })
        } else {

            this.weaponsScroller.gridDimensions.j = Math.floor((Game.Borders.width - 130) / this.weaponsScroller.scale.x / (this.slotSize + margin))
            this.weaponsScroller.resize({ w: this.weaponsScroller.gridDimensions.j * (this.slotSize + margin) + 20 - margin, h: ((Game.Borders.height / 2) / this.weaponsScroller.scale.y - 130) }, { width: this.slotSize + margin, height: this.slotSize + margin })
        }
        this.weaponsScroller.addItens(this.currentSlots)

        this.weaponsScroller.y = Game.Borders.height - 90 - this.weaponsScroller.rect.h
        this.weaponsScroller.x = (Game.Borders.width - 100) / 2 - (this.weaponsScroller.rect.w) / 2


        //this.slotsList.scale.set(Utils.scaleToFit(this.slotsList, Game.Borders.height / 2 - 150))
        this.slotsListInGame.x = this.weaponsScroller.x + 10
        this.slotsListInGame.y = Game.Borders.height / 2 - this.slotsListInGame.h * this.slotsListInGame.scale.y

        //this.slotsListInGame.scale.set(Utils.scaleToFit(this.slotsListInGame, Game.Borders.height / 2 - 150))
        this.slotsList.x = this.weaponsScroller.rect.w + this.weaponsScroller.x - this.slotsList.w * this.slotsList.scale.x
        this.slotsList.y = Game.Borders.height / 2 - this.slotsList.h * this.slotsList.scale.y

    }

}