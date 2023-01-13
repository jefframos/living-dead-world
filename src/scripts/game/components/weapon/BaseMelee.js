import BaseWeapon from "./BaseWeapon";
import Bullet from "./bullets/Bullet";
import EffectsManager from "../../manager/EffectsManager";
import Layer from "../../core/Layer";
import ParticleDescriptor from "../particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../particleSystem/particleBehaviour/SpriteSheetBehaviour";

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
        this.shootFrequency = 1;

        //console.log(this.spriteSheetTest)
    }
    build() {
        super.build();
    }

    shoot() {
        super.shoot();

        let facing = this.parent.gameView.view.scale.x > 0 ? 1 : -1;
        let facingAng = facing > 0 ? Math.PI : 0;

        console.log("they way im adding more enemies is broken")
        let bullet = this.engine.poolGameObject(Bullet)
        bullet.build(15, 250, 100);
        bullet.distanceSpan = 80
        bullet.setPosition(this.transform.position.x + this.parent.physics.velocity.x + facing * -20, 0, this.transform.position.z);
        bullet.shoot(facingAng, Math.abs(this.parent.physics.velocity.x))

        bullet.gameView.view.alpha = 0;
        let target = { x: this.parent.gameView.x + facing * -50, y: this.parent.gameView.y - 10 + this.parent.physics.velocity.y }
        EffectsManager.instance.emitParticles(target, this.spriteSheetTest, 1, { scale: { x: -facing, y: 1 } })
    }
}