import BaseComponent from '../core/gameObject/BaseComponent';
import Color from '../core/utils/Color';
import LightSource from '../core/view/LightSource';
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

        this.lightSourceList = [];

        this.minDistance = 200
        this.maxDistance = 300

        this.debug = 0;
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
            if (entity.gameView instanceof LightSource) {
                this.lightSourceList.push(entity)
                entity.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
            } else if (entity.gameView.layer == RenderModule.RenderLayers.Gameplay) {
                this.calcEntityFog(entity.gameView);
            }
        });
    }
    elementDestroyed(entity) {
        this.lightSourceList = this.lightSourceList.filter(item => item !== entity)
    }
    entityAdded(entity) {

    }
    lateUpdate(delta) {
        if (!this.player) return;
        this.renderModule.layers[this.player.gameView.layer].gameViews.forEach(element => {
           // this.debug = 9
            this.calcEntityFog(element)
        });
    }
    calcEntityFog(entity) {

        let range = 1;
        this.lightSourceList.forEach(lightSource => {
            
            const dist = Vector3.distance(lightSource.gameObject.transform.position, entity.gameObject.transform.position)
            let tempRange = 1;

            if(dist < lightSource.gameView.minDistance){
                tempRange = 0;
            }else{
                tempRange = Math.min((dist - lightSource.gameView.minDistance) / (lightSource.gameView.maxDistance - lightSource.gameView.minDistance),1)
            }
            if(tempRange < range) {
                range = tempRange;
            }            
            
        });
        if (range > 0) {
            Color.colorLerp(entity.auxColorRGB, this.baseColor, this.targetColor, range, 1)
            entity.auxColor = Color.rgbToColor(entity.auxColorRGB)
            entity.view.tint = entity.auxColor
        } else {
            entity.view.tint = 0xFFFFFF
        }
    }

}