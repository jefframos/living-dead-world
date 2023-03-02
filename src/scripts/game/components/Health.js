import BaseComponent from '../core/gameObject/BaseComponent';
import signals from 'signals';

export default class Health extends BaseComponent {
    constructor() {
        super();
        this.currentHealth = 100;
        this.standrdHealth = 100;

        this.gotDamaged = new signals.Signal();
        this.gotKilled = new signals.Signal();
        this.gotKilledParticles = new signals.Signal();
    }
    get isDead() { return this.currentHealth <= 0 }
    get normal() { return Math.max(0, this.currentHealth / this.standrdHealth) }
    reset() {
        this.currentHealth = this.standrdHealth;
    }
    setNewHealth(value) {
        this.standrdHealth = value;
        this.currentHealth = this.standrdHealth;

    }
    updateMaxHealth(value){
        this.standrdHealth = value;
    }
    damage(value) {
        if (this.currentHealth <= 0) {
            return true;
        }

        this.gotDamaged.dispatch(this, value);
        this.currentHealth -= value;
        if (this.currentHealth <= 0) {
            if (this.gameObject.isPlayer) {
                console.log('KILL PLAYER')
            }
            this.gotKilled.dispatch(this);
            this.gotKilledParticles.dispatch(this);
        }

        return this.currentHealth <= 0;
    }
}