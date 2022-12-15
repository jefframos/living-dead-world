import GameObject from "../core/GameObject";
import Matter from "matter-js";
import PhysicsProperties from "../core/PhysicsProperties";

export default class PhysicsEntity extends GameObject {
    constructor() {
        super();
        this.body = null;
        this.type = null;
        this.viewOffset = {x:0, y:0}
        this.autoSetAngle = true;
    }
    
    get bodyID() {
        return this.body.id;
    }
    build() {
        this.physics = new PhysicsProperties();
    }
    setDebug(radius = 15) {

        //improve this debug to fit the body
        if (!this.debug) {
            this.debug = new PIXI.Sprite.from('debugRound')
            this.debug.anchor.set(0.5)
            this.debug.alpha = 0.1

            this.label = new PIXI.Text('')
            this.label.anchor.set(0.5,-1)
            this.label.alpha = 5

            this.label.style.fill = 0xFFFFFF;
            this.label.style.fontSize = 8
            this.debug.addChild(this.label)

        }
        this.debug.scale.set(radius / this.debug.width * 2)
    }
    destroy(){
        super.destroy();

        if(this.view){
            this.view.visible = false;
        }
    }
    buildRect(x, y, width, height, isStatic = false) {
        this.body = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.body.gameObject = this;
        this.transform.position = this.body.position;
        this.type = 'rect'
        if(this.engine.physics){
            this.engine.physics.addAgent(this)
        }
        return this.body
    }
    buildCircle(x, y, radius, isStatic = false) {
        this.body = Matter.Bodies.circle(x, y, radius, { isStatic: false, restitution: 1 });
        this.body.gameObject = this;
        this.transform.position = this.body.position;
        this.type = 'circle'
        if(this.engine.physics){
            this.engine.physics.addAgent(this)
        }
        return this.body
    }
    update(delta) {
        this.transform.position.x = this.body.position.x;
        this.transform.position.y = this.body.position.y;

        if(this.autoSetAngle && this.physics.magnitude > 0){
            this.transform.angle = Math.atan2(this.physics.velocity.y, this.physics.velocity.x); 
        }

        Matter.Body.setVelocity(this.body, this.physics.velocity)
        this.physics.angle = this.transform.angle

        if (this.debug) {
            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.y
            this.debug.rotation = this.physics.angle
            this.label.rotation = - this.debug.rotation
            this.label.text = this.body.position.x.toFixed(1) + " - " + this.body.position.y.toFixed(1)
        }
    }

    set layerMask(value) {
        this.body.collisionFilter.mask = value;
    }
    set layerGroup(value) {
        this.body.collisionFilter.group = value;
    }
    set layerCategory(value) {
        this.body.collisionFilter.category = value;
    }
    /**
     * @param {number} value
     */
    set x(value) {
        Matter.Body.setPosition(this.body, { x: value, y: this.body.position.y })
        this.transform.position.x = this.body.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        Matter.Body.setPosition(this.body, { x: this.body.position.x, y: value })
        this.transform.position.y = this.body.position.y;
    }

}