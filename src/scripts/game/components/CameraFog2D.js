import BaseComponent from '../core/gameObject/BaseComponent';
import Color from '../core/utils/Color';
import Player from '../entity/Player';
import RenderModule from '../core/modules/RenderModule';
import TagManager from '../core/TagManager';
import Vector3 from '../core/gameObject/Vector3';
import signals from 'signals';

export default class CameraFog2D extends BaseComponent {
    constructor() {
        super();

        this.occlusionSpeed = 0.5;
        this.baseColor = Color.toRGB(0xFFFFFF)
        this.targetColor = Color.toRGB(0x2C3B66)

        this.minDistance = 250
        this.maxDistance = 400
    }
    enable() {
        super.enable();
        this.renderModule = this.gameObject.engine.findByType(RenderModule);
        this.renderModule.onNewRenderEntityAdded.add(this.entityAdded.bind(this));
        this.renderModule.onNewRenderEntityLateAdded.add(this.entityLateAdded.bind(this));
        if (!this.player) {
            this.gameObject.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];
            });
        }

    }
    entityLateAdded(entityList) {
        entityList.forEach(entity => {
            if(entity.gameView.layer == RenderModule.RenderLayers.Gameplay){
                this.calcEntityFog(entity.gameView);
            }
        });
    }
    entityAdded(entity) {

    }
    lateUpdate(delta) {
        //only uses player layer to test occlusion
        if (!this.player) return;
        this.renderModule.layers[this.player.gameView.layer].gameViews.forEach(element => {
            this.calcEntityFog(element)
        });
    }
    calcEntityFog(entity) {
        const dist = Vector3.distance(this.player.transform.position, entity.gameObject.transform.position)
        if (dist > this.minDistance) {
            Color.colorLerp(entity.auxColorRGB, this.baseColor, this.targetColor, Math.min((dist - this.minDistance) / (this.maxDistance - this.minDistance), 1))
            entity.auxColor = Color.rgbToColor(entity.auxColorRGB)
            entity.view.tint = entity.auxColor
        } else {
            entity.view.tint = 0xFFFFFF
        }
    }

}