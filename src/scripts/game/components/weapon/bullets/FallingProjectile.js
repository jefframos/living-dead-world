import Bullet from "./Bullet";
import FloorTarget from "../../view/FloorTarget";

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
        this.transform.position.y = this.easeOutCubic(1 - this.normalized) * -this.high;
        this.gameView.view.rotation = Math.PI
        if (this.currentTime <= 0) {
            this.destroy();
        }
    }
    easeOutBack(x) {
        const c1 = 1.70158;
        const c3 = c1 + 1;

        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }
    easeOutQuad(x) {
        return 1 - (1 - x) * (1 - x);
    }

    easeInQuad(x) {
        return x * x;
    }
    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }
}