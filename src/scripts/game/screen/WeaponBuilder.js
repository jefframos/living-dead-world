import AuraProjectile from "../components/weapon/AuraProjectile";
import EffectsManager from "../manager/EffectsManager";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
import GravityBullet from "../components/weapon/bullets/GravityBullet";
import InGameWeapon from "../data/InGameWeapon";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";

export default class WeaponBuilder {
    constructor() {


        let bombVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }
        bombVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.5,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-d',
            addZero: false,
            lifeSpan: 9999
        })


        let auraVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }
        auraVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 3,
            frameTime: 3 / 12,
            startFrame: 1,
            endFrame: 6,
            spriteName: 'vfx-b',
            addZero: false,
            lifeSpan: 9999
        })

        let endAuraVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }
        endAuraVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.5,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'vfx-b',
            addZero: false,
            lifeSpan: 9999
        })

        let meleeShockVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(10, 0, -30),
            scale: 1
        }
        meleeShockVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.75,
            startFrame: 1,
            endFrame: 12,
            spriteName: 'slash',
            addZero: false,
            lifeSpan: 9999,
            anchor: { x: 0.2, y: 0.35 }
        })

        let impactShootSpawnVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }

        impactShootSpawnVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.2,
            startFrame: 1,
            endFrame: 6,
            spriteName: 'hit-l',
            addZero: false,
            lifeSpan: 9999
        })
        let impactShootSpawnVfxPack2 = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }

        impactShootSpawnVfxPack2.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-j',
            addZero: false,
            lifeSpan: 9999
        })



        let thunderBallVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }

        thunderBallVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 9999,
            frameTime: 0.5,
            startFrame: 1,
            endFrame: 12,
            spriteName: 'small-spark',
            addZero: false,
            lifeSpan: 9999,
            loop: true,
        })


        let hoamingVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }

        hoamingVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 9999,
            frameTime: 0.5,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'fire-missile',
            addZero: false,
            lifeSpan: 9999,
            loop: true,
        })
        let spreadMagicVfx = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(0, 0, 0),
            scale: 1
        }

        spreadMagicVfx.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 9999,
            frameTime: 0.5,
            startFrame: 1,
            endFrame: 6,
            spriteName: 'vfx-c',
            addZero: false,
            lifeSpan: 9999,
            loop: true,
        })

        this.damageAura = new WeaponData('Aura');
        this.damageAura.weaponType = WeaponData.WeaponType.Magic;
        this.damageAura.weaponAttributes.baseLifeRangeSpan = -1
        this.damageAura.weaponAttributes.baseLifeSpan = 3
        this.damageAura.weaponAttributes.baseRadius = 80
        this.damageAura.weaponAttributes.baseBulletSpeed = 0
        this.damageAura.weaponAttributes.baseFrequency = 3
        this.damageAura.weaponAttributes.basePiercing = 99999
        this.damageAura.weaponAttributes.basePower = 25
        this.damageAura.weaponAttributes.baseDamageOverTime = 0.5
        this.damageAura.weaponAttributes.baseForceField = false
        this.damageAura.weaponAttributes.baseForceFeedback = 0

        this.damageAura.weaponAttributes.makeOverrider()
        this.damageAura.weaponAttributes.overrider.baseRadius = 50
        this.damageAura.weaponAttributes.overrider.baseLifeSpan = 2

        //this.damageAura.weaponViewData.addDestroyVfx(endAuraVfxPack);
        this.damageAura.weaponViewData.addStandardVfx(auraVfxPack);

        //this.damageAura.weaponViewData.addSpawnVfx(bombVfxPack, EffectsManager.TargetLayer.Botom);

        //doesnt work on spritesheets
        this.damageAura.weaponViewData.baseViewData.alpha = 0.1
        this.damageAura.weaponViewData.baseViewData.rotationSpeed = 0.5
        this.damageAura.weaponViewData.baseViewData.offset.y = 0
        this.damageAura.icon = 'vfx-b1'
        this.damageAura.customConstructor = AuraProjectile

        // this.damageAura.weaponViewData.baseViewData.viewData = 'hit-d3'
        // this.damageAura.weaponViewData.baseViewData.scale = 1
        this.damageAura.weaponViewData.baseViewData.targetLayer = EffectsManager.TargetLayer.Botom




        this.smallBomb = new WeaponData('Bomb');
        this.smallBomb.weaponAttributes.baseLifeRangeSpan = -1
        this.smallBomb.weaponAttributes.baseLifeSpan = 0.5
        this.smallBomb.weaponAttributes.baseRadius = 100
        this.smallBomb.weaponAttributes.baseBulletSpeed = 0
        this.smallBomb.weaponAttributes.baseFrequency = 3

        this.smallBomb.weaponAttributes.makeOverrider()

        this.smallBomb.weaponAttributes.overrider.baseRadius = 50
        this.smallBomb.weaponViewData.addSpawnVfx(bombVfxPack, EffectsManager.TargetLayer.Botom);
        this.smallBomb.weaponViewData.baseViewData.alpha = 0
        this.smallBomb.weaponViewData.baseViewData.offset.y = -20
        this.smallBomb.icon = 'hit-d3'


        this.bombThrow = new WeaponData('BombThrow');
        this.bombThrow.bulletComponent = GravityBullet;
        this.bombThrow.weaponAttributes.baseLifeRangeSpan = 150
        this.bombThrow.weaponAttributes.baseLifeSpan = -1
        this.bombThrow.weaponAttributes.baseRadius = 30
        this.bombThrow.weaponAttributes.baseBulletSpeed = 120
        this.bombThrow.weaponAttributes.baseFrequency = 2
        this.bombThrow.weaponAttributes.baseAngleNoise = Math.PI / 4;
        this.bombThrow.addFixedDestroyedWeapon(this.smallBomb)

        this.bombThrow.weaponAttributes.makeOverrider()

        this.bombThrow.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack)
        this.bombThrow.weaponViewData.baseViewData.viewData = 'vfx-c1'
        this.bombThrow.weaponViewData.baseViewData.alpha = 1
        this.bombThrow.weaponViewData.baseViewData.scale = 0.25
        this.bombThrow.weaponViewData.baseViewData.rotationSpeed = 15
        this.bombThrow.weaponViewData.baseViewData.maxHeight = 150
        this.bombThrow.icon = 'hit-d3'





        this.facingMelee = new WeaponData('Melee',);
        this.facingMelee.weaponAttributes.baseLifeRangeSpan = 70
        this.facingMelee.weaponAttributes.baseLifeSpan = 0
        this.facingMelee.weaponAttributes.baseRadius = 50
        this.facingMelee.weaponAttributes.baseBulletSpeed = 150
        this.facingMelee.weaponAttributes.baseFrequency = 2
        this.facingMelee.weaponAttributes.basePower = 200

        this.facingMelee.weaponAttributes.makeOverrider()


        this.facingMelee.weaponViewData.addSpawnVfx(meleeShockVfxPack);
        this.facingMelee.weaponViewData.baseViewData.alpha = 0
        this.facingMelee.weaponViewData.baseViewData.offset.y = -20
        this.facingMelee.icon = 'slash4'




        this.daggerThrow = new WeaponData('Dagger Throw');
        this.daggerThrow.weaponAttributes.baseLifeRangeSpan = 250
        this.daggerThrow.weaponAttributes.baseLifeSpan = 0
        this.daggerThrow.weaponAttributes.baseRadius = 15
        this.daggerThrow.weaponAttributes.baseBulletSpeed = 350
        this.daggerThrow.weaponAttributes.baseFrequency = 3
        this.daggerThrow.weaponAttributes.baseAngleNoise = 0.5

        this.daggerThrow.weaponAttributes.baseBrustFire.amount = 3
        this.daggerThrow.weaponAttributes.baseBrustFire.interval = 0.1

        this.daggerThrow.weaponAttributes.makeOverrider()


        this.daggerThrow.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack);
        this.daggerThrow.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack);


        this.daggerThrow.weaponViewData.baseViewData.viewData = 'weapon_sword_1'
        this.daggerThrow.weaponViewData.baseViewData.alpha = 1
        this.daggerThrow.weaponViewData.baseViewData.offset.y = -20
        this.daggerThrow.weaponViewData.baseViewData.rotationSpeed = -15

        this.daggerThrow.icon = 'weapon_sword_1'


        this.boomerangThrow = new WeaponData('Boomerang');
        this.boomerangThrow.weaponAttributes.baseLifeRangeSpan = 250
        this.boomerangThrow.weaponAttributes.baseLifeSpan = 0
        this.boomerangThrow.weaponAttributes.baseRadius = 15
        this.boomerangThrow.weaponAttributes.baseBulletSpeed = 200
        this.boomerangThrow.weaponAttributes.baseFrequency = 2
        this.boomerangThrow.weaponAttributes.basePiercing = 8
        this.boomerangThrow.weaponAttributes.baseExtendedBehaviour = WeaponAttributes.ExtendedBehaviour.Boomerang;
        this.boomerangThrow.weaponAttributes.makeOverrider()


        this.boomerangThrow.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack);

        this.boomerangThrow.weaponViewData.baseViewData.viewData = 'tile_0118'
        this.boomerangThrow.weaponViewData.baseViewData.alpha = 1
        this.boomerangThrow.weaponViewData.baseViewData.scale = 1
        this.boomerangThrow.weaponViewData.baseViewData.rotationSpeed = 15
        this.boomerangThrow.weaponViewData.baseViewData.offset.y = 0//-20
        this.boomerangThrow.icon = 'tile_0118'


        this.floatingOrbit = new WeaponData('Orbit');
        this.floatingOrbit.weaponType = WeaponData.WeaponType.Magic;

        this.floatingOrbit.weaponAttributes.baseLifeSpan = 3
        this.floatingOrbit.weaponAttributes.baseLifeRangeSpan = -1
        this.floatingOrbit.weaponAttributes.baseAmount = 5
        this.floatingOrbit.weaponAttributes.baseFrequency = 5
        this.floatingOrbit.weaponAttributes.baseBulletSpeed = Math.PI
        this.floatingOrbit.weaponAttributes.baseRadius = 30
        this.floatingOrbit.weaponAttributes.baseDamageZone = 80
        this.floatingOrbit.weaponAttributes.baseForceField = true
        this.floatingOrbit.weaponAttributes.makeOverrider()


        this.floatingOrbit.weaponViewData.addStandardVfx(thunderBallVfxPack);
        this.floatingOrbit.weaponViewData.addSpawnVfx(bombVfxPack);
        this.floatingOrbit.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack);

        this.floatingOrbit.weaponAttributes.overrider.baseAmount = 1

        this.floatingOrbit.weaponViewData.baseViewData.rotationSpeed = -2
        this.floatingOrbit.icon = 'small-spark4'

        this.floatingOrbit.customConstructor = FloatingProjectile



        this.hoaming = new WeaponData('Hoaming');
        this.hoaming.weaponType = WeaponData.WeaponType.Magic;

        this.hoaming.weaponAttributes.baseLifeRangeSpan = 400
        this.hoaming.weaponAttributes.baseAmount = 1
        this.hoaming.weaponAttributes.baseFrequency = 5
        this.hoaming.weaponAttributes.baseRadius = 15
        this.hoaming.weaponAttributes.baseBulletSpeed = 100
        this.hoaming.weaponAttributes.basePiercing = 1
        this.hoaming.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.Hoaming
        this.hoaming.weaponAttributes.makeOverrider()

        this.hoaming.weaponViewData.addStandardVfx(hoamingVfxPack);

        this.hoaming.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack2);
        this.hoaming.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack2);


        // this.hoaming.weaponViewData.baseViewData.viewData = 'tile_0107'
        // this.hoaming.weaponViewData.baseViewData.scale = 1
        this.hoaming.weaponViewData.baseViewData.offset.y = -20
        this.hoaming.weaponViewData.baseViewData.angleOffset = -Math.PI / 2
        this.hoaming.icon = 'fire-missile1'




        this.multishot = new WeaponData('Multishot');
        this.multishot.icon = 'tile_0131'

        this.multishot.weaponAttributes.baseLifeRangeSpan = 150
        this.multishot.weaponAttributes.baseAmount = 4
        this.multishot.weaponAttributes.basePower = 10
        this.multishot.weaponAttributes.basePiercing = 0
        this.multishot.weaponAttributes.baseFrequency = 3
        this.multishot.weaponAttributes.baseAngleOffset = 0.4
        this.multishot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ParentAngle
        this.multishot.weaponAttributes.makeOverrider()

        this.multishot.weaponViewData.baseViewData.viewData = 'tile_0131'
        this.multishot.weaponViewData.baseViewData.scale = 1
        this.multishot.weaponViewData.baseViewData.offset.y = -20
        this.multishot.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack)
        this.multishot.weaponAttributes.overrider.baseAmount = 2



        this.preciseShot = new WeaponData('PreciseShot');
        this.preciseShot.icon = 'tile_0131'

        this.preciseShot.weaponAttributes.baseLifeRangeSpan = 800
        this.preciseShot.weaponAttributes.baseAmount = 1
        this.preciseShot.weaponAttributes.basePower = 80
        this.preciseShot.weaponAttributes.basePiercing = 1
        this.preciseShot.weaponAttributes.baseFrequency = 0.5
        this.preciseShot.weaponAttributes.baseBulletSpeed = 400
        this.preciseShot.weaponAttributes.baseAngleOffset = 0.4
        this.preciseShot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ClosestEnemy
        this.preciseShot.weaponAttributes.makeOverrider()

        this.preciseShot.weaponViewData.baseViewData.viewData = 'tile_0131'
        this.preciseShot.weaponViewData.baseViewData.scale = 1
        this.preciseShot.weaponViewData.baseViewData.offset.y = -20
        this.preciseShot.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack)
        // this.preciseShot.weaponAttributes.overrider.baseAmount = 2




        this.uniformTimeSpread = new WeaponData('Spread');
        this.uniformTimeSpread.weaponType = WeaponData.WeaponType.Magic;

        this.uniformTimeSpread.weaponAttributes.baseLifeRangeSpan = 200
        this.uniformTimeSpread.weaponAttributes.baseAmount = 1
        this.uniformTimeSpread.weaponAttributes.basePower = 10
        this.uniformTimeSpread.weaponAttributes.basePiercing = 0
        this.uniformTimeSpread.weaponAttributes.baseFrequency = 1
        this.uniformTimeSpread.weaponAttributes.baseAngleOffset = Math.PI / 4
        this.uniformTimeSpread.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.AngularSequence
        this.uniformTimeSpread.weaponAttributes.makeOverrider()


        this.uniformTimeSpread.weaponViewData.addStandardVfx(spreadMagicVfx)
        this.uniformTimeSpread.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack2)
        this.uniformTimeSpread.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack2)

        this.uniformTimeSpread.weaponViewData.baseViewData.offset.y = -20

        this.uniformTimeSpread.icon = 'vfx-c1'


    }
    addWeapons(player) {

        this.physical = [
            this.bombThrow,
            this.facingMelee,
            this.daggerThrow,
            this.boomerangThrow,
            this.multishot
        ]

        this.magical = [
            this.hoaming,
            // this.damageAura,
            this.floatingOrbit,
            this.uniformTimeSpread

        ]
        let testWeapon = new InGameWeapon();

        Utils.shuffle(this.physical)
        Utils.shuffle(this.magical)
        //testWeapon.addWeapon(this.floatingOrbit)
        //testWeapon.addWeapon(this.uniformTimeSpread)
        //testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.hoaming)
        // testWeapon.addWeapon(this.bombThrow)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.hoaming)
        //testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.smallBomb)
        //testWeapon.addWeapon(this.damageAura)
        //testWeapon.addWeapon(this.daggerThrow)
        // testWeapon.addWeapon(this.damageAura)
        testWeapon.addWeapon(this.preciseShot)

        for (let i = 0; i < 2; i++) {
            testWeapon.addWeapon(this.physical[i])
        }
        // //Utils.shuffle(a)
        let testWeapon2 = new InGameWeapon();
        for (let i = 0; i < 2; i++) {
            testWeapon2.addWeapon(this.magical[i])
        }
        testWeapon2.addWeapon(this.damageAura)


        // testWeapon.addWeapon(this.alternateMelee)
        //  testWeapon.addWeapon(this.uniformTimeSpread)
        // testWeapon.addWeapon(this.smallBomb)
        console.log("CHeck the alternate weapon")
        console.log("CHeck the hoaming to always find an enemy")
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

        console.log(testWeapon)
        player.addWeapon(testWeapon2)

    }
}