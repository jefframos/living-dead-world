import BaseComponent from '../core/gameObject/BaseComponent';
import signals from 'signals';

export default class StatsModifier extends BaseComponent {
    constructor() {
        super();

        this.isOverTime = true;
        this.actionTime = 9999999999;
        this.timeActive = 3;
        this.currentTimer = 3;
    }

    reset() {
    
    }
    update(delta) {
        super.update(delta);

        
        this.currentTimer -= delta;        
        this.actionTime -= delta;
        
        
        
        if(this.actionTime <= 0){
            this.remove();
            return;
        }
        
        if(!this.gameObject.health.canHeal){
            return;
        }
        if(this.currentTimer <= 0){
            this.currentTimer = 0.5;
            this.gameObject.heal(1);

            if(!this.isOverTime){
                this.remove();
            }
        }
    }
}