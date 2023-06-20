import BaseComponent from '../core/gameObject/BaseComponent';
import Utils from '../core/utils/Utils';
import signals from 'signals';

export default class SpriteFacing extends BaseComponent{
    constructor() {
        super();    
        
        this.lerp = 0.1
        this.startScaleX = 1
    }
    enable(){
        super.enable()
        this.target = this.gameObject.gameView.baseScale.x;
    }
    update(delta){     
        
        if(this.gameObject.physics.velocity.x > 0.01){            
            this.target = -this.gameObject.gameView.baseScale.x * this.startScaleX;
        }else if(this.gameObject.physics.velocity.x < -0.01){
            this.target = this.gameObject.gameView.baseScale.x * this.startScaleX;
        }
        this.gameObject.gameView.view.scale.x = Utils.lerp(this.gameObject.gameView.view.scale.x, this.target,this.lerp)
    }
}