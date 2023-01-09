import Vector3 from "../gameObject/Vector3";

export default class PhysicsProperties {
    constructor() {
        this.density = 0.1;
        this.angle = 0;
        
        this.velocity = new Vector3();
        this.unscaleVelocity = new Vector3();
        this.force = new Vector3();
        this.force2D = new Vector3();

    }
    get magnitude() {
        {
            let sum = this.velocity.x * this.velocity.x + this.velocity.z * this.velocity.z;
            return Math.sqrt(sum);
        }
    }
}