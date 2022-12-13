import Matter from "matter-js";
import GameObject from "../core/GameObject";
import Health from "../core/Health";
import SpriteSheetAnimation from "../entity/SpriteSheetAnimation";
import PhysicsEntity from "./PhysicsEntity";

export default class GameAgent extends PhysicsEntity {
    constructor(radius = 15, debug = false) {
        super(radius, debug);       

        this.totalDirections = 6

        this.shadow = new PIXI.Sprite.from('shadow')
        this.shadow.anchor.set(0.5, 0.5)
        this.shadow.alpha = 0.1
        this.shadow.scale.set(30 / this.shadow.width)
        this.shadow.scale.y = this.shadow.scale.x * 0.8

        this.view = new SpriteSheetAnimation()
        this.view.anchor.set(0.5, 0.75)

        this.health = new Health();


        this.timer = Math.random()
        this.speed = 0.5 * Math.random()
        this.speedAdjust = 1;
    }
    update(delta) {
        super.update(delta);


        this.view.x = this.transform.position.x
        this.view.y = this.transform.position.y

        this.shadow.x = this.transform.position.x
        this.shadow.y = this.transform.position.y



        if (this.view.init) {
            this.view.setLayer(this.calcFrame())
            this.view.update(delta)
        }
    }
    injectAnimations(animations){
        animations.forEach(element => {
            for (let index = this.totalDirections; index >= 1; index--) {
                this.view.addLayer(element.id, this.characterAnimationID + '_' + element.name + '_' + index * 60 + '_', { min: 0, max: element.frames-1 }, element.speed)
            }
        });

        this.view.setLayer(0)
        this.view.randomStartFrame();
    }
    onRender() {
    }
    calcFrame() {
        if(this.physics.magnitude == 0) return -1;

        let ang = (this.physics.angle * 180 / Math.PI)
        if (ang <= 0) {
            ang += 360
        }
        let layer = Math.round(ang / (360 / this.totalDirections)) + 1
        if (layer < 0) {
            layer += this.totalDirections
        }
        layer %= this.totalDirections

        return layer;
    }
}