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
        IgnoreEnemyBullets: 0,
        DestroyEnemyBullets: 1,
        DestroyEnemyBulletsAndDie: 2,
    }
    static DirectionType = {
        FacingPlayer: 0,
        ClosestEnemy: 1,
        AngularSequence: 2,
        FacingAlternated: 3,
        FacingBackwards: 4,
        ParentAngle: 5,
    }
    static ExtendedBehaviour = {
        None: 0,
        Boomerang: 1,
    }
    constructor() {
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
        this.baseDetectionZone = 200;
        this.baseExtendedAmount = 1;
        this.baseDirectionType = WeaponAttributes.DirectionType.FacingPlayer;
        this.baseBlockType = WeaponAttributes.BlockType.IgnoreEnemyBullets;
        this.extendedBehaviour = WeaponAttributes.ExtendedBehaviour.None;
        this.baseShootArc = 0;
        this.generalOffset = 0;
        this.angleOffset = 0.1;
        this.angleNoise = 0.1;

        //it means that it will repel from the weapon
        this.forceField = false;
    }
    get range() {
        return this.baseRange
    }
    get lifeSpan() {
        return this.baseLifeSpan
    }
    get lifeRangeSpan() {
        return this.baseLifeRangeSpan
    }
    get power() {
        return this.basePower
    }
    get radius() {
        return this.baseRadius
    }
    get bulletSpeed() {
        return this.baseBulletSpeed
    }
    get frequency() {
        return this.baseFrequency
    }
    get piercing() {
        return this.basePiercing
    }
    get amount() {
        return this.baseAmount
    }
    get extendedAmount() {
        return this.baseExtendedAmount
    }
    get damageZone() {
        return this.baseDamageZone
    }
    get detectionZone() {
        return this.baseDetectionZone
    }
    get directionType() {
        return this.baseDirectionType
    }
    get blockType() {
        return this.baseBlockType
    }
    get shootArc() {
        return this.baseShootArc
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