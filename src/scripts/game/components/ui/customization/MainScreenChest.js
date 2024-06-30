import * as PIXI from 'pixi.js';
import UIUtils from '../../../utils/UIUtils';

export default class MainScreenChest extends PIXI.Container {
    constructor(imagePath, labelText, clickCallback, video = true) {
        super();

        // Create and add the bouncing image
        this.image = PIXI.Sprite.from(imagePath);
        this.image.anchor.set(0.5, 1);
        this.image.x = this.image.width / 2;
        this.image.y = this.image.height / 2;
        this.addChild(this.image);
        this.clickCallback = clickCallback;

        this.shape = new PIXI.Graphics().beginFill(0xFF0000).drawRect(0, -150, 180, 300)
        this.addChild(this.shape);
        this.shape.alpha = 0
        // Create and add the label
        this.label = UIUtils.getPrimaryLabel('', { fontSize: 42 })//new PIXI.Text(labelText, { fill: 'white' });
        this.label.anchor.set(0.5);
        this.label.x = this.image.x + (video ? 20 : 0);
        this.label.y = this.image.y + 20;
        this.addChild(this.label);

        this.useBar = false



        // Variables for bouncing animation

        this.gravity = 900;
        this.bounceSpeed = 200;
        this.bounceHeight = 100;

        this.floorY = this.image.y - 10;
        this.ready = false;

        this.bounceDirection = 1;
        this.ready = false;

        this.bouncing = false;
        this.bounceInterval = 5000; // 3 seconds

        // Time and icon
        this.timeText = labelText;
        this.playIcon = ' ▶';

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointertap', this.handleClick.bind(this));

        this.rnd = Math.random() * 3.14 * 2

        this.tubeContainer = new PIXI.Container();
        this.addChild(this.tubeContainer)

        this.tubeFillContainer = new PIXI.Container();
        this.tubeFillContainer.y = 3
        this.tubeContainer.addChild(this.tubeFillContainer)

        this.tubeFill = new PIXI.Sprite.from('tube-fill')
        this.tubeFillContainer.addChild(this.tubeFill)

        this.tubeFillMask = new PIXI.Sprite.from('tube-fill-mask')
        this.tubeFillContainer.addChild(this.tubeFillMask)
        this.tubeFillContainer.mask = this.tubeFillMask;
        this.tubeFill.x = -this.tubeFill.width * 0.5

        this.tubeFillFront = new PIXI.Sprite.from('tube-fill-front')
        this.tubeContainer.addChild(this.tubeFillFront)

        this.tubeFillContainer.scale.set(1.2)
        this.tubeFillFront.scale.set(1.2)

        this.tubeFillContainer.y = -this.tubeFillContainer.height / 2
        this.tubeFillFront.y = this.tubeFillContainer.y

        this.tubeFillContainer.x = -10
        this.tubeFillFront.x = this.tubeFillContainer.x

        this.videoIcon = PIXI.Sprite.from(UIUtils.getIconUIIcon('video'));
        this.videoIcon.anchor.set(0.5, 1);

        this.tubeContainer.x = 10
        this.tubeContainer.y = 68
        this.videoIcon.x = this.videoIcon.width / 2 - 35;
        this.videoIcon.y = this.videoIcon.height + 50;
        this.addChild(this.videoIcon);
        if (this.useBar) {
            this.label.visible = false
        } else {
            this.tubeContainer.visible = false
        }

        this.videoIcon.visible = video

    }
    handleClick() {
        if (this.ready && this.clickCallback) {
            this.clickCallback();
        }
    }
    update(delta) {
        if (this.ready && this.bouncing) {
            // Apply gravity to the bounce speed
            this.bounceSpeed += this.gravity * delta;
            this.image.y += this.bounceSpeed * delta;

            // Check for collision with the floor
            if (this.image.y > this.floorY) {
                this.image.y = this.floorY;
                this.bounceSpeed = -this.bounceSpeed * 0.6; // Reverse speed and reduce it to simulate energy loss

                // Stop bouncing if the speed is very low
                if (Math.abs(this.bounceSpeed) < 30) {
                    this.bouncing = false;
                    this.resetBounceAfterDelay();
                }
            }

            // Stretch the image based on its vertical speed
            // const stretchFactor = Math.max(1 - this.bounceSpeed / 30, 0.8);
            // this.image.scale.set(stretchFactor, 1 / stretchFactor);
        }
    }
    resetBounceAfterDelay() {
        setTimeout(() => {
            this.startBounce();
        }, this.bounceInterval);
    }

    startBounce() {
        if (!this.bouncing) {
            this.bounceSpeed = -Math.sqrt(2 * this.gravity * this.bounceHeight * Math.random()); // Initial speed for the bounce
        }
        this.bouncing = true;
    }
    setReady(state) {
        this.ready = state;
        if (this.ready) {
            this.label.text = "Open"//this.timeText + this.playIcon;
            this.startBounce();
        } else {
            this.bouncing = false;
            this.image.y = this.floorY
        }
    }
    updateNormal(normal) {

        this.tubeFill.x = -this.tubeFill.width * Math.max(0.15, normal)
    }
    setTime(timeText) {


        this.timeText = timeText;
        if (this.ready) {
            this.label.text = this.timeText + this.playIcon;
        } else {
            this.label.text = this.timeText;
        }
    }
}