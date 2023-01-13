import Layer from "../../core/Layer";
import PhysicsEntity from "../../core/physics/PhysicsEntity";

export default class BaseWeapon extends PhysicsEntity {
    constructor() {
        super();

        this.collisionList = []
        this.currentEnemiesColliding = []

        //this.setDebug(200)

        this.currentShootTimer = 0;
        this.shootFrequency = 5;

    }
    build() {
        super.build();
        this.buildCircle(0, 0, 200)

        this.rigidBody.isSensor = true;

        this.layerCategory = Layer.Sensor
        this.layerMask = Layer.Enemy - Layer.Player// &! Layer.Environment
    }
    findInCollision(entity) {
        for (let index = 0; index < this.currentEnemiesColliding.length; index++) {
            if (this.currentEnemiesColliding[index].entity == entity) {
                return true;
            }
        }
        return false;
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
    shoot() {
        this.currentShootTimer = 0;

    }
    update(delta) {

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z

        // this.debug.x = this.transform.position.x
        // this.debug.y = this.transform.position.z

        if(this.currentShootTimer <  this.shootFrequency){
            this.currentShootTimer += delta;
        }else{
            this.shoot();
        }
    }
}