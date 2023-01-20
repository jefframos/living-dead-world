import EffectsManager from "../manager/EffectsManager";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
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
            scale: 2
        }
        bombVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.5,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-d',
            addZero: false,
            lifeSpan: 9999
        })

        let meleeShockVfxPack = {
            descriptor: new ParticleDescriptor(),
            offset: new Vector3(10, 0, -20),
            scale: 3
        }
        meleeShockVfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, {
            time: 0.75,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-h',
            addZero: false,
            lifeSpan: 9999,
            anchor: { x: 0, y: 0.5 }
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




        this.smallBomb = new WeaponData('Bomb');
        this.smallBomb.weaponAttributes.baseLifeRangeSpan = -1
        this.smallBomb.weaponAttributes.baseLifeSpan = 0.5
        this.smallBomb.weaponAttributes.baseRadius = 100
        this.smallBomb.weaponAttributes.baseBulletSpeed = 0
        this.smallBomb.weaponAttributes.baseFrequency = 3

        this.smallBomb.weaponViewData.addSpawnVfx(bombVfxPack, EffectsManager.TargetLayer.Botom);
        this.smallBomb.weaponViewData.baseViewData.alpha = 0
        this.smallBomb.weaponViewData.baseViewData.offset.y = -20
        this.smallBomb.icon = 'hit-d3'



        this.facingMelee = new WeaponData('Melee',);
        this.facingMelee.weaponAttributes.baseLifeRangeSpan = 50
        this.facingMelee.weaponAttributes.baseLifeSpan = 0
        this.facingMelee.weaponAttributes.baseRadius = 30
        this.facingMelee.weaponAttributes.baseBulletSpeed = 150
        this.facingMelee.weaponAttributes.baseFrequency = 2

        this.facingMelee.weaponViewData.addSpawnVfx(meleeShockVfxPack);
        this.facingMelee.weaponViewData.baseViewData.alpha = 0
        this.facingMelee.weaponViewData.baseViewData.offset.y = -20
        this.facingMelee.icon = 'hit-h3'




        this.daggerThrow = new WeaponData('Dagger Throw');
        this.daggerThrow.weaponAttributes.baseLifeRangeSpan = 250
        this.daggerThrow.weaponAttributes.baseLifeSpan = 0
        this.daggerThrow.weaponAttributes.baseRadius = 15
        this.daggerThrow.weaponAttributes.baseBulletSpeed = 250
        this.daggerThrow.weaponAttributes.baseFrequency = 2

        this.daggerThrow.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack);


        this.daggerThrow.weaponViewData.baseViewData.viewData = 'tile_0103'
        this.daggerThrow.weaponViewData.baseViewData.alpha = 1
        this.daggerThrow.weaponViewData.baseViewData.offset.y = -20
        this.daggerThrow.icon = 'tile_0103'


        this.boomerangThrow = new WeaponData('Boomerang');
        this.boomerangThrow.weaponAttributes.baseLifeRangeSpan = 250
        this.boomerangThrow.weaponAttributes.baseLifeSpan = 0
        this.boomerangThrow.weaponAttributes.baseRadius = 15
        this.boomerangThrow.weaponAttributes.baseBulletSpeed = 150
        this.boomerangThrow.weaponAttributes.baseFrequency = 2
        this.boomerangThrow.weaponAttributes.basePiercing = 9999

        this.boomerangThrow.weaponAttributes.extendedBehaviour = WeaponAttributes.ExtendedBehaviour.Boomerang;
        this.boomerangThrow.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack);

        this.boomerangThrow.weaponViewData.baseViewData.viewData = 'tile_0118'
        this.boomerangThrow.weaponViewData.baseViewData.alpha = 1
        this.boomerangThrow.weaponViewData.baseViewData.scale = 1
        this.boomerangThrow.weaponViewData.baseViewData.rotationSpeed = 5
        this.boomerangThrow.weaponViewData.baseViewData.offset.y = 0//-20
        this.boomerangThrow.icon = 'tile_0118'


        this.floatingOrbit = new WeaponData('Orbit');
        this.floatingOrbit.weaponAttributes.baseLifeSpan = 3
        this.floatingOrbit.weaponAttributes.baseLifeRangeSpan = -1
        this.floatingOrbit.weaponAttributes.baseAmount = 5
        this.floatingOrbit.weaponAttributes.baseFrequency = 5
        this.floatingOrbit.weaponAttributes.baseBulletSpeed = Math.PI
        this.floatingOrbit.weaponAttributes.baseRadius = 30
        this.floatingOrbit.weaponAttributes.baseDamageZone = 80
        this.floatingOrbit.weaponAttributes.forceField = true

        this.floatingOrbit.weaponViewData.addSpawnVfx(bombVfxPack);
        this.floatingOrbit.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack);


        this.floatingOrbit.weaponViewData.baseViewData.viewData = 'hit-g1'
        this.floatingOrbit.weaponViewData.baseViewData.scale = 4
        this.floatingOrbit.weaponViewData.baseViewData.offset.y = 0
        this.floatingOrbit.weaponViewData.baseViewData.rotationSpeed = -5
        this.floatingOrbit.icon = 'hit-g1'

        this.floatingOrbit.customConstructor = FloatingProjectile



        this.hoaming = new WeaponData('Hoaming');
        this.hoaming.weaponAttributes.baseLifeRangeSpan = 400
        this.hoaming.weaponAttributes.baseAmount = 1
        this.hoaming.weaponAttributes.baseFrequency = 5
        this.hoaming.weaponAttributes.baseRadius = 15
        this.hoaming.weaponAttributes.baseBulletSpeed = 100
        this.hoaming.weaponAttributes.basePiercing = 1
        this.hoaming.weaponAttributes.baseDetectionZone = 500
        this.hoaming.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack2);
        this.hoaming.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack2);

        //this.hoaming.weaponAttributes.angleOffset = Math.PI / 4
        this.hoaming.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ClosestEnemy

        this.hoaming.weaponViewData.baseViewData.viewData = 'tile_0107'
        this.hoaming.weaponViewData.baseViewData.scale = 1
        this.hoaming.weaponViewData.baseViewData.offset.y = -20
        this.hoaming.icon = 'tile_0107'




        this.multishot = new WeaponData('Multishot');
        this.multishot.weaponAttributes.baseLifeRangeSpan = 150
        this.multishot.weaponAttributes.baseAmount = 4
        this.multishot.weaponAttributes.basePower = 10
        this.multishot.weaponAttributes.basePiercing = 0
        this.multishot.weaponAttributes.baseFrequency = 1
        this.multishot.weaponAttributes.angleOffset = 0.4
        this.multishot.weaponAttributes.baseExtendedAmount = 2
        this.multishot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ParentAngle

        this.multishot.weaponViewData.baseViewData.viewData = 'tile_0131'
        this.multishot.weaponViewData.baseViewData.scale = 1
        this.multishot.icon = 'tile_0131'

        this.multishot.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack)





        this.uniformTimeSpread = new WeaponData('Spread');
        this.uniformTimeSpread.weaponAttributes.baseLifeRangeSpan = 100
        this.uniformTimeSpread.weaponAttributes.baseAmount = 1
        this.uniformTimeSpread.weaponAttributes.basePower = 10
        this.uniformTimeSpread.weaponAttributes.basePiercing = 0
        this.uniformTimeSpread.weaponAttributes.baseFrequency = 0.5
        this.uniformTimeSpread.weaponAttributes.angleOffset = Math.PI / 4
        this.uniformTimeSpread.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.AngularSequence
        this.uniformTimeSpread.weaponViewData.addSpawnVfx(impactShootSpawnVfxPack2)
        this.uniformTimeSpread.weaponViewData.addDestroyVfx(impactShootSpawnVfxPack2)

        this.uniformTimeSpread.weaponViewData.baseViewData.viewData = 'tile_0130'
        this.uniformTimeSpread.weaponViewData.baseViewData.scale = 1
        this.uniformTimeSpread.weaponViewData.baseViewData.offset.y = -20

        this.uniformTimeSpread.icon = 'tile_0130'


    }
    addWeapons(player) {

        let a = [
            this.smallBomb,
            this.facingMelee,
            this.daggerThrow,
            this.boomerangThrow,
            this.floatingOrbit,
            this.hoaming,
            this.multishot,
            this.uniformTimeSpread

        ]
        let testWeapon = new InGameWeapon();

        Utils.shuffle(a)
        // testWeapon.addWeapon(this.smallBomb)
        // testWeapon.addWeapon(this.floatingOrbit)

        for (let i = 0; i < 4; i++) {
            testWeapon.addWeapon(a[i])
        }

        // testWeapon.addWeapon(this.alternateMelee)
        //  testWeapon.addWeapon(this.facingMelee)
        //  testWeapon.addWeapon(this.hoaming)
        //  testWeapon.addWeapon(this.uniformTimeSpread)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.smallBomb)
        console.log("CHeck the alternate weapon")
        console.log("CHeck the hoaming to always find an enemy")
        //testWeapon.addWeapon(this.hoaming)
        // testWeapon.addWeapon(this.uniformTimeSpread)
        // testWeapon.addWeapon(this.boomerangThrow)
        //testWeapon.addWeapon(this.daggerThrow)
        // testWeapon.addWeapon(this.multishot)
        //testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.facingMelee)
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

    }
}