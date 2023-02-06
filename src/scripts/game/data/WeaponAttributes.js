//sword: soldier
//fast low range attack facing player, piercing
//

//longSword: knight
//unleash high range attack every x sec
//slow, high range attack facing player, piercing

//bow: archer
//slow, high distance, high damage, target closest enemy, piercing
//throw bombs

//crossbow: hunter
//fast, multiple shots, medium damage, shot in accum angle, no piercing
//spawn companions

//dagger: rogue
//fast, low range, high damage, attack closest enemy
//get invencible for x time after damage

//wand: mage
//attack in front and back directions alternating, no piercing
//random fireballs

//hamer: dwarf
//slow, high damage, attack in area
//collect more money

//axe: barbarian
//boomerang, attack closest, piercing
//throw extra piercing attack when damaged x amount

export default class WeaponAttributes {
    static BlockType = {
        IgnoreEnemyBullets:'IgnoreEnemyBullets',
        DestroyEnemyBullets:'DestroyEnemyBullets',
        DestroyEnemyBulletsAndDie:'DestroyEnemyBulletsAndDie'
    }
    static DirectionType = {
        FacingPlayer:'FacingPlayer',
        ClosestEnemy:'ClosestEnemy',
        AngularSequence:'AngularSequence',
        FacingAlternated:'FacingAlternated',
        FacingBackwards:'FacingBackwards',
        ParentAngle:'ParentAngle',
        Hoaming:'Hoaming',
        ClosestEnemySnap:'ClosestEnemySnap'
    }
    static ExtendedBehaviour = {
        None: 0,
        Boomerang: 'Boomerang',
    }
    constructor() {
        this.isMain = true;
        this.baseRange = 60;
        this.baseLifeSpan = -1;
        this.baseLifeRangeSpan = 50;
        this.basePower = 100;
        this.baseRadius = 15;
        this.baseBulletSpeed = 200;
        this.baseFrequency = 1;
        this.basePiercing = 10;
        this.baseAmount = 1;
        this.baseDamageZone = 100;
        this.baseDetectionZone = 500;
        this.baseDamageOverTime = 3;
        this.baseDirectionType = WeaponAttributes.DirectionType.FacingPlayer;
        this.baseBlockType = WeaponAttributes.BlockType.IgnoreEnemyBullets;
        
        
        this.baseBrustFire = {
            amount:0,
            interval:0
        };
        this.baseExtendedBehaviour = WeaponAttributes.ExtendedBehaviour.None;
        this.baseBaseShootArc = 0;
        this.baseGeneralOffset = 0;
        this.baseAngleOffset = 0.1;
        this.baseAngleNoise = 0.1;
        this.baseForceField = false;
        this.baseForceFeedback = 5;

        this.overrider = null;
    }
    makeOverrider(){
        this.overrider = this.clone();
        this.overrider.isMain = false;
    }
    get brustFire(){
        return this.isMain ? this.baseBrustFire : this.overrider.baseBrustFire
    }
    get extendedBehaviour() {
        return this.isMain ? this.baseExtendedBehaviour : this.overrider.baseExtendedBehaviour
    }
    get baseShootArc(){
        return this.isMain ? this.baseBaseShootArc : this.overrider.baseBaseShootArc
    }
    get generalOffset(){
        return this.isMain ? this.baseGeneralOffset : this.overrider.baseGeneralOffset
    }
    get angleOffset(){
        return this.isMain ? this.baseAngleOffset : this.overrider.baseAngleOffset
    }
    get angleNoise(){
        return this.isMain ? this.baseAngleNoise : this.overrider.baseAngleNoise
    }
    get forceField(){
        return this.isMain ? this.baseForceField : this.overrider.baseForceField
    }
    get forceFeedback(){
        return this.isMain ? this.baseForceFeedback : this.overrider.baseForceFeedback
    }
    get range() {
        return this.isMain ? this.baseRange : this.overrider.baseRange
    }
    get lifeSpan() {
        return this.isMain ? this.baseLifeSpan : this.overrider.baseLifeSpan
    }
    get lifeRangeSpan() {
        return this.isMain ? this.baseLifeRangeSpan : this.overrider.baseLifeRangeSpan
    }
    get power() {
        return this.isMain ? this.basePower : this.overrider.basePower
    }
    get radius() {
        return this.isMain ? this.baseRadius : this.overrider.baseRadius
    }
    get bulletSpeed() {
        return this.isMain ? this.baseBulletSpeed : this.overrider.baseBulletSpeed
    }
    get frequency() {
        return this.isMain ? this.baseFrequency : this.overrider.baseFrequency
    }
    get piercing() {
        return this.isMain ? this.basePiercing : this.overrider.basePiercing
    }
    get amount() {
        return this.isMain ? this.baseAmount : this.overrider.baseAmount
    }
    get damageZone() {
        return this.isMain ? this.baseDamageZone : this.overrider.baseDamageZone
    }
    get detectionZone() {
        return this.isMain ? this.baseDetectionZone : this.overrider.baseDetectionZone
    }
    get directionType() {
        return this.isMain ? this.baseDirectionType : this.overrider.baseDirectionType
    }
    get blockType() {
        return this.isMain ? this.baseBlockType : this.overrider.baseBlockType
    }
    get shootArc() {
        return this.isMain ? this.baseShootArc : this.overrider.baseShootArc
    }
    get damageOverTime() {
        return this.isMain ? this.baseDamageOverTime : this.overrider.baseDamageOverTime
    }

    clone() {
        let clone = new WeaponAttributes();
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                clone[key] = this[key];
            }
        }
        return clone;
    }
}