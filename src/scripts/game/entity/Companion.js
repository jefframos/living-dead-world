import Bullet from "../components/weapon/bullets/Bullet";
import EffectsManager from "../manager/EffectsManager";
import GameAgent from "../core/entity/GameAgent";
import InGameWeapon from "../data/InGameWeapon";
import Layer from "../core/Layer";
import Player from "./Player";
import RenderModule from "../core/modules/RenderModule";
import Sensor from "../core/utils/Sensor";
import SpriteFacing from "../components/SpriteFacing";
import SpriteJump from "../components/SpriteJump";
import Vector3 from "../core/gameObject/Vector3";
import WeaponBuilder from "../screen/WeaponBuilder";

export default class Companion extends GameAgent {
    constructor() {
        super();
        this.gameView.layer = RenderModule.RenderLayers.Gameplay
        this.gameView.view = new PIXI.Sprite.from('daniel-cooler-idle_0')
    }
    build() {
        super.build()

        this.health.reset()

        this.currentEnemiesColliding = []



        this.sensor = this.engine.poolGameObject(Sensor)
        this.sensor.build(250)
        //this.sensor.onTrigger.add(this.onSensorTrigger.bind(this))
        this.addChild(this.sensor)
        this.buildCircle(0, 0, 15);

        this.speed = 50

        this.shootBaseTime = 2
        this.shootTimer = 0.5
        this.transform.angle = -Math.PI / 2
        this.layerCategory = Layer.Player
        this.layerMask = Layer.PlayerCollision

        this.gameView.view.anchor.set(0.5, 1)
        this.gameView.view.scale.set(20 / this.gameView.view.width * this.gameView.view.scale.x * 2)
        this.gameView.view.scale.y = Math.abs(this.gameView.view.scale.y);
        this.gameView.applyScale();

        this.anchorOffset = 0

        this.addComponent(SpriteJump)
        this.addComponent(SpriteFacing)

        

        this.addWeaponData(WeaponBuilder.instance.weaponsData['PISTOL_01'])

    }
    addWeaponData(weaponData) {

        let mainWeapon = new InGameWeapon();
        mainWeapon.addWeapon(weaponData)
        this.addWeapon(mainWeapon)      
    }
    addWeapon(inGameWeapon) {
        if (!inGameWeapon.hasWeapon) {
            return;
        }
        let weaponData = inGameWeapon.mainWeapon
        let weapon = this.engine.poolGameObject(weaponData.customConstructor)
        this.addChild(weapon)
        weapon.build(weaponData)
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


        this.sensor.x = this.transform.position.x
        this.sensor.z = this.transform.position.z

        if (Vector3.distance(this.transform.position, Player.MainPlayer.transform.position) > 100) {
            this.transform.angle = Vector3.atan2XZ(Player.MainPlayer.transform.position, this.transform.position)
            this.physics.velocity.x = Math.cos(this.transform.angle) * this.speed * delta
            this.physics.velocity.z = Math.sin(this.transform.angle) * this.speed * delta
        } else {
            this.physics.velocity.zero();
        }

        super.update(delta)

    }
}