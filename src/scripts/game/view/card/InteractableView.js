export default class InteractableView {
    constructor() { }

    static addMouseEnter(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerover', callback);
    }
    static addMouseOut(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointerout', callback);
    }
    static addMouseClick(element, callback = () => { }) {
        element.interactive = true;
        element.buttonMode = true;
        element.on('pointertap', callback);//.on('tap', callback);
    }
}