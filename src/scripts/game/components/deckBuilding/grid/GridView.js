import * as PIXI from 'pixi.js';

import Game from '../../../../Game';
import GridSlotView from './GridSlotView';

export default class GridView extends PIXI.Container {
    constructor() {
        super()
        this.gridContainer = new PIXI.Container();
        this.addChild(this.gridContainer)
    }
    makeGrid(equipmentList) {
        let gridWidth = 100
        this.slotOver = null;
        for (let i = this.children.length - 1; i >= 0; i--) {
            this.removeChildAt(i)
        }
        this.gridArray = [];
        this.gridSlots = [];

        this.addChild(this.gridContainer)

        for (var i = 0; i < equipmentList.length; i++) {
            let temp = [];
            for (var j = 0; j < equipmentList[i].length; j++) {
                let gridView = new GridSlotView();
                this.gridContainer.addChild(gridView)
                gridView.x = i * (gridWidth + 5)
                gridView.y = j * (gridWidth + 5)
                gridView.i = i
                gridView.j = j
                temp.push(gridView);
                this.gridSlots.push(gridView);
            }
            this.gridArray.push(temp)
        }

        this.trash = new GridSlotView();
        this.trash.setAsTrash();
        this.trash.updateTexture('icon-trash')
        this.gridSlots.push(this.trash);
        this.addChild(this.trash)

        this.trash.x = -120
        // this.zero = new PIXI.Graphics().beginFill(0xff0000).drawCircle(0, -20, 20)
        // this.addChild(this.zero)
    }
    get gridWidth() {
        return this.gridContainer.width
    }
    get gridHeight() {
        return this.gridContainer.height
    }
    mouseUp() {
        this.gridSlots.forEach(element => {
            element.release()
        });
    }
    updateEquipment(equipmentList) {
        for (var i = 0; i < equipmentList.length; i++) {
            for (var j = 0; j < equipmentList[i].length; j++) {
                let equip = equipmentList[i][j]
                let gridSlot = this.gridArray[i][j]
                if (equip.item) {
                    gridSlot.setData(equip)
                } else {
                    gridSlot.wipe();
                }
            }
        }
    }
    findMouseCollision(mousePosition) {
        let temp = null;

        this.gridSlots.forEach(element => {
            element.update()
            if (this.isPointInsideAABB(mousePosition, element)) {
                temp = element
            }
        });
        if (this.slotOver && !temp) {
            this.slotOver.mouseOut();
            this.slotOver = null;
        } if (this.slotOver && this.slotOver != temp) {
            this.slotOver.mouseOut();
            this.slotOver = temp;
            this.slotOver.mouseOver();
        } else if (temp) {
            this.slotOver = temp;
            this.slotOver.mouseOver();
        }
    }

    isPointInsideAABB(point, box) {
        return (
            point.x >= box.x &&
            point.x <= box.x + box.width &&
            point.y >= box.y &&
            point.y <= box.y + box.height
        )
    }
}