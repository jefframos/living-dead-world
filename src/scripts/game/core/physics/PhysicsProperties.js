export default class PhysicsProperties {
    constructor() {
        this.density = 0.1;
        this.angle = 0;
        this.velocity = new PIXI.Point();
        this.unscaleVelocity = new PIXI.Point();
        this.force = new PIXI.Point();

    }
    get magnitude() {
        {
            let sum = this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y;
            return Math.sqrt(sum);
        }
    }
}