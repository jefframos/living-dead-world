import AuraProjectile from "../components/weapon/AuraProjectile";
import BaseWeapon from "../components/weapon/BaseWeapon";
import BounceBullet from "../components/weapon/bullets/BounceBullet";
import Bullet from "../components/weapon/bullets/Bullet";
import CircularBullet from "../components/weapon/bullets/CircularBullet";
import EffectsManager from "../manager/EffectsManager";
import FloatingProjectile from "../components/weapon/FloatingProjectile";
import GameStaticData from "../data/GameStaticData";
import GravityBullet from "../components/weapon/bullets/GravityBullet";
import InGameWeapon from "../data/InGameWeapon";
import LaserBeam from "../components/weapon/bullets/LaserBeam";
import ParticleDescriptor from "../components/particleSystem/ParticleDescriptor";
import SinoidBullet from "../components/weapon/bullets/SinoidBullet";
import SpriteSheetBehaviour from "../components/particleSystem/particleBehaviour/SpriteSheetBehaviour";
import Utils from "../core/utils/Utils";
import Vector3 from "../core/gameObject/Vector3";
import WeaponAttributes from "../data/WeaponAttributes";
import WeaponData from "../data/WeaponData";

export default class WeaponBuilder {
    static BulletsAvailable = {
        Bullet: Bullet,
        GravityBullet: GravityBullet,
        SinoidBullet: SinoidBullet,
        CircularBullet: CircularBullet,
        BounceBullet: BounceBullet,
        LaserBeam: LaserBeam
    }
    static WeaponsAvailable = {
        BaseWeapon: BaseWeapon,
        AuraProjectile: AuraProjectile,
        FloatingProjectile: FloatingProjectile
    }
    static instance;
    constructor(engine) {
        WeaponBuilder.instance = this;
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

        this.weaponsArray = []
        for (const key in this.weaponsData) {
            this.findDestroyWeapon(this.weaponsData[key])
        }

        for (const key in this.weaponsData) {
            if (this.weaponsData[key].isMain) {
                this.weaponsArray.push(this.weaponsData[key])
            }
        }
        console.log(this.weaponsArray)
        if (!window.weaponFolder) {
            window.weaponFolder = window.GUI.addFolder("Weapons");
            window.magicFolder = window.GUI.addFolder("Magic");
            window.weaponFolder.add(this, 'eraseWeapon')
            window.magicFolder.add(this, 'eraseWeapon')

            this.helpers = {};

            for (const key in this.weaponsData) {
                if (this.weaponsData[key].isMain) {
                    this.helpers[key] = () => {
                        let data = this.weaponsData[key];
                        this.equipWeapon(data)
                    }

                    switch (this.weaponsData[key].weaponType) {
                        case WeaponData.WeaponType.Physical:
                            window.weaponFolder.add(this.helpers, key)
                            break;
                        case WeaponData.WeaponType.Magical:
                            window.magicFolder.add(this.helpers, key)
                            break;
                        default:
                            break;
                    }
                }
            }
        }

    }
    findDestroyWeapon(weapon) {
        if (weapon.onDestroyId) {
            weapon.addFixedDestroyedWeapon(this.weaponsData[weapon.onDestroyId])
        }
    }
    makeWeapon(weaponData) {
        let weapon = new WeaponData(weaponData.name);


        if (weaponData.ingameViewData) {
            let targetInGameViewData = GameStaticData.instance.getDataById('weapons', 'inGameView', weaponData.ingameViewData)
            if (targetInGameViewData) {
                console.log(targetInGameViewData, weapon.ingameViewData)
                for (const key in targetInGameViewData) {
                    if (weapon.ingameViewDataStatic[key] != undefined) {
                        weapon.ingameViewDataStatic[key] = targetInGameViewData[key];
                    }
                }
            }
        }

        
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
                                    if (overriderKey == 'viewOffset') {
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
            if (WeaponBuilder.BulletsAvailable[targetOverrider.bulletComponent]) {
                weapon.weaponAttributes.overrider.bulletComponent = WeaponBuilder.BulletsAvailable[targetOverrider.bulletComponent]
            }
            if (!weapon.weaponAttributes.overrider.bulletComponent) {
                weapon.weaponAttributes.overrider.bulletComponent = WeaponBuilder.BulletsAvailable[weaponData.bulletComponent]
            }
            for (const key in targetOverrider.attributes) {
                if (Object.hasOwnProperty.call(weapon.weaponAttributes.overrider, key)) {
                    weapon.weaponAttributes.overrider[key] = targetOverrider.attributes[key];
                }
            }
        } else {
            weapon.weaponAttributes.overrider.bulletComponent = WeaponBuilder.BulletsAvailable[weaponData.bulletComponent]
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
            viewOffset: vfxPackData.viewOffset,
            scale: vfxPackData.scale,
            targetLayer: vfxPackData.targetLayer,
            lockRotation: vfxPackData.lockRotation,
            color: vfxPackData.color
        }
        let spriteSheetParams = GameStaticData.instance.getDataById('vfx', 'weaponVFX', vfxPackData.vfxData)
        if (!spriteSheetParams) {
            console.error('coudn\'t find VFX for', vfxPackData.vfxData);
        }
        vfxPack.descriptor.addBaseBehaviours(SpriteSheetBehaviour, spriteSheetParams)
        return vfxPack;
    }
    equipWeapon(weaponData) {
        if (!this.mainWeapon) {
            this.mainWeapon = new InGameWeapon();
            this.mainWeapon.addWeapon(weaponData)
            this.player.addWeapon(this.mainWeapon)

        } else {
            this.mainWeapon.addWeapon(weaponData)

        }
    }
    eraseWeapon() {

        if (this.mainWeapon) {
            this.mainWeapon.clear()
        }
        this.mainWeapon = null;
        this.player.clearWeapon();
        //this.mainWeapon = new InGameWeapon();

        if (window.isMobile) {
            this.mainWeapon.addWeapon(this.weaponsData['MELEE_SWORD'])
        }
        //this.player.addWeapon(this.mainWeapon)
    }
    addWeapons(player) {
        this.player = player;
        return

        this.mainWeapon = new InGameWeapon();
        this.mainWeapon2 = new InGameWeapon();
        Utils.shuffle(this.weaponsArray)
        // this.mainWeapon.addWeapon(this.weaponsData['MELEE_SWORD'])
        // this.mainWeapon.addWeapon(this.weaponsData['DAGGER_SNIPER'])

        this.mainWeapon.addWeapon(this.weaponsArray[Math.floor(Math.random() * this.weaponsArray.length)])
        this.mainWeapon2.addWeapon(this.weaponsArray[Math.floor(Math.random() * this.weaponsArray.length)])

        if (window.isMobile) {

            for (let i = 0; i < 3; i++) {
                this.mainWeapon.addWeapon(this.weaponsArray[i])
            }
        }
        player.addWeapon(this.mainWeapon)
        player.addWeapon(this.mainWeapon2)
    }
}