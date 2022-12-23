import * as PIXI from 'pixi.js';

export default class Layer extends PIXI.Container {

    static Nothing = 0;
    static Everything = 1;
    static Default = 2;
    static Player = 0b0001;
    static Enemy = 0b0011;
    static Environment = 0b0010;
    static Bullet = 0b0100;

    static PlayerCollision = Layer.Environment | Layer.Default | Layer.Enemy
    static EnemyCollision = Layer.Environment | Layer.Default | Layer.Player | Layer.Bullet
    static BulletCollision = Layer.Environment | Layer.Default | Layer.Enemy

    constructor(name) {
        super()
        this.layerName = name;
    }
    onRender(){
        this.children.sort((a, b) => {
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            } else {
                return 0;
            }
        });
    }
}