import * as signals from 'signals';

import GameObject from "../core/GameObject";
import Matter from "matter-js";
import Game from '../../Game';
import PhysicsModule from './PhysicsModule';

export default class InputModule extends GameObject {
    constructor(container) {
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

        this.container = container;

        this.marker = new PIXI.Graphics().beginFill(0xff66FF).drawCircle(0, 0, 10)

        //this.container.addChild(this.marker);
        this.container.interactive = true;

        this.container.on("pointermove", (e) => {

            //it might change if this is landscape
            this.marker.x = e.data.global.x / this.container.worldTransform.a - this.container.worldTransform.tx / this.container.worldTransform.a
            this.marker.y = e.data.global.y - this.container.worldTransform.ty

            this.globalMousePos.x = e.data.global.x / this.container.worldTransform.a - this.container.worldTransform.tx / this.container.worldTransform.a
            this.globalMousePos.y = e.data.global.y - this.container.worldTransform.ty
        })

        this.container.on("pointerdown", (e) => {

            this.mouseDown = true;
        })

        this.container.on("pointerup", (e) => {

            this.mouseDown = false;
        })
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

        console.log(this.container)
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
        console.log(this.axis)
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



        let zero = (-this.container.worldTransform.tx) / this.container.worldTransform.a


    }

    get isMouseDown() {
        return this.mouseDown;
    }
    get mouseDownPosition() {
        // this.globalMousePos.x = Game.GlobalScale.x * this.mouse.mousedownPosition.x - Game.GlobalContainerPosition.x
        // this.globalMousePos.y = Game.GlobalScale.y * this.mouse.mousedownPosition.y - Game.GlobalContainerPosition.y
        return this.globalMousePos;
    }
    get mousePosition() {
        //this.globalMousePos.x = this.mouse.position.x * Game.GlobalScale.x //- Game.GlobalContainerPosition.x
        //this.globalMousePos.y = Game.GlobalScale.y * this.mouse.position.y - Game.GlobalContainerPosition.y
        return this.globalMousePos;
    }
}