import AuraProjectile from "../components/weapon/AuraProjectile";
import BaseWeapon from "../components/weapon/BaseWeapon";
import Bullet from "../components/weapon/bullets/Bullet";
import EffectsManager from "../manager/EffectsManager";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
import GameStaticData from "../data/GameStaticData";
import GravityBullet from "../components/weapon/bullets/GravityBullet";
import InGameWeapon from "../data/InGameWeapon";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";

export default class WeaponBuilder {
    static BulletsAvailable = {
        Bullet: Bullet,
        GravityBullet: GravityBullet
    }
    static WeaponsAvailable = {
        BaseWeapon: BaseWeapon,
        AuraProjectile: AuraProjectile,
        FloatingProjectile: FloatingProjectile
    }
    constructor() {

        let vfxPackData = GameStaticData.instance.getAllDataFrom('vfx', 'weaponVFXPack');
        this.weaponVFXPackData = {};
        vfxPackData.forEach(element => {
            if (this.weaponVFXPackData[element.id]) {

            } else {
                this.weaponVFXPackData[element.id] = this.makeSpriteSheetPack(element)
            }
        });


        let weapons = GameStaticData.instance.getAllDataFrom('weapons', 'main');


        this.weaponsData = {};
        weapons.forEach(element => {
            if (this.weaponsData[element.id]) {

            } else {
                this.weaponsData[element.id] = this.makeWeapon(element)
            }
        });

        for (const key in this.weaponsData) {
            this.findDestroyWeapon(this.weaponsData[key])
        }
        //console.log('<<<>>>', this.weaponsData)

        // this.damageAura = new WeaponData('Aura');
        // this.damageAura.weaponType = WeaponData.WeaponType.Magic;
        // this.damageAura.weaponAttributes.baseLifeRangeSpan = -1
        // this.damageAura.weaponAttributes.baseLifeSpan = 3
        // this.damageAura.weaponAttributes.baseRadius = 80
        // this.damageAura.weaponAttributes.baseBulletSpeed = 0
        // this.damageAura.weaponAttributes.baseFrequency = 3
        // this.damageAura.weaponAttributes.basePiercing = 99999
        // this.damageAura.weaponAttributes.basePower = 25
        // this.damageAura.weaponAttributes.baseDamageOverTime = 0.5
        // this.damageAura.weaponAttributes.baseForceField = false
        // this.damageAura.weaponAttributes.baseForceFeedback = 0

        // this.damageAura.weaponAttributes.makeOverrider()
        // this.damageAura.weaponAttributes.overrider.baseRadius = 50
        // this.damageAura.weaponAttributes.overrider.baseLifeSpan = 2

        // //this.damageAura.weaponViewData.addDestroyVfx(endAuraVfxPack);

        // this.damageAura.weaponViewData.addStandardVfx(this.getVFXPack('AURA_PACK_01'));

        // //this.damageAura.weaponViewData.addSpawnVfx(bombVfxPack, EffectsManager.TargetLayer.Botom);

        // //doesnt work on spritesheets
        // this.damageAura.weaponViewData.baseViewData.alpha = 0.1
        // this.damageAura.weaponViewData.baseViewData.rotationSpeed = 0.5
        // this.damageAura.weaponViewData.baseViewData.offset.y = 0
        // this.damageAura.weaponViewData.baseViewData.targetLayer = EffectsManager.TargetLayer.BaseLayer
        // this.damageAura.icon = 'vfx-b1'
        // this.damageAura.customConstructor = AuraProjectile

        // // this.damageAura.weaponViewData.baseViewData.viewData = 'hit-d3'
        // // this.damageAura.weaponViewData.baseViewData.scale = 1




        // this.smallBomb = new WeaponData('Bomb');
        // this.smallBomb.weaponAttributes.baseLifeRangeSpan = -1
        // this.smallBomb.weaponAttributes.baseLifeSpan = 0.5
        // this.smallBomb.weaponAttributes.baseRadius = 100
        // this.smallBomb.weaponAttributes.baseBulletSpeed = 0
        // this.smallBomb.weaponAttributes.baseFrequency = 3

        // this.smallBomb.weaponAttributes.makeOverrider()

        // this.smallBomb.weaponAttributes.overrider.baseRadius = 50
        // this.smallBomb.weaponViewData.addSpawnVfx(this.getVFXPack('BOMB_PACK_01'));
        // this.smallBomb.weaponViewData.baseViewData.alpha = 0
        // this.smallBomb.weaponViewData.baseViewData.offset.y = -20
        // this.smallBomb.icon = 'hit-d3'


        // this.bombThrow = new WeaponData('BombThrow');
        // this.bombThrow.bulletComponent = GravityBullet;
        // this.bombThrow.weaponAttributes.baseLifeRangeSpan = 150
        // this.bombThrow.weaponAttributes.baseLifeSpan = -1
        // this.bombThrow.weaponAttributes.baseRadius = 30
        // this.bombThrow.weaponAttributes.baseBulletSpeed = 120
        // this.bombThrow.weaponAttributes.baseFrequency = 2
        // this.bombThrow.weaponAttributes.baseAngleNoise = Math.PI / 4;
        // this.bombThrow.addFixedDestroyedWeapon(this.smallBomb)

        // this.bombThrow.weaponAttributes.makeOverrider()

        // this.bombThrow.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'))
        // this.bombThrow.weaponViewData.baseViewData.viewData = 'vfx-c1'
        // this.bombThrow.weaponViewData.baseViewData.alpha = 1
        // this.bombThrow.weaponViewData.baseViewData.scale = 0.25
        // this.bombThrow.weaponViewData.baseViewData.rotationSpeed = 15
        // this.bombThrow.weaponViewData.baseViewData.maxHeight = 150
        // this.bombThrow.icon = 'hit-d3'





        // this.facingMelee = new WeaponData('Melee',);
        // this.facingMelee.weaponAttributes.baseLifeRangeSpan = 70
        // this.facingMelee.weaponAttributes.baseLifeSpan = 0
        // this.facingMelee.weaponAttributes.baseRadius = 50
        // this.facingMelee.weaponAttributes.baseBulletSpeed = 150
        // this.facingMelee.weaponAttributes.baseFrequency = 2
        // this.facingMelee.weaponAttributes.basePower = 200

        // this.facingMelee.weaponAttributes.makeOverrider()


        // this.facingMelee.weaponViewData.addSpawnVfx(this.getVFXPack('MELEE_SWORD_SHOCK_PACK_01'));
        // this.facingMelee.weaponViewData.baseViewData.alpha = 0
        // this.facingMelee.weaponViewData.baseViewData.offset.y = -20
        // this.facingMelee.icon = 'slash4'




        // this.daggerThrow = new WeaponData('Dagger Throw');
        // this.daggerThrow.weaponAttributes.baseLifeRangeSpan = 250
        // this.daggerThrow.weaponAttributes.baseLifeSpan = 0
        // this.daggerThrow.weaponAttributes.baseRadius = 15
        // this.daggerThrow.weaponAttributes.baseBulletSpeed = 350
        // this.daggerThrow.weaponAttributes.baseFrequency = 3
        // this.daggerThrow.weaponAttributes.baseAngleNoise = 0.5

        // this.daggerThrow.weaponAttributes.baseBrustFire.amount = 3
        // this.daggerThrow.weaponAttributes.baseBrustFire.interval = 0.1

        // this.daggerThrow.weaponAttributes.makeOverrider()


        // this.daggerThrow.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'));
        // this.daggerThrow.weaponViewData.addDestroyVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'));


        // this.daggerThrow.weaponViewData.baseViewData.viewData = 'weapon_sword_1'
        // this.daggerThrow.weaponViewData.baseViewData.alpha = 1
        // this.daggerThrow.weaponViewData.baseViewData.offset.y = -20
        // this.daggerThrow.weaponViewData.baseViewData.rotationSpeed = -15

        // this.daggerThrow.icon = 'weapon_sword_1'


        // this.boomerangThrow = new WeaponData('Boomerang');
        // this.boomerangThrow.weaponAttributes.baseLifeRangeSpan = 250
        // this.boomerangThrow.weaponAttributes.baseLifeSpan = 0
        // this.boomerangThrow.weaponAttributes.baseRadius = 15
        // this.boomerangThrow.weaponAttributes.baseBulletSpeed = 200
        // this.boomerangThrow.weaponAttributes.baseFrequency = 2
        // this.boomerangThrow.weaponAttributes.basePiercing = 8
        // this.boomerangThrow.weaponAttributes.baseExtendedBehaviour = WeaponAttributes.ExtendedBehaviour.Boomerang;
        // this.boomerangThrow.weaponAttributes.makeOverrider()


        // this.boomerangThrow.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'));

        // this.boomerangThrow.weaponViewData.baseViewData.viewData = 'tile_0118'
        // this.boomerangThrow.weaponViewData.baseViewData.alpha = 1
        // this.boomerangThrow.weaponViewData.baseViewData.scale = 1
        // this.boomerangThrow.weaponViewData.baseViewData.rotationSpeed = 15
        // this.boomerangThrow.weaponViewData.baseViewData.offset.y = 0//-20
        // this.boomerangThrow.icon = 'tile_0118'


        // this.floatingOrbit = new WeaponData('Orbit');
        // this.floatingOrbit.weaponType = WeaponData.WeaponType.Magic;

        // this.floatingOrbit.weaponAttributes.baseLifeSpan = 3
        // this.floatingOrbit.weaponAttributes.baseLifeRangeSpan = -1
        // this.floatingOrbit.weaponAttributes.baseAmount = 5
        // this.floatingOrbit.weaponAttributes.baseFrequency = 5
        // this.floatingOrbit.weaponAttributes.baseBulletSpeed = Math.PI
        // this.floatingOrbit.weaponAttributes.baseRadius = 30
        // this.floatingOrbit.weaponAttributes.baseDamageZone = 80
        // this.floatingOrbit.weaponAttributes.baseForceField = true
        // this.floatingOrbit.weaponAttributes.makeOverrider()


        // this.floatingOrbit.weaponViewData.addStandardVfx(this.getVFXPack('THUNDER_BALL_PACK_01'));
        // this.floatingOrbit.weaponViewData.addSpawnVfx(this.getVFXPack('BOMB_PACK_01'));
        // this.floatingOrbit.weaponViewData.addDestroyVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'));

        // this.floatingOrbit.weaponAttributes.overrider.baseAmount = 1

        // this.floatingOrbit.weaponViewData.baseViewData.rotationSpeed = -2
        // this.floatingOrbit.icon = 'small-spark4'

        // this.floatingOrbit.customConstructor = FloatingProjectile



        // this.hoaming = new WeaponData('Hoaming');
        // this.hoaming.weaponType = WeaponData.WeaponType.Magic;

        // this.hoaming.weaponAttributes.baseLifeRangeSpan = 400
        // this.hoaming.weaponAttributes.baseAmount = 1
        // this.hoaming.weaponAttributes.baseFrequency = 5
        // this.hoaming.weaponAttributes.baseRadius = 15
        // this.hoaming.weaponAttributes.baseBulletSpeed = 100
        // this.hoaming.weaponAttributes.basePiercing = 1
        // this.hoaming.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.Hoaming
        // this.hoaming.weaponAttributes.makeOverrider()

        // this.hoaming.weaponViewData.addStandardVfx(this.getVFXPack('HOAMING_FIREBALL_PACK'));

        // this.hoaming.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_02'));
        // this.hoaming.weaponViewData.addDestroyVfx(this.getVFXPack('SPAWN_IMPACT_PACK_02'));


        // this.hoaming.weaponViewData.baseViewData.offset.y = -20
        // this.hoaming.weaponViewData.baseViewData.angleOffset = -Math.PI / 2
        // this.hoaming.icon = 'fire-missile1'




        // this.multishot = new WeaponData('Multishot');
        // this.multishot.icon = 'tile_0131'

        // this.multishot.weaponAttributes.baseLifeRangeSpan = 150
        // this.multishot.weaponAttributes.baseAmount = 4
        // this.multishot.weaponAttributes.basePower = 10
        // this.multishot.weaponAttributes.basePiercing = 0
        // this.multishot.weaponAttributes.baseFrequency = 3
        // this.multishot.weaponAttributes.baseAngleOffset = 0.4
        // this.multishot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ParentAngle
        // this.multishot.weaponAttributes.makeOverrider()

        // this.multishot.weaponViewData.baseViewData.viewData = 'tile_0131'
        // this.multishot.weaponViewData.baseViewData.scale = 1
        // this.multishot.weaponViewData.baseViewData.offset.y = -20
        // this.multishot.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'))
        // this.multishot.weaponAttributes.overrider.baseAmount = 2



        // this.preciseShot = new WeaponData('PreciseShot');
        // this.preciseShot.icon = 'tile_0131'

        // this.preciseShot.weaponAttributes.baseLifeRangeSpan = 800
        // this.preciseShot.weaponAttributes.baseAmount = 1
        // this.preciseShot.weaponAttributes.basePower = 80
        // this.preciseShot.weaponAttributes.basePiercing = 1
        // this.preciseShot.weaponAttributes.baseFrequency = 0.5
        // this.preciseShot.weaponAttributes.baseBulletSpeed = 400
        // this.preciseShot.weaponAttributes.baseAngleOffset = 0.4
        // this.preciseShot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ClosestEnemy
        // this.preciseShot.weaponAttributes.makeOverrider()

        // this.preciseShot.weaponViewData.baseViewData.viewData = 'tile_0131'
        // this.preciseShot.weaponViewData.baseViewData.scale = 1
        // this.preciseShot.weaponViewData.baseViewData.offset.y = -20
        // this.preciseShot.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_01'))
        // // this.preciseShot.weaponAttributes.overrider.baseAmount = 2




        // this.uniformTimeSpread = new WeaponData('Spread');
        // this.uniformTimeSpread.weaponType = WeaponData.WeaponType.Magic;

        // this.uniformTimeSpread.weaponAttributes.baseLifeRangeSpan = 200
        // this.uniformTimeSpread.weaponAttributes.baseAmount = 1
        // this.uniformTimeSpread.weaponAttributes.basePower = 10
        // this.uniformTimeSpread.weaponAttributes.basePiercing = 0
        // this.uniformTimeSpread.weaponAttributes.baseFrequency = 1
        // this.uniformTimeSpread.weaponAttributes.baseAngleOffset = Math.PI / 4
        // this.uniformTimeSpread.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.AngularSequence
        // this.uniformTimeSpread.weaponAttributes.makeOverrider()


        // this.uniformTimeSpread.weaponViewData.addStandardVfx(this.getVFXPack('WATER_BALL_PACK'))
        // this.uniformTimeSpread.weaponViewData.addSpawnVfx(this.getVFXPack('SPAWN_IMPACT_PACK_02'))
        // this.uniformTimeSpread.weaponViewData.addDestroyVfx(this.getVFXPack('SPAWN_IMPACT_PACK_02'))

        // this.uniformTimeSpread.weaponViewData.baseViewData.offset.y = -20

        // this.uniformTimeSpread.icon = 'vfx-c1'


    }
    findDestroyWeapon(weapon){

        console.log("RAW", weapon)
        if(weapon.onDestroyId){
            weapon.addFixedDestroyedWeapon(this.weaponsData[weapon.onDestroyId])
        }
    }
    makeWeapon(weaponData) {
        let weapon = new WeaponData(weaponData.name);
        console.log("weaponData", weaponData)


        for (const key in weaponData) {
            if (Object.hasOwnProperty.call(weapon, key)) {
                weapon[key] = weaponData[key];

            }
        }

        let att = weaponData.attributes;
        let overrider = weaponData.overrider;

        for (const key in att) {
            if (Object.hasOwnProperty.call(weapon.weaponAttributes, key)) {
                weapon.weaponAttributes[key] = att[key];

            }
        }

        if (weaponData.view) {
            for (const key in weaponData.view) {
                if (Object.hasOwnProperty.call(weapon.weaponViewData, key)) {
                    weapon.weaponViewData[key] = weaponData.view[key];
                }
            }

            if (weaponData.view.overrider) {


                for (const key in weaponData.view.overrider) {
                    if (weapon.weaponViewData[key] && weaponData.view.overrider[key]) {
                        let targetOverrider = GameStaticData.instance.getDataById('weapons', 'viewOverriders', weaponData.view.overrider[key])
                        if (targetOverrider) {
                            for (const overriderKey in targetOverrider) {
                                if (weapon.weaponViewData[key][overriderKey] !== undefined) {
                                    if (overriderKey == 'offset') {
                                        weapon.weaponViewData[key][overriderKey].x = targetOverrider[overriderKey].x || 0;
                                        weapon.weaponViewData[key][overriderKey].y = targetOverrider[overriderKey].y || 0;
                                        weapon.weaponViewData[key][overriderKey].z = targetOverrider[overriderKey].z || 0;
                                    } else {
                                        weapon.weaponViewData[key][overriderKey] = targetOverrider[overriderKey]
                                    }

                                }
                            }
                        }
                    }

                }
            }
            if (weaponData.view['standardVfxPack']) {
                weapon.weaponViewData.addStandardVfx(this.getVFXPack(weaponData.view['standardVfxPack']));
            }
            if (weaponData.view['spawnVfxPack']) {
                weapon.weaponViewData.addSpawnVfx(this.getVFXPack(weaponData.view['spawnVfxPack']));
            }
            if (weaponData.view['destroyVfxPack']) {
                weapon.weaponViewData.addDestroyVfx(this.getVFXPack(weaponData.view['destroyVfxPack']));
            }
        }
        if (weaponData.customConstructor) {
            weapon.customConstructor = WeaponBuilder.WeaponsAvailable[weaponData.customConstructor]
        } else {
            weapon.customConstructor = WeaponBuilder.WeaponsAvailable.BaseWeapon;
        }
        if (weaponData.bulletComponent) {
            weapon.bulletComponent = WeaponBuilder.BulletsAvailable[weaponData.bulletComponent]
        } else {
            weapon.bulletComponent = WeaponBuilder.BulletsAvailable.Bullet;
        }

        weapon.weaponAttributes.makeOverrider()

        if (overrider) {            
            let targetOverrider = GameStaticData.instance.getDataById('weapons', 'main', overrider)            
            for (const key in targetOverrider.attributes) {
                if (Object.hasOwnProperty.call(weapon.weaponAttributes.overrider, key)) {
                    weapon.weaponAttributes.overrider[key] = targetOverrider.attributes[key];
                    
                }
            }
        }
        
        return weapon
    }
    getVFXPack(vfxPackID) {
        if (!this.weaponVFXPackData[vfxPackID]) {
            console.error("the pack ", vfxPackID, "is not registerd");
        }
        return this.weaponVFXPackData[vfxPackID]
    }
    makeSpriteSheetPack(vfxPackData) {
        let vfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: vfxPackData.offset,
            scale: vfxPackData.scale,
            targetLayer: vfxPackData.targetLayer
        }
        let spriteSheetParams = GameStaticData.instance.getDataById('vfx', 'weaponVFX', vfxPackData.vfxData)
        if (!spriteSheetParams) {
            console.error('coudn\'t find VFX for', vfxPackData.vfxData);
        }
        vfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, spriteSheetParams)
        return vfxPack;
    }
    addWeapons(player) {

        this.physical = [
            // this.bombThrow,
            // this.facingMelee,
            // this.daggerThrow,
            // this.boomerangThrow,
            // this.multishot
        ]

        this.magical = [
            // this.hoaming,
            // // this.damageAura,
            // this.floatingOrbit,
            // this.uniformTimeSpread

        ]
        let testWeapon = new InGameWeapon();

        // Utils.shuffle(this.physical)
        // Utils.shuffle(this.magical)
        //testWeapon.addWeapon(this.floatingOrbit)
        //testWeapon.addWeapon(this.uniformTimeSpread)
        //testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.hoaming)
        // testWeapon.addWeapon(this.bombThrow)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.hoaming)
        //testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.smallBomb)
        //testWeapon.addWeapon(this.damageAura)
        //testWeapon.addWeapon(this.daggerThrow)
        // testWeapon.addWeapon(this.damageAura)
        //testWeapon.addWeapon(this.damageAura)
        //testWeapon.addWeapon(this.weaponsData['PLAYER_AURA'])
        testWeapon.addWeapon(this.weaponsData['PLAYER_MULTISHOT'])
        testWeapon.addWeapon(this.weaponsData['BOMB_THROWER'])
        testWeapon.addWeapon(this.weaponsData['PLAYER_AURA'])



        //testWeapon.addWeapon(this.weaponsData['PLAYER_AURA'])

        for (let i = 0; i < 3; i++) {
            //testWeapon.addWeapon(this.physical[i])
        }
        // //Utils.shuffle(a)
        // let testWeapon2 = new InGameWeapon();
        // for (let i = 0; i < 3; i++) {
        //     testWeapon2.addWeapon(this.magical[i])
        // }
        //testWeapon2.addWeapon(this.damageAura)


        // testWeapon.addWeapon(this.alternateMelee)
        //  testWeapon.addWeapon(this.uniformTimeSpread)
        // testWeapon.addWeapon(this.smallBomb)
        //testWeapon.addWeapon(this.hoaming)
        // testWeapon.addWeapon(this.uniformTimeSpread)
        // testWeapon.addWeapon(this.boomerangThrow)
        //testWeapon.addWeapon(this.daggerThrow)
        // testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.smallBomb)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.smallBomb)

        // player.addWeapon(this.multishot)
        // player.addWeapon(this.alternateMelee)
        // player.addWeapon(this.hoaming)

        player.addWeapon(testWeapon)


       // player.addWeapon(testWeapon2)

    }
}