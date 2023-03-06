import BaseComponent from '../core/gameObject/BaseComponent';
import EffectsManager from '../manager/EffectsManager';
import EntityBuilder from '../screen/EntityBuilder';
import GameObject from '../core/gameObject/GameObject';
import GameStaticData from '../data/GameStaticData';
import GameView from '../core/view/GameView';
import ParticleDescriptor from './particleSystem/ParticleDescriptor';
import RenderModule from '../core/modules/RenderModule';
import SpriteSheetGameView from './SpriteSheetGameView';
import signals from 'signals';

export default class StatsModifier extends GameObject {
    static StatActionType = {
        OnShoot: 'OnShoot',
        OnGetHit: 'OnGetHit',
        OverTime: 'OverTime',
        OnHitEnemy: 'OnHitEnemy',
    }
    static ModifierType = {
        Health: 'Health'
    }
    constructor() {
        super();

        this.gameView = new GameView(this)
        this.gameView.view = new PIXI.Sprite()
        this.viewOffset = { x: 0, y: 0 }

        this.isOverTime = true;
        this.actionTime = 5;
        this.interval = 3;
        this.currentTimer = 3;

        this.effectOnHit = null
    }

    start() {
        this.renderModule = this.engine.findByType(RenderModule)
    }
    build(data) {
        this.statModifierData = data;
        this.activeDescriptor = this.statModifierData.descriptor

        this.effectOnHit = null


        if (!this.activeDescriptor) {

            let dataVfx = this.statModifierData.vfx || this.statModifierData.vfxAlt;
            let spriteSheet = this.gameObject.addComponent(SpriteSheetGameView);
            let descriptor = GameStaticData.instance.getDescriptor(dataVfx);

            spriteSheet.setDescriptor(descriptor, { anchor: { x: 0.5, y: 0.5 } })
        }

        this.gameView.view.width = 50
        this.gameView.view.height = 50

        this.actionTime = this.statModifierData.timeActive;
        this.interval = this.statModifierData.interval;
        this.currentTimer = this.interval / 2;


        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnGetHit) {
            this.parent.health.gotDamaged.add(this.gotDamaged.bind(this))
        }

    }
    weaponHitted(target){
        console.log(this.statModifierData.actionType)
        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnHitEnemy) {
            if(target && !target.isDead){
                target.addStatsModifier(this.effectOnHit.id)
            }
            this.applyEffect();
        }
    }
    gotDamaged() {
        this.applyEffect();
    }
    applyEffect() {

        if (this.statModifierData.type == StatsModifier.ModifierType.Health) {
            if (this.statModifierData.value < 0) {
                if (!this.parent.health.canHeal) {
                    return;
                }
                this.parent.heal(-this.statModifierData.value);
            } else {
                this.parent.damage(this.statModifierData.value);
            }

        }
        if (this.activeDescriptor) {
            EffectsManager.instance.emitByIdInRadius(this.transform.position, 15, this.statModifierData.descriptor, 0)
        }
    }
    update(delta) {
        super.update(delta);


        this.currentTimer -= delta;
        this.actionTime -= delta;

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z

        if (this.parent.isDestroyed || this.actionTime <= 0) {
            this.destroy();
            return;
        }

        if (this.statModifierData.actionType != StatsModifier.StatActionType.OverTime) {
            return;
        }

        if (this.currentTimer <= 0) {
            this.currentTimer = this.interval;

            this.applyEffect();

            if (!this.isOverTime) {
                this.destroy();
            }
        }
    }
}