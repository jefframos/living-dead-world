import * as PIXI from 'pixi.js';

import GridSlotView from './GridSlotView';

export default class GridView extends PIXI.Container {
    constructor() {
        super()
    }
    makeGrid(equipmentList) {
        let gridWidth = 100
        this.slotOver = null;
        this.children = [];
        this.gridArray = [];
        this.gridSlots = [];
        for (var i = 0; i < equipmentList.length; i++) {
            let temp = [];
            for (var j = 0; j < equipmentList[i].length; j++) {
                let gridView = new GridSlotView();
                this.addChild(gridView)
                gridView.x = i * (gridWidth + 5)
                gridView.y = j * (gridWidth + 5)
                gridView.i = i
                gridView.j = j
                temp.push(gridView);
                this.gridSlots.push(gridView);
            }
            this.gridArray.push(temp)
        }
    }
    mouseUp(){
        this.gridSlots.forEach(element => {
            element.release()
        });
    }
    updateEquipment(equipmentList) {
        for (var i = 0; i < equipmentList.length; i++) {
            let temp = [];
            for (var j = 0; j < equipmentList[i].length; j++) {
                let equip = equipmentList[i][j]
                let gridSlot = this.gridArray[i][j]
                if (equip) {
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
            point.x >= box.worldTransform.tx &&
            point.x <= box.worldTransform.tx + box.width &&
            point.y >= box.worldTransform.ty &&
            point.y <= box.worldTransform.ty + box.height
        )
    }
}