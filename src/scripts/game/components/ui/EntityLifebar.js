import BaseComponent from "../../core/gameObject/BaseComponent";
import BaseFillBar from "./BaseFillBar";
import Color from "../../core/utils/Color";
import GameObject from "../../core/gameObject/GameObject";
import GameView from "../../core/view/GameView";
import RenderModule from "../../core/modules/RenderModule";
import Utils from "../../core/utils/Utils";

export default class EntityLifebar extends BaseFillBar {
    constructor() {
        super();
    }
    build(width = 50, height = 10, border = 1) {
        super.build(width, height, border);

        this.health = this.parent.health;
    }
    update(delta, unscaled){
        super.update(delta, unscaled);
        this.normal = this.health.normal;
    }
}
