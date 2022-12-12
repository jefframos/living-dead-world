import * as PIXI from 'pixi.js';
export default class StarParticle extends PIXI.Container {
    constructor(size) {
        super();

        let listParticles = ['star1', 'star2']
        let p = listParticles[Math.floor(Math.random() * listParticles.length)];
        // console.log(p);
        this.graphics = new PIXI.Sprite(PIXI.Texture.from(p)); // new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0,0,size,size);
        this.graphics.anchor.set(0.5);

        this.graphics.scale.set(size / this.graphics.width)
        // this.graphics.rotation = Math.PI / 4;
        this.addChild(this.graphics);
        this.velocity = {
            x: 0,
            y: 0
        }
    }
    update(velY, size) {

        this.y += velY * this.alpha* this.alpha

        if (this.y > size.height) {
            this.y = -size.height / 2 //-= size.height * 1.1
            this.x = Math.random() * size.width - size.width / 2

        }

    }
}