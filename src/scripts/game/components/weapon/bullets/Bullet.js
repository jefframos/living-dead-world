import BaseEnemy from "../../../entity/BaseEnemy";
import GameManager from "../../../manager/GameManager";
import GameView from "../../../core/view/GameView";
import Layer from "../../../core/Layer";
import PhysicsEntity from "../../../core/physics/PhysicsEntity";
import PhysicsModule from "../../../core/modules/PhysicsModule";
import config from "../../../../config";

export default class Bullet extends PhysicsEntity {
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite.from('knife')
        this.gameView.view.alpha = 1

        this.enemiesShot = [];
        //this.setDebug(15)
    }
    build(radius = 15, speed = 250, distanceSpan = 50, lifeSpan = 9999) {
        super.build()
        this.buildCircle(0, 0, radius)

        this.enemiesShot = [];
        this.gameView.view.anchor.set(0.5)
        //this.gameView.view.scale.set(1.5)
        this.gameView.view.scale.set(5 / this.gameView.view.width * this.gameView.view.scale.x)

        this.rigidBody.collisionFilter.group = 2
        this.rigidBody.collisionFilter.mask = 3



        this.speed = speed
        this.power = 100;

        this.usesTime = distanceSpan <= 0;
        this.lifeSpan = lifeSpan
        this.distanceSpan = distanceSpan;

        this.layerCategory = Layer.Bullet
        this.layerMask = Layer.BulletCollision

        this.rigidBody.isSensor = true

        this.gameView.viewOffset.y = -15

        this.gameView.view.alpha = 1;
        this.gameView.view.visible = true;

    }
    enable() {
        super.enable();
        this.gameView.view.visible = false
    }
    shoot(ang, magnitude) {
        this.angle = ang;

        this.speed += this.speed * magnitude * 0.5
        this.gameView.view.rotation = this.angle + Math.PI / 2

        this.physics.velocity.x = 0
        this.physics.velocity.y = 0
        this.physics.velocity.z = 0
    }
    collisionEnter(collided) {

        if (this.enemiesShot.indexOf(collided) >= 0) return;
        this.enemiesShot.push(collided);
        if (collided.rigidBody.isSensor) {
            return;
        }
        if (collided.rigidBody.isStatic) {
            this.destroy()

        } else {
            if (collided.die) {
                collided.damage(this.power);

                if (collided.dying) {

                    // let enemy = GameManager.instance.addEntity(BaseEnemy, true)
                    // //this.engine.poolAtRandomPosition(BaseEnemy, true, {minX:50, maxX: config.width, minY:50, maxY:config.height})
                    // let angle = Math.PI * 2 * Math.random();
                    // enemy.x = this.transform.position.x + Math.cos(angle) * config.width
                    // enemy.z = this.transform.position.z + Math.sin(angle) * config.height
                } else {
                    if (collided.applyForce) {
                        let angle = Math.atan2(collided.transform.position.z - this.transform.position.z, collided.transform.position.x - this.transform.position.x);
                        let forceBack = { x: Math.cos(angle) * 5, y: Math.sin(angle) * 5 };
                        collided.applyForce(forceBack)
                    }
                }
                //this.destroy()
            } else {

                collided.destroy();
            }
            //this.destroy()
        }
    }
    start() {
        this.physicsModule = this.engine.findByType(PhysicsModule)
    }

    update(delta) {
        super.update(delta)
        this.physics.velocity.x = Math.cos(this.angle) * this.speed * delta
        this.physics.velocity.z = Math.sin(this.angle) * this.speed * delta

        if (!this.usesTime) {
            this.distanceSpan -= this.speed * delta;
            if (this.distanceSpan <= 0) {
                this.destroy()
            }
        } else {
            this.lifeSpan -= delta
            if (this.lifeSpan <= 0) {
                this.destroy()
            }
        }
        this.gameView.view.x = this.transform.position.x
        this.gameView.view.y = this.transform.position.z + this.viewOffset.y

        this.gameView.view.rotation = this.transform.angle + Math.PI / 2
        this.gameView.view.visible = true;
    }
}