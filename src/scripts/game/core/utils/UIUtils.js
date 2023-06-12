import BaseButton from "../../components/ui/BaseButton";
import BodyPartySlot from "../../components/ui/BodyPartySlot";
import ColorButton from "../../components/ui/ColorButton";
import ColorSlot from "../../components/ui/ColorSlot";
import InteractableView from "../../view/card/InteractableView";
import Pool from "./Pool";

export default class UIUtils {
    constructor() {

    }
    static baseButtonTexture = 'square_button';
    static colorset = {
        skin: [0xF9C6B2, 0x964C32, 0x6AE95D, 0x5DBFE9],
        clothes: [0xFFFFFF, 0xEC1A62, 0x2BFF00, 0xDF65F8, 0x4260A5, 0xAA968F, 0x3C3C3C, 0x2E4476],
        hair: [0xAA968F, 0x3C3C3C, 0xFBE574, 0x856036, 0xF86C5A, 0x2BFF00, 0xDF65F8, 0xEC1A62, 0xFFFFFF],
    }
    static getCircle(color = 0xFF0000, radius = 20) {
        return new PIXI.Graphics().beginFill(color).drawCircle(0, 0, radius)
    }
    static getRect(color = 0xFF0000, width = 20, height = 20) {
        return new PIXI.Graphics().beginFill(color).drawRect(0, 0, width, height)
    }
    static getCloseButton(callback) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0004', 80, 60);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        button.addIcon('smallButton', 40)

        return button;
    }

    static getPrimaryButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 100, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label)
        }
        return button;
    }

    static getPrimaryShapelessButton(callback, label, icon) {
        const button = new BaseButton(null, 150, 150);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon, 80)
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 28 })
        }
        return button;
    }
    static getMainPlayButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0005', 300, 100);
        InteractableView.addMouseUp(button, () => { if (callback) callback() })
        if (icon) {
            button.addIcon(icon, 80, { x: 0.5, y: 0.5 }, { x: 80, y: 0 })
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 48 }, icon ? { x: -50, y: 0 } : { x: 0, y: 0 })
        }
        return button;
    }
    static getPrimaryLabel(label, params = {}) {
        const style = {}
        for (const key in window.LABELS.LABEL1) {
            style[key] = window.LABELS.LABEL1[key];
        }

        for (const key in params) {
            style[key] = params[key];
        }
        const textLabel = new PIXI.Text(label, style)
        textLabel.text = label;
        return textLabel;
    }
    static getSecondaryLabel(label, params = {}) {
        const textLabel = new PIXI.Text(label, window.LABELS.LABEL2)
        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        return textLabel;
    }
    static addLabel(button, label, params = {}, offset = { x: 0, y: 0 }) {
        const textLabel = new PIXI.Text(label, window.LABELS.LABEL1)

        for (const key in params) {
            textLabel.style[key] = params[key];
        }
        button.addLabelOnCenter(textLabel, offset)
        return textLabel;
    }
    static getBodyPartySlot(callback, label, icon) {

        const button = Pool.instance.getElement(BodyPartySlot)

        button.addShape(UIUtils.baseButtonTexture + '_0002', 85, 85);
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


    static getColorSlot(callback, color = 0, width = 85, height = 85) {

        const button = Pool.instance.getElement(ColorSlot)

        button.addShape(UIUtils.baseButtonTexture + '_0002', width, height);
        button.setColor(color)
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button) })
        }

        return button;
    }
    static getPrimaryLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 100, 65);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label, { strokeThickness: 0, fontSize: 18, fill: 0 })
        }
        return button;
    }
    static getPrimaryLargeLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 250, 100);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon, 80, { x: 0.5, y: 0.5 }, { x: 80, y: 0 })
        }
        if (label) {
            UIUtils.addLabel(button, label, { fontSize: 48 }, { x: -50, y: 0 })
        }
        return button;
    }
    static getBodyTypeLabelButton(callback, label, icon) {
        const button = new BaseButton(UIUtils.baseButtonTexture + '_0001', 80, 80);
        button.setActiveTexture(UIUtils.baseButtonTexture + '_0002')
        InteractableView.addMouseUp(button, () => { if (callback) callback(button) })
        if (icon) {
            button.addIcon(icon)
        }
        if (label) {
            UIUtils.addLabel(button, label, { strokeThickness: 0, fontSize: 18, fill: 0 })
        }
        return button;
    }
    static getColorButton(callback, color = 0, width = 85, height = 85) {

        const button = Pool.instance.getElement(ColorButton)

        button.addShape(UIUtils.baseButtonTexture + '_0002', width, height);
        button.setColor(color)
        if (!button.mouseUpCallback && callback) {
            button.mouseUpCallback = callback;
            let cb = InteractableView.addMouseUp(button, () => { button.mouseUpCallback(button); })
        }

        return button;
    }



}