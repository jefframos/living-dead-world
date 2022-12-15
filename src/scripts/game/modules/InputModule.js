import * as signals from 'signals';

import GameObject from "../core/GameObject";
import Matter from "matter-js";
import Game from '../../Game';
import PhysicsModule from './PhysicsModule';

export default class InputModule extends GameObject {
    constructor() {
        super();


        this.axis = { x: 0, y: 0 }
        this.direction = 0;
        this.globalMousePos = { x: 0, y: 0 }

        document.addEventListener('keydown', (event) => {
            this.getKey(event);
            event.preventDefault()
        })

        document.addEventListener('keyup', (event) => {
            this.getUpKey(event);
            event.preventDefault()
        })


        this.mouse = Matter.Mouse.create();
        this.mouseDown = false;

        this.touchAxisDown = false;
    }

    start() {

        // this.physicsModule = this.engine.findByType(PhysicsModule)
        // var mouseConstraint = Matter.MouseConstraint.create(this.physicsModule.physicsEngine);

        // Matter.World.add(this.physicsModule.physicsEngine.world, mouseConstraint);

        // Matter.Events.on(mouseConstraint, 'mousedown', ()=> {
        //     this.mouseDown = true;
        // });

        // Matter.Events.on(mouseConstraint, 'mouseup', ()=> {
        //     this.mouseDown = false;
        // });
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

    get isMouseDown() {
        return this.mouseDown;
    }
    get mouseDownPosition() {
        this.globalMousePos.x = Game.GlobalScale.x * this.mouse.mousedownPosition.x - Game.GlobalContainerPosition.x
        this.globalMousePos.y = Game.GlobalScale.y * this.mouse.mousedownPosition.y - Game.GlobalContainerPosition.y
        return this.globalMousePos;
    }
    get mousePosition() {
        this.globalMousePos.x = this.mouse.position.x * Game.GlobalScale.x //- Game.GlobalContainerPosition.x
        this.globalMousePos.y = Game.GlobalScale.y * this.mouse.position.y - Game.GlobalContainerPosition.y
        return this.globalMousePos;
    }
}