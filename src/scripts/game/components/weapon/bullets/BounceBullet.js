import Bullet from "./Bullet";
import GameManager from "../../../manager/GameManager";
import Vector3 from "../../../core/gameObject/Vector3";

export default class BounceBullet extends Bullet {
    constructor() {
        super();
    }

    afterCollide(entity) {

        let angle = Math.atan2(entity.transform.position.z - this.transform.position.z, entity.transform.position.x - this.transform.position.x);
        this.angle = angle + Math.PI + Math.random() * 0.1 - 0.5;
    }

    update(delta){
        super.update(delta);
        if(GameManager.instance.distanceFromPlayer(Vector3.sum(this.transform.position, this.physics.velocity)) > this.weapon.weaponAttributes.detectionZone){
            this.angle = GameManager.instance.angleFromPlayer(this.transform.position) + Math.PI;
        }

    }

}