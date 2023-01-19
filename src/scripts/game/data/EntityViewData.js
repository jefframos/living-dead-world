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
            scale: 1,
            angleOffset: 0
        }
    }

    addSpawnVfx(vfxPack) {
        this.baseSpawnViewData.viewData = vfxPack.descriptor
        this.baseSpawnViewData.offset = vfxPack.offset;
        this.baseSpawnViewData.scale = vfxPack.scale;

        this.baseSpawnViewData.viewType = EntityViewData.ViewType.SpriteSheet;
    }

    addDestroyVfx(vfxPack) {
        this.baseDestroyViewData.viewData = vfxPack.descriptor
        this.baseDestroyViewData.offset = vfxPack.offset;
        this.baseDestroyViewData.scale = vfxPack.scale;

        this.baseDestroyViewData.viewType = EntityViewData.ViewType.SpriteSheet;
    }

    addStandardVfx(vfxPack) {
        this.baseViewData = vfxPack.descriptor
        this.baseSpawnViewData.offset = vfxPack.offset;
        this.baseSpawnViewData.scale = vfxPack.scale;

        this.type = EntityViewData.ViewType.SpriteSheet;
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

    clone() {
        let clone = new EntityViewData();
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                clone[key] = this[key];
            }
        }
        return clone;
    }
}