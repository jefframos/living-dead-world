import BaseComponent from '../core/gameObject/BaseComponent';
import Pool from '../core/utils/Pool';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import SpriteSheetBehaviour from './particleSystem/particleBehaviour/SpriteSheetBehaviour';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class GameViewSpriteSheet extends BaseComponent {
    static AnimationType = {
        Idle :'idle',
        Running:'running'
    }
    constructor() {
        super();
    }
    enable() {
        super.enable()
    }
    destroy(){
        super.destroy();
        Pool.instance.returnElement(this.spriteSheet);
        this.spriteSheet = null;
    }
    setData(data) {
        this.spriteSheet = Pool.instance.getElement(SpriteSheetAnimation)
        this.view = this.gameObject.gameView.view;
        
        this.spriteSheet.reset();

        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                this.spriteSheet.addLayer(key, element.spriteName, element.params);                
            }
        }
    }
    update(delta) {
        if(!this.spriteSheet){
            return;
        }
        this.spriteSheet.update(delta);
        if(this.spriteSheet.currentFrame){
            this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)
        }

        if (this.gameObject.physics.magnitude > 0) {
            this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Running)
        } else {
            this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Idle)
        }
    }
}