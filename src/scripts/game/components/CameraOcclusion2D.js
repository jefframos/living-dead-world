import BaseComponent from '../core/gameObject/BaseComponent';
import Player from '../entity/Player';
import RenderModule from '../core/modules/RenderModule';
import TagManager from '../core/TagManager';
import signals from 'signals';

export default class CameraOcclusion2D extends BaseComponent {
    constructor() {
        super();

        this.occlusionSpeed = 0.5;
    }
    enable() {
        super.enable();
        this.player = this.gameObject.engine.findByType(Player);
        this.renderModule = this.gameObject.engine.findByType(RenderModule);

    }

    update(delta) {
        this.renderModule.layers.gameplay.gameViews.forEach(element => {
            if(element.tag == TagManager.Tags.Occlusion){
                this.boundOcclusion(this.player.gameView.view, element.view, element.view.anchor);
            }
        });
    }

    boundOcclusion(point, view, anchor = { x: 0, y: 0 },delta = 1/60) {
        const vx = view.x - anchor.x * view.width;
        const vy = view.y - anchor.y * view.height;
        if (point.x > vx && point.y > vy && point.x < vx + view.width && point.y < vy + view.height) {
            if(view.alpha > 0.5 + delta){
                view.alpha -=delta / this.occlusionSpeed;
            }
        } else {
            if(view.alpha < 1 - delta){
                view.alpha +=delta / this.occlusionSpeed;
            }
        }
    }
}