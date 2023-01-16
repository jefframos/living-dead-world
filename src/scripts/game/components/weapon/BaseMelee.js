import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import EffectsManager from "../../manager/EffectsManager";
import Layer from "../../core/Layer";
import ParticleDescriptor from "../particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../particleSystem/particleBehaviour/SpriteSheetBehaviour";
import WeaponAttributes from "../../data/WeaponAttributes";

export default class BaseMelee extends BaseWeapon {
    constructor() {
        super();

        this.spriteSheetTest = new ParticleDescriptor({ lifeSpan: 999 })
        this.spriteSheetTest.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-h',
            addZero: false,
        })
    }

    shoot() {
        super.shoot();

        let facing = this.getFacing();
        let target = { x: this.parent.gameView.x + facing * -50, y: this.parent.gameView.y - 10 + this.parent.physics.velocity.y }
        EffectsManager.instance.emitParticles(target, this.spriteSheetTest, 1, { scale: { x: -facing, y: 1 } })

    }
}