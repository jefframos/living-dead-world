import EntityMultipliers from "./EntityMultipliers";

export default class EntityAttributes {
    constructor(overrideDetaultValue) {
        this.baseHealth = 100;
        this.baseDefense = 10;
        this.baseSpeed = 10;
        this.baseFrequency = 1;
        this.basePower = 10;
        this.baseMagicDefense = 0;
        this.baseMass = 1;
        this.baseRadius = 10;
        this.damageZone = 10;
        this.baseDistance = 0;
        this.baseCollectionRadius = 50;
        this.level = 0;

        if (overrideDetaultValue != undefined) {
            this.overrideDefaults(overrideDetaultValue);
        } else {
            this.writeDefaults();
        }

        this.multipliers = new EntityMultipliers();
    }
    writeDefaults() {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this[key + 'default'] = this[key];
            }
        }
    }
    overrideDefaults(value) {
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this[key + 'default'] = value;
            }
        }
    }
    reset(attributes) {

        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                if(this[key + 'default'] !== undefined) {
                    this[key] = this[key + 'default'];
                }
            }
        }

        if(attributes){
            for (const key in attributes) {
                if (Object.hasOwnProperty.call(attributes, key)) {
                    this[key] = attributes[key];
                }
            }
        }
    }

    addMultiplyer(type, value){
        if(this[type]){
            this[type] += value;
        }
    }
    findAttributeValue(att) {
        const attribute = this[att];
        if (Array.isArray(attribute)) {
            const level = Math.min(this.level, attribute.length - 1)
            return attribute[level]
        }
        return attribute
    }
    get distance() {
        return this.findAttributeValue('baseDistance') * this.multipliers.distance;
    }
    get health() {
        return this.findAttributeValue('baseHealth') * this.multipliers.health;
    }
    get frequency() {
        return this.findAttributeValue('baseFrequency') * this.multipliers.frequency;
    }
    get defense() {
        return this.findAttributeValue('baseDefense') * this.multipliers.defense;
    }
    get speed() {
        return this.findAttributeValue('baseSpeed') * this.multipliers.speed;
    }
    get zone() {
        return this.findAttributeValue('damageZone');
    }
    get power() {
        return this.findAttributeValue('basePower') * this.multipliers.power;
    }
    get magicDefense() {
        return this.findAttributeValue('baseMagicDefense') * this.multipliers.magicDefense;
    }
    get mass() {
        return this.findAttributeValue('baseMass') * this.multipliers.mass;
    }
    get radius() {
        return this.findAttributeValue('baseRadius') * this.multipliers.radius;
    }
    get collectionRadius() {
        return this.findAttributeValue('baseCollectionRadius') * this.multipliers.collectionRadius;
    }

    clone() {
        let attributes = new EntityAttributes();

        for (const key in this) {
            if (this[key] && this[key].clone) {
                attributes[key] = this[key].clone();
            } else {
                attributes[key] = this[key];
            }

        }
        return attributes;
    }
}



