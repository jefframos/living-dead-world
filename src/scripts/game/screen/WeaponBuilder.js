import FloatingProjectile from "../components/weapon/FloatingProjectile";
import InGameWeapon from "../data/InGameWeapon";
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";

export default class WeaponBuilder {
    constructor() {

        this.smallBomb = new WeaponData();
        this.smallBomb.weaponAttributes.baseLifeRangeSpan = -1
        this.smallBomb.weaponAttributes.baseLifeSpan = 1
        this.smallBomb.weaponAttributes.baseRadius = 50
        this.smallBomb.weaponAttributes.baseBulletSpeed = 0

        this.smallBomb.weaponViewData.addSpawnSpritesheet({
            time: 0.5,
            startFrame: 1,            
            endFrame: 5,
            spriteName: 'hit-d',
            addZero: false,
            lifeSpan: 9999
        }, new Vector3(0, 0, 0), 2)
        this.smallBomb.weaponViewData.baseViewData.alpha = 0
        this.smallBomb.weaponViewData.baseViewData.offset.y = -20
//console.log("Remove the ")

        this.facingMelee = new WeaponData();
        this.facingMelee.weaponAttributes.baseLifeRangeSpan = 50
        this.facingMelee.weaponViewData.addSpawnSpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-h',
            addZero: false,
            lifeSpan: 9999
        }, new Vector3(10, 0, -20))
        this.facingMelee.weaponViewData.baseViewData.alpha = 0

        this.alternateMelee = new WeaponData();
        this.alternateMelee.weaponAttributes.baseLifeRangeSpan = 50
        this.alternateMelee.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.FacingAlternated
        this.alternateMelee.weaponViewData.addSpawnSpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-h',
            addZero: false,
            lifeSpan: 9999
        }, new Vector3(10, 0, -20))
        this.alternateMelee.weaponViewData.baseViewData.alpha = 0





        this.floatingOrbit = new WeaponData();
        this.floatingOrbit.weaponAttributes.baseLifeSpan = 3
        this.floatingOrbit.weaponAttributes.baseLifeRangeSpan = -1
        this.floatingOrbit.weaponAttributes.baseAmount = 5
        this.floatingOrbit.weaponAttributes.baseFrequency = 6
        this.floatingOrbit.weaponAttributes.baseBulletSpeed = Math.PI
        this.floatingOrbit.weaponAttributes.baseRadius = 30
        this.floatingOrbit.weaponAttributes.baseDamageZone = 80
        this.floatingOrbit.weaponAttributes.forceField = true

        this.floatingOrbit.weaponViewData.baseViewData.viewData = 'hit-g1'
        this.floatingOrbit.weaponViewData.baseViewData.scale = 4
        this.floatingOrbit.weaponViewData.baseViewData.offset.y = -20
        this.floatingOrbit.weaponViewData.baseViewData.rotationSpeed = -5

        this.floatingOrbit.constructor = FloatingProjectile



        this.hoaming = new WeaponData();
        this.hoaming.weaponAttributes.baseLifeRangeSpan = 500
        this.hoaming.weaponAttributes.baseAmount = 1
        this.hoaming.weaponAttributes.baseFrequency = 5
        this.hoaming.weaponAttributes.baseRadius = 30
        this.hoaming.weaponAttributes.baseDetectionZone = 500
        //this.hoaming.weaponAttributes.angleOffset = Math.PI / 4
        this.hoaming.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ClosestEnemy

        this.hoaming.weaponViewData.baseViewData.viewData = 'knife'
        this.hoaming.weaponViewData.baseViewData.scale = 1
        this.hoaming.weaponViewData.baseViewData.offset.y = -20




        this.multishot = new WeaponData();
        this.multishot.weaponAttributes.baseLifeRangeSpan = 150
        this.multishot.weaponAttributes.baseAmount = 4
        this.multishot.weaponAttributes.basePower = 10
        this.multishot.weaponAttributes.basePiercing = 0
        this.multishot.weaponAttributes.baseFrequency = 1
        this.multishot.weaponAttributes.angleOffset = 0.4
        this.multishot.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.ParentAngle
        
        this.multishot.weaponViewData.baseViewData.viewData = 'shoot'
        this.multishot.weaponViewData.baseViewData.angleOffset = Math.PI / 2

        this.multishot.weaponViewData.addSpawnSpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 6,
            spriteName: 'hit-l',
            addZero: false,
            lifeSpan: 9999
        }, new Vector3())
        //this.multishot.onDestroyWeapon = this.smallBomb;


        this.uniformTimeSpread = new WeaponData();
        this.uniformTimeSpread.weaponAttributes.baseLifeRangeSpan = 100
        this.uniformTimeSpread.weaponAttributes.baseAmount = 1
        this.uniformTimeSpread.weaponAttributes.basePower = 10
        this.uniformTimeSpread.weaponAttributes.basePiercing = 0
        this.uniformTimeSpread.weaponAttributes.baseFrequency = 0.1
        this.uniformTimeSpread.weaponAttributes.angleOffset = Math.PI / 4
        this.uniformTimeSpread.weaponAttributes.baseDirectionType = WeaponAttributes.DirectionType.AngularSequence

        this.uniformTimeSpread.weaponViewData.addDestroySpritesheet({
            time: 0.2,
            startFrame: 1,
            endFrame: 5,
            spriteName: 'hit-j',
            addZero: false,
            lifeSpan: 9999
        }, new Vector3())


        this.uniformTimeSpread.weaponViewData.baseViewData.viewData = 'shoot'
        this.uniformTimeSpread.weaponViewData.baseViewData.scale = 1
        this.uniformTimeSpread.weaponViewData.baseViewData.offset.y = -20
        this.uniformTimeSpread.weaponViewData.baseViewData.angleOffset = Math.PI / 2
        //this.uniformTimeSpread.onDestroyWeapon = this.multishot;

    }
    addWeapons(player) {

        let testWeapon = new InGameWeapon();
       // testWeapon.addWeapon(this.alternateMelee)
        // testWeapon.addWeapon(this.uniformTimeSpread)
        //testWeapon.addWeapon(this.floatingOrbit)
        //testWeapon.addWeapon(this.multishot)
        console.log("CHeck the alternate weapon")
        console.log("CHeck the hoaming to always find an enemy")
        //testWeapon.addWeapon(this.hoaming)
        //testWeapon.addWeapon(this.smallBomb)
        // testWeapon.addWeapon(this.multishot)
        // // testWeapon.addWeapon(this.multishot)
         testWeapon.addWeapon(this.facingMelee)
         testWeapon.addWeapon(this.smallBomb)
        // testWeapon.addWeapon(this.multishot)
        // testWeapon.addWeapon(this.smallBomb)

       // player.addWeapon(this.multishot)
        // player.addWeapon(this.alternateMelee)
        // player.addWeapon(this.floatingOrbit)
        // player.addWeapon(this.hoaming)        
         player.addWeapon(testWeapon)

    }
}