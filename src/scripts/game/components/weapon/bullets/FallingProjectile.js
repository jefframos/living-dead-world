import Bullet from "./Bullet";
import FloorTarget from "../../view/FloorTarget";
import Utils from "../../../core/utils/Utils";

export default class FallingProjectile extends Bullet {
    constructor() {
        super();
    }
    build(weapon, parent, fromPlayer) {
        super.build(weapon, parent, fromPlayer)

        this.target = weapon;

        this.timeToFall = 3;
        this.currentTime = 0;

        let target = this.engine.poolGameObject(FloorTarget)
        this.addChild(target)
        target.updateScale(2)

        this.high = weapon.weaponViewData.baseViewData.maxHeight;

        this.transform.position.y = -this.high
        this.gameView.view.visible = false;

        
        
    }
    collisionEnter() { }
    update(delta) {
        super.update(delta);
        
        this.gameView.view.visible = true;
        this.currentTime += delta;
        this.normalized = this.currentTime / this.timeToFall;
        this.transform.position.y = Utils.easeOutCubic(1 - this.normalized) * -this.high;
        this.gameView.view.rotation = Math.PI
        if (this.currentTime <= 0) {
            this.destroy();
        }
    }

}