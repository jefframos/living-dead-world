import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class StandardEnemy extends PIXI.Container {
    constructor() {
        super();

        this.bossSpriteSrc = 'ship1_e3_v3'
        this.enemySpriteSrc = 'ship7_e3_v3'
        this.enemySprite = new PIXI.Sprite.from(this.enemySpriteSrc);
        this.addChild(this.enemySprite);
        this.enemySprite.anchor.set(0.5)

        this.positionOffset = { x: 0, y: 0 }
        this.sin = Math.random();

        this.isBoss = false;

    }
    updatePosition() {
        this.positionOffset.y = Math.cos(this.sin) * 4

        this.enemySprite.x = 0;
        this.enemySprite.y = this.positionOffset.y;
    }
    update(delta) {
        this.sin += delta;
        this.sin %= Math.PI * 2;
        this.updatePosition();

        this.currentAngle = Math.atan2(this.positionOffset.y, this.positionOffset.x) * 0.1;
        this.enemySprite.rotation = utils.lerp(this.enemySprite.rotation, this.currentAngle, 0.002)
    }
    setAsBoss(sprite) {
        this.enemySprite.texture = PIXI.Texture.from(sprite ? sprite : this.bossSpriteSrc);
        this.isBoss = true;
    }
    setAsEnemy(sprite) {
        this.enemySprite.texture = PIXI.Texture.from(sprite ? sprite : this.enemySpriteSrc);
        this.isBoss = false;
    }
}