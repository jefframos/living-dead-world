import BaseButton from "../../components/ui/BaseButton";
import BodyPartySlot from "../../components/ui/BodyPartySlot";
import ColorSlot from "../../components/ui/ColorSlot";
import InteractableView from "../../view/card/InteractableView";
import Pool from "./Pool";

export default class UIUtils {
    constructor() {

    }
    static colorset = {
        skin: [0xF9C6B2, 0x964C32, 0x6AE95D, 0x5DBFE9],
        clothes: [0xFFFFFF, 0xEC1A62, 0x2BFF00, 0xDF65F8, 0x4260A5, 0xAA968F, 0x3C3C3C, 0x2E4476],
        hair: [0xAA968F, 0x3C3C3C, 0xFBE574, 0x856036, 0xF86C5A, 0x2BFF00, 0xDF65F8, 0xEC1A62, 0xFFFFFF],
    }
    static getCircle(color = 0xFF0000, radius = 20) {
        return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, radius)
    }

    static getCloseButton(callback) {
        const button = new BaseButton('square_0004', 100, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        button.addIcon('smallButton')

        return button;
    }

    static getPrimaryButton(callback, label, icon) {
        const button = new BaseButton('square_0001', 100, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label)
        }
        return button;
    }

    static addLabel(button, label) {
        const textLabel = new PIXI.Text(label, window.LABELS.LABEL1)
        textLabel.style.strokeThickness = 0
        textLabel.style.fontSize = 32
        button.addLabelOnCenter(textLabel)
        return textLabel;
    }
    static getBodyPartySlot(callback, label, icon) {

        const button = Pool.instance.getElement(BodyPartySlot)

        button.addShape('square_0002', 85, 85);
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button) })
        }
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label)
        }

        return button;
    }


    static getColorSlot(callback, color = 0) {

        const button = Pool.instance.getElement(ColorSlot)

        button.addShape('square_0002', 85, 85);
        button.setColor(color)
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button) })
        }

        return button;
    }

    static getBodyTypeLabelButton(callback, label, icon) {
        const button = new BaseButton('square_0001', 250, 65);
        button.setActiveTexture('square_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label).style.fill = 0
        }
        return button;
    }

    static getPrimaryLabel() {
        const textLabel = new PIXI.Text('', window.LABELS.LABEL1)
        textLabel.style.strokeThickness = 0
        textLabel.style.fontSize = 24

        return textLabel;
    }

}