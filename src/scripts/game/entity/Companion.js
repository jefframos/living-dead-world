import Bullet from "../components/weapon/bullets/Bullet";
import EffectsManager from "../manager/EffectsManager";
import GameAgent from "../core/entity/GameAgent";
import InGameWeapon from "../data/InGameWeapon";
import Layer from "../core/Layer";
import Player from "./Player";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import Shadow from "../components/view/Shadow";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/WeaponBuilder";

export default class Companion extends GameAgent {
    constructor() {
        super();
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite.from('fly-drone_0')
    }
    build() {
        super.build()

        this.health.reset()

        this.currentEnemiesColliding = []

        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);

        this.speed = 50

        this.shootBaseTime = 2
        this.shootTimer = 0.5
        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.FlightCompanion
        this.layerMask = Layer.Nothing

        this.rigidBody.isSensor = true

        this.gameView.view.anchor.set(0.3, 1)
        this.gameView.view.scale.set(20 / this.gameView.view.width * this.gameView.view.scale.x * 2)
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.applyScale();

        this.anchorOffset = 0

        this.addComponent(SpriteFacing)
        this.addChild(this.engine.poolGameObject(Shadow))

        this.addWeaponData(WeaponBuilder.instance.weaponsData['LIGHTNING_IN_PLACE'])

        this.targetAngle = Math.random() * Math.PI * 2;

        this.targetPosition = new Vector3();
    }
    
    afterBuild() {
        this.targetPosition.copy(this.parent.transform.position)

    }
    collisionEnter(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (this.findInCollision(collided)) return;
        this.currentEnemiesColliding.push({ entity: collided, timer: 0 });
    }
    collisionExit(collided) {
        if (collided.layerCategory != Layer.Enemy) return;
        if (!this.findInCollision(collided)) return;
        this.currentEnemiesColliding = this.currentEnemiesColliding.filter(item => item.entity !== collided);
    }

    update(delta) {


        this.currentEnemiesColliding.forEach(element => {
            if (element.timer <= 0) {
                this.damage(10);
                element.timer = 1;
            } else {
                element.timer -= delta;
            }
        });

        this.targetPosition.copy(this.parent.transform.position)

        this.targetAngle += delta;
        this.targetAngle %= Math.PI * 2;

        this.targetPosition.x +=  Math.cos(this.targetAngle) * 150
        this.targetPosition.z +=  Math.sin(this.targetAngle) * 150

        this.sensor.x = this.transform.position.x
        this.sensor.z = this.transform.position.z
        this.transform.position.y = -50

        if (Vector3.distance(this.transform.position, this.targetPosition) > 20) {
            this.transform.angle = Vector3.atan2XZ(this.targetPosition, this.transform.position)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta
        } else {
            this.physics.velocity.zero();
        }

        super.update(delta)

    }
}