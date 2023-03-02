import EntityAttributes from "./EntityAttributes";
import EntityData from "./EntityData";

export default class CompanionData {

    constructor(staticData) {
        this.attributes = new EntityAttributes();
        this.attributes.reset(staticData.attributes)
        this.staticData = staticData;

        this.entityData = new EntityData();
        this.entityData.copyOver(staticData.entityData)

        for (const key in staticData) {
            if (this[key] == undefined) {
                this[key] = staticData[key];
            }
        }
    }
}
