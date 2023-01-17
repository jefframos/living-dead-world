import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";
import Vector3 from "../core/gameObject/Vector3";

export default class EntityViewData {
    static ViewType = {
        None: 0,
        Sprite: 1,
        SpriteSheet: 2,
        SpriteSheetOnBullet: 3,
    }
    static MovementType = {
        Static: 0,
        Follow: 1,
    }

    constructor() {
        this.movementType = EntityViewData.MovementType.Static;
        
        this.baseViewData = this.makeViewStruct();
        this.baseViewData.viewType = EntityViewData.ViewType.Sprite;
        this.baseSpawnViewData = this.makeViewStruct();
        this.baseDestroyViewData = this.makeViewStruct();
        this.rotationSpeed = 0;
        this.customAnchor = { x: 0.5, y: 0.5 };
    }
    makeViewStruct() {

        return {
            viewData: 'hit-g1',
            viewType: EntityViewData.ViewType.None,
            offset: new Vector3(),
            alpha: 1,
            faceOrientation: true,
            scale: 1
        }
    }
    addSpritesheet(params = { time: 0.2, startFrame: 1, endFrame: 5, spriteName: 'hit-g1', addZero: false, lifeSpan: 999 }, offset = new Vector3()) {
        this.baseViewData = new ParticleDescriptor()
        this.baseViewData.addBaseBehaviours(SpriteSheetBehaviour, params)
        this.baseSpawnViewData.offset = offset;

        this.type = EntityViewData.ViewType.SpriteSheet;
    }

    addSpawnSpritesheet(params = { time: 0.2, startFrame: 1, endFrame: 5, spriteName: 'hit-g1', addZero: false, lifeSpan: 999 }, offset = new Vector3()) {
        this.baseSpawnViewData.viewData = new ParticleDescriptor()
        this.baseSpawnViewData.viewData.addBaseBehaviours(SpriteSheetBehaviour, params)
        this.baseSpawnViewData.offset = offset;
        this.baseSpawnViewData.viewType = EntityViewData.ViewType.SpriteSheet;
    }
    addDestroySpritesheet(params = { time: 0.2, startFrame: 1, endFrame: 5, spriteName: 'hit-g1', addZero: false, lifeSpan: 999 }, offset = new Vector3()) {
        this.baseDestroyViewData.viewData = new ParticleDescriptor()
        this.baseDestroyViewData.viewData.addBaseBehaviours(SpriteSheetBehaviour, params)
        this.baseDestroyViewData.offset = offset;
        this.baseDestroyViewData.viewType = EntityViewData.ViewType.SpriteSheet;
    }

    get viewData() {
        let sprite;
        if (Array.isArray(this.baseViewData.viewData)) {
            sprite = this.baseViewData.viewData[Math.floor(Math.random() * this.baseViewData.viewData.length)];
        } else {
            sprite = this.baseViewData.viewData;
        }

        return sprite;
    }
}