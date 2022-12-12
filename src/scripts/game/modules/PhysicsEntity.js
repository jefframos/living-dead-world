import Matter from "matter-js";
import GameObject from "../core/GameObject";

export default class PhysicsEntity extends GameObject {
    constructor() {
        super();
        this.body = null;
        this.type = null;
    }

    buildRect(x,y,width,height,isStatic = false){
        this.body = Matter.Bodies.rectangle(x,y,width,height, { isStatic: isStatic });
        this.transform.position = this.body.position;
        this.type = 'rect'
        return this.body
    }
    buildCircle(x,y,radius,isStatic = false){
        this.body = Matter.Bodies.circle(x,y,radius, { isStatic: false, restitution: 1 });
        this.transform.position = this.body.position;
        this.type = 'circle'
        return this.body
    }
    update(delta){
        this.transform.position.x = this.body.position.x;
        this.transform.position.y = this.body.position.y;
    }
}