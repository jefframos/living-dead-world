import Matter, { Body } from "matter-js";

import GameObject from "../gameObject/GameObject";
import PhysicsProperties from "../physics/PhysicsProperties";
import Vector3 from "../gameObject/Vector3";
import utils from "../../../utils";

export default class PhysicsEntity extends GameObject {
    constructor() {
        super();
        this.rigidBody = null;
        this.type = null;
        this.viewOffset = new Vector3()
        this.autoSetAngle = true;
        this.appliedForce = new Vector3()
        this.friction = 0.1;
    }

    get bodyID() {
        return this.rigidBody.id;
    }
    build() {
        this.physics = new PhysicsProperties();
    }
    setDebug(radius = 15, color = 0xFFFFFF) {

        //improve this debug to fit the body
        if (!this.debug) {
            this.debug = new PIXI.Sprite.from('debugRound')
            this.debug.anchor.set(0.5)
            this.debug.alpha = 0.1
            this.debug.tint = color;

            this.label = new PIXI.Text('')
            this.label.anchor.set(0.5, -1)
            this.label.alpha = 5

            this.label.style.fill = color;
            this.label.style.fontSize = 8
            this.debug.addChild(this.label)

        }
        this.debug.scale.set(radius / this.debug.width * 2)
        this.label.scale.set(1 / this.debug.scale.x)

        this.label.anchor.y = -1 / this.label.scale.x
    }
    destroy() {
        super.destroy();

        if (this.view) {
            this.view.visible = false;
        }
    }
    buildRect(x, y, width, height, isStatic = false) {
        this.rigidBody = Matter.Bodies.rectangle(x, y, width, height, { isStatic: isStatic });
        this.rigidBody.gameObject = this;
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;
        this.type = 'rect'

        this.engine.physics.addAgent(this)

        return this.rigidBody
    }
    buildCircle(x, y, radius, isStatic = false) {
        this.rigidBody = Matter.Bodies.circle(x, y, radius, { isStatic: false, restitution: 1 });
        this.rigidBody.gameObject = this;
        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;
        this.type = 'circle'

        this.engine.physics.addAgent(this)

        return this.rigidBody
    }
    applyForce(force) {
        if (!this.rigidBody) return;

        this.appliedForce.x = force.x
        this.appliedForce.y = force.z
    }
    applyVelocity(force){
        Matter.Body.setVelocity(this.rigidBody, force)
    }
    update(delta) {

        super.update(delta);

        this.transform.position.x = this.rigidBody.position.x;
        this.transform.position.z = this.rigidBody.position.y;

        if (this.autoSetAngle && this.physics.magnitude > 0) {
            this.transform.angle = Math.atan2(this.physics.velocity.z, this.physics.velocity.x);
        }

        this.physics.unscaleVelocity.x = this.physics.velocity.x / delta;
        this.physics.unscaleVelocity.z = this.physics.velocity.z / delta;

        this.physics.force.x = this.physics.velocity.x + this.appliedForce.x
        this.physics.force.z = this.physics.velocity.z + this.appliedForce.z
        
        this.physics.force2D.x = this.physics.force.x
        this.physics.force2D.y = this.physics.force.z

        this.appliedForce.x = utils.lerp(this.appliedForce.x, 0, this.friction);
        this.appliedForce.z = utils.lerp(this.appliedForce.z, 0, this.friction);
        
        this.applyVelocity(this.physics.force2D);
        this.physics.angle = this.transform.angle

        if (this.debug) {
            
            this.debug.x = this.transform.position.x
            this.debug.y = this.transform.position.z
            this.debug.rotation = this.physics.angle
            this.label.rotation = - this.debug.rotation
            this.label.text = this.rigidBody.circleRadius + " - " + this.rigidBody.position.x.toFixed(1) + " - " + this.rigidBody.position.y.toFixed(1)

        }

        this.physics.update();
    }

    set layerMask(value) {
        this.rigidBody.collisionFilter.mask = value;
    }
    set layerGroup(value) {
        this.rigidBody.collisionFilter.group = value;
    }
    set layerCategory(value) {
        this.rigidBody.collisionFilter.category = value;
    }

    get layerMask() {
        return this.rigidBody.collisionFilter.mask;
    }
    get layerGroup() {
        return this.rigidBody.collisionFilter.group;
    }
    get layerCategory() {
        return this.rigidBody.collisionFilter.category;
    }
    get facing() {
        return this.physics.facing;
    }
    get facingAngle() {
        return this.physics.facing > 0 ? Math.PI :  0;
    }
    get facingAngleBack() {
        return this.physics.facing < 0 ? Math.PI :  0;
    }
    /**
     * @param {number} value
     */
    set x(value) {
        Matter.Body.setPosition(this.rigidBody, { x: value, y: this.rigidBody.position.y })
        this.transform.position.x = this.rigidBody.position.x;
    }
    /**
     * @param {number} value
     */
    set y(value) {
        this.transform.position.y = value;
    }
    /**
     * @param {number} value
     */
    set z(value) {
        Matter.Body.setPosition(this.rigidBody, { x: this.rigidBody.position.x, y: value })
        this.transform.position.z = this.rigidBody.position.y;
    }
}