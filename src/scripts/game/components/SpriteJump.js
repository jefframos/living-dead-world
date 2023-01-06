import BaseComponent from '../core/gameObject/BaseComponent';
import signals from 'signals';

export default class SpriteJump extends BaseComponent{
    constructor() {
        super();        

        this.acc = 0
    }
    enable(){
        super.enable();
        this.gameObject.gameView.anchorOffset = Math.random() * Math.PI * 2;
    }
    update(delta){     
        if (this.gameObject.gameView.view) {    
            if (this.gameObject.physics.magnitude > 0) {
                this.gameObject.gameView.anchorOffset += delta * 5;
                this.gameObject.gameView.anchorOffset %= Math.PI
            } else {
                this.gameObject.gameView.anchorOffset = utils.lerp(this.gameObject.gameView.anchorOffset, 0, 0.5)
            }
             this.gameObject.gameView.view.anchor.y = 1 + Math.sin(this.gameObject.gameView.anchorOffset) * 0.5    
        }        
    }
}