import BaseComponent from '../core/gameObject/BaseComponent';
import EffectsManager from '../manager/EffectsManager';
import EntityBuilder from '../screen/EntityBuilder';
import GameObject from '../core/gameObject/GameObject';
import GameStaticData from '../data/GameStaticData';
import GameView from '../core/view/GameView';
import ParticleDescriptor from './particleSystem/ParticleDescriptor';
import RenderModule from '../core/modules/RenderModule';
import SpriteSheetAnimation from './utils/SpriteSheetAnimation';
import SpriteSheetGameView from './SpriteSheetGameView';
import Utils from '../core/utils/Utils';
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

        this.level = 0;

        this.spritesheetAnimation = new SpriteSheetAnimation();
    }

    start() {
        this.renderModule = this.engine.findByType(RenderModule)
    }
    restart() {
        this.actionTime = this.statModifierData.timeActive;
        this.interval = this.statModifierData.interval;
    }
    build(data) {
        this.statModifierData = data;
        this.activeDescriptor = this.statModifierData.descriptor

        if (this.spriteSheet) {
            this.spriteSheet.destroy();
        }

        this.effectOnHit = null

        if (!this.activeDescriptor) {

            let dataVfx = this.statModifierData.vfx || this.statModifierData.vfxAlt;

            if (dataVfx) {
                this.mainDescriptor = GameStaticData.instance.getDescriptor(dataVfx);
                
                if(this.statModifierData.vfxAlt){

                    console.log(GameStaticData.instance.getDataById('vfx', 'entityVfxPack',dataVfx))
                }else{

                    console.log(GameStaticData.instance.getDataById('vfx', 'weaponVFX',dataVfx))

                    this.setData(GameStaticData.instance.getDataById('vfx', 'weaponVFX',dataVfx))
                }
                if (!this.statModifierData.vfxSpawnOnAction) {
                    this.spawnVfx();
                }
            }

        } else {
            this.gameView.view.visible = false;
        }
        this.gameView.view.width = this.parent.rigidBody.circleRadius * 2
        this.gameView.view.height = this.parent.rigidBody.circleRadius * 2

        this.actionTime = this.statModifierData.timeActive;
        this.interval = this.statModifierData.interval;
        this.currentTimer = this.interval / 2;

        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnGetHit) {
            this.parent.health.gotDamaged.add(this.gotDamaged.bind(this))
        }

    }

    setData(data) {
        this.view = this.gameObject.gameView.view;
        
        this.spritesheetAnimation.reset();
        console.log(data)
console.log("MOVING WEAPON IS ALSO BROKEN")
        this.spritesheetAnimation.addLayer(key, data.spriteName, data);                
        // for (const key in data) {
        //     if (Object.hasOwnProperty.call(data, key)) {
        //         const element = data[key];
        //     }
        // }
        this.view.texture = PIXI.Texture.from(this.spritesheetAnimation.currentFrame)
    }

    spawnVfx() {
        console.log(this.mainDescriptor.baseBehaviours[0].params.spriteName)

        // if (this.spriteSheet) {
        //     this.spriteSheet.restart();
        //     return;
        // }
        // this.spriteSheet = this.gameObject.addComponent(SpriteSheetGameView);
        // this.spriteSheet.setDescriptor(this.mainDescriptor, { anchor: { x: 0.5, y: 1 } })
        
        this.gameView.view.anchor.set(0.5, 1)
        this.gameView.view.visible = false;
        this.gameView.view.texture = PIXI.Texture.from(this.mainDescriptor.baseBehaviours[0].params.spriteName + 1);

    }
    weaponHitted(target) {
        if (Math.random() > this.statModifierData.chance) {
            //return;
        }
        if (this.statModifierData.actionType == StatsModifier.StatActionType.OnHitEnemy) {
            if (target && !target.isDead) {
                target.addStatsModifier(this.effectOnHit.id, this.level)
            }
            this.applyEffect();
        }
    }
    gotDamaged() {
        this.applyEffect();
    }
    applyEffect() {

        if (this.statModifierData.type == StatsModifier.ModifierType.Health) {
            let value = Utils.findValueByLevel(this.statModifierData.value, this.level);
            if (this.statModifierData.isRelative) {
                value = Math.ceil(this.parent.health.maxHealth * value);
            }
            if (value < 0) {
                if (!this.parent.health.canHeal) {
                    return;
                }
                this.parent.heal(-value, this.statModifierData.customFont);
            } else  if (value > 0) {
                this.parent.damage(value, this.statModifierData.customFont);
            }

        }

        if (this.statModifierData.vfxSpawnOnAction) {
            this.spawnVfx();
        }
    }

   
    // update(delta) {
    //     if(!this.spriteSheet){
    //         return;
    //     }
    //     this.spriteSheet.update(delta);
    //     if(this.spriteSheet.currentFrame){
    //         this.view.texture = PIXI.Texture.from(this.spriteSheet.currentFrame)
    //         this.view.anchor = this.spriteSheet.anchor;
    //     }

    //     if (this.gameObject.physics.magnitude > 0) {
    //         this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Running)
    //     } else {
    //         this.spriteSheet.play(GameViewSpriteSheet.AnimationType.Idle)
    //     }

    // }

    update(delta) {
        super.update(delta);

        this.currentTimer -= delta;
        this.actionTime -= delta;

        this.x = this.parent.transform.position.x
        this.z = this.parent.transform.position.z + 1

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

        this.gameView.view.visible = true;
    }
    destroy() {
        super.destroy();
        if (this.spriteSheet) {
            this.gameObject.removeComponent(this.spriteSheet);
            this.spriteSheet = null;
        }
        this.gameView.view.visible = false;
    }
}