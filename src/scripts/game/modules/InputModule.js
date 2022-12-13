import Matter from "matter-js";
import GameObject from "../core/GameObject";
import * as signals from 'signals';
import PhysicsEntity from "./PhysicsEntity";
import StaticPhysicObject from "./StaticPhysicObject";

export default class InputModule extends GameObject {
    constructor() {
        super();


        this.axis = { x: 0, y: 0 }
        this.direction = 0;

        document.addEventListener('keydown', (event) => {
            this.getKey(event);
            event.preventDefault()
        })

        document.addEventListener('keyup', (event) => {
            this.getUpKey(event);
            event.preventDefault()
        })

    }
    get magnitude() {
        let sum = this.axis.x * this.axis.x + this.axis.y * this.axis.y;
        return Math.sqrt(sum);
    }
    getKey(e) {

        if (e.keyCode === 83 || e.keyCode === 40) {
            this.axis.y = 1
        }
        else if (e.keyCode === 65 || e.keyCode === 37) {
            this.axis.x = -1
        }
        else if (e.keyCode === 68 || e.keyCode === 39) {
            this.axis.x = 1
        } else if (e.keyCode === 87 || e.keyCode === 38) {
            this.axis.y = -1
        }

        this.direction = Math.atan2(this.axis.y, this.axis.x)
    }

    getUpKey(e) {
        if (e.keyCode === 83 || e.keyCode === 40) {
            this.axis.y = 0
        }
        else if (e.keyCode === 65 || e.keyCode === 37) {
            this.axis.x = 0
        }
        else if (e.keyCode === 68 || e.keyCode === 39) {
            this.axis.x = 0
        } else if (e.keyCode === 87 || e.keyCode === 38) {
            this.axis.y = 0
        }
        this.direction = Math.atan2(this.axis.y, this.axis.x)
    }
    update(delta) {
        super.update(delta)


    }

}