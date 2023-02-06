import EffectsManager from "../manager/EffectsManager";
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
        Static: 1,
        Follow: 2,
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
            movementType: EntityViewData.MovementType.Static,
            offset: new Vector3(),
            alpha: 1,
            faceOrientation: true,
            scale: 1,
            angleOffset: 0,
            fitRadius: true,
            lockRotation: false,
            width: 1,
            height: 1,
            maxHeight:0,
            rotationSpeed:0,
            targetLayer: EffectsManager.TargetLayer.GameplayLayer

        }
    }

    addSpawnVfx(vfxPack) {
        this.baseSpawnViewData.viewData = vfxPack.descriptor
        this.baseSpawnViewData.offset = vfxPack.offset;
        this.baseSpawnViewData.scale = vfxPack.scale;
        this.baseSpawnViewData.lockRotation = vfxPack.lockRotation;
        this.baseSpawnViewData.targetLayer = vfxPack.targetLayer !== undefined ? vfxPack.targetLayer :  EffectsManager.TargetLayer.GameplayLayer;
        this.baseSpawnViewData.viewType = EntityViewData.ViewType.SpriteSheet;
        this.extractDimensions(vfxPack.descriptor, this.baseSpawnViewData)
    }

    addDestroyVfx(vfxPack) {
        this.baseDestroyViewData.viewData = vfxPack.descriptor
        this.baseDestroyViewData.offset = vfxPack.offset;
        this.baseDestroyViewData.scale = vfxPack.scale;
        this.baseDestroyViewData.lockRotation = vfxPack.lockRotation;
        this.baseDestroyViewData.targetLayer = vfxPack.targetLayer !== undefined ? vfxPack.targetLayer :  EffectsManager.TargetLayer.GameplayLayer;

        this.baseDestroyViewData.viewType = EntityViewData.ViewType.SpriteSheet;
        this.extractDimensions(vfxPack.descriptor, this.baseDestroyViewData)

    }

    addStandardVfx(vfxPack) {
        this.baseViewData.viewData = vfxPack.descriptor
        this.baseViewData.offset = vfxPack.offset;
        this.baseViewData.scale = vfxPack.scale;
        this.baseViewData.lockRotation = vfxPack.lockRotation;
        this.baseViewData.targetLayer = vfxPack.targetLayer !== undefined ? vfxPack.targetLayer :  EffectsManager.TargetLayer.GameplayLayer;
        this.baseViewData.movementType = EntityViewData.MovementType.Follow;

        this.baseViewData.viewType = EntityViewData.ViewType.SpriteSheet;
        this.extractDimensions(vfxPack.descriptor, this.baseViewData)
    }

    extractDimensions(descriptor, target) {
        let spriteSheet = descriptor.findBehaviour(SpriteSheetBehaviour);
        if (spriteSheet) {
            let texture = PIXI.Texture.from(spriteSheet.frames[0])
            target.width = texture.width
            target.height = texture.height
        }

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