import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";

export default class AttributeData {

    constructor(staticData) {
        this.entityData = new EntityData();
        this.entityData.copyOver(staticData.entityData)

        this.ingameData = null;
        for (const key in staticData) {
            if (this[key] == undefined) {
                this[key] = staticData[key];
            }
        }
    }
    get level() {
        if (this.ingameData) {
            return this.ingameData.level;
        }
        return 0;
    }
    clone() {
        let attributes = new AttributeData();

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
