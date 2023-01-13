import BaseComponent from '../core/gameObject/BaseComponent';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class SpriteFacing extends BaseComponent{
    constructor() {
        super();        
    }
    enable(){
        super.enable()
        this.target = this.gameObject.gameView.baseScale.x;
    }
    update(delta){     
        
        if(this.gameObject.physics.velocity.x > 0.01){            
            this.target = -this.gameObject.gameView.baseScale.x;
        }else if(this.gameObject.physics.velocity.x < -0.01){
            this.target = this.gameObject.gameView.baseScale.x;
        }
        this.gameObject.gameView.view.scale.x = Utils.lerp(this.gameObject.gameView.view.scale.x, this.target,0.1)
    }
}