import signals from "signals"

export default class PlayerViewStructure {
    static Colors = {
        WhiteSkin: 0xFBEDD6,
        Jeans: 0x4260A5
    }
    constructor() {
        this._chest = 1
        this._head = 1
        this._topHead = 1
        this._face = 1
        this._hat = 0
        this._leg = 1
        this._sleeves = 2
        this._arms = 1
        this._shoe = 1
        this._frontFace = 1
        this._backHead = 0
        this._skinColor = PlayerViewStructure.Colors.WhiteSkin
        this._hairColor = 0xFFFFFF
        this._topClothColor = 0xFFFFFF
        this._sleevesColor = 0xFFFFFF
        this._faceHairColor = 0xFFFFFF
        this._botomColor = 0x333333
        this._shoeColor = 0x007272
        this.onStructureUpdate = new signals.Signal();
        this.onColorUpdate = new signals.Signal();
    }

    set chest(value) {
        this._chest = value;
        this.onStructureUpdate.dispatch('chest', this._chest)
    }
    get chest() { return this._chest; }
    set head(value) {
        this._head = value;
        this.onStructureUpdate.dispatch('head', this._head)
    }
    get head() { return this._head; }
    set topHead(value) {
        this._topHead = value;
        this.onStructureUpdate.dispatch('topHead', this._topHead)
    }
    get topHead() { return this._topHead; }
    set face(value) {
        this._face = value;
        this.onStructureUpdate.dispatch('face', this._face)
    }
    get face() { return this._face; }
    set hat(value) {
        this._hat = value;
        this.onStructureUpdate.dispatch('hat', this._hat)
    }
    get hat() { return this._hat; }
    set leg(value) {
        this._leg = value;
        this.onStructureUpdate.dispatch('leg', this._leg)
    }
    get leg() { return this._leg; }
    set sleeves(value) {
        this._sleeves = value;
        this.onStructureUpdate.dispatch('sleeves', this._sleeves)
    }
    get sleeves() { return this._sleeves; }
    set arms(value) {
        this._arms = value;
        this.onStructureUpdate.dispatch('arms', this._arms)
    }
    get arms() { return this._arms; }
    set shoe(value) {
        this._shoe = value;
        this.onStructureUpdate.dispatch('shoe', this._shoe)
    }
    get shoe() { return this._shoe; }
    set frontFace(value) {
        this._frontFace = value;
        this.onStructureUpdate.dispatch('frontFace', this._frontFace)
    }
    get frontFace() { return this._frontFace; }
    set backHead(value) {
        this._backHead = value;
        this.onStructureUpdate.dispatch('backHead', this._backHead)
    }
    get backHead() { return this._backHead; }
    set skinColor(value) {
        this._skinColor = value;
        this.onStructureUpdate.dispatch('skinColor', this._skinColor)
    }
    get skinColor() { return this._skinColor; }
    set hairColor(value) {
        this._hairColor = value;
        this.onColorUpdate.dispatch('hairColor', this._hairColor)
    }
    get hairColor() { return this._hairColor; }
    set topClothColor(value) {
        this._topClothColor = value;
        this.onColorUpdate.dispatch('topClothColor', this._topClothColor)
    }
    get topClothColor() { return this._topClothColor; }
    set sleevesColor(value) {
        this._sleevesColor = value;
        this.onColorUpdate.dispatch('sleevesColor', this._sleevesColor)
    }
    get sleevesColor() { return this._sleevesColor; }
    set botomColor(value) {
        this._botomColor = value;
        this.onColorUpdate.dispatch('botomColor', this._botomColor)
    }
    get botomColor() { return this._botomColor; }
    set shoeColor(value) {
        this._shoeColor = value;
        this.onColorUpdate.dispatch('shoeColor', this._shoeColor)
    }
    get shoeColor() { return this._shoeColor; }
    set faceHairColor(value) {
        this._faceHairColor = value;
        this.onColorUpdate.dispatch('faceHairColor', this._faceHairColor)
    }
    get faceHairColor() { return this._faceHairColor; }
}