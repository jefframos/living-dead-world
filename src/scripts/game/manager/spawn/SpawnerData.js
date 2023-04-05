import SessionSpawner from "./SessionSpawner"
import Utils from "../../core/utils/Utils"

export default class SpawnerData {
    constructor() {
        this.once = false
        this.areaType = SessionSpawner.SpawnAreaType.Rect
        this.width = 100
        this.height = 100
        this.radius = 100
        this.total = 15
        this.maxActive = 15
        this.active = false;
        this.entity = ''
        this.toSpawnData = { entity: '', x: 0, z: 0 }
        this.totalSpawned = 0;
        this.groupID = 0;
        this.distanceToSpawn = 400;
        this.randomPoint = Utils.randomCircle()

        this.defaults = {};
        for (const key in this) {
            if (Object.hasOwnProperty.call(this, key)) {
                this.defaults[key] = this[key];
                
            }
        }
    }
    reset(){
        for (const key in this.defaults) {
            if (Object.hasOwnProperty.call(this.defaults, key)) {
                this[key] = this.defaults[key];                
            }
        }
    }
    build(data) {
        this.reset();
        this.totalSpawned = 0;
        this.groupID = 0;
        this.toSpawnData = { entity: '', x: 0, z: 0 }
        for (const key in data) {
            if (this[key] !== undefined) {
                this[key] = data[key];
            }
        }

    }
    updateDistanceToSpawn(distance) {
        this.distanceToSpawn = distance;
    }
    get canSpawn() {
        return this.totalSpawned < this.total;
    }
    get entityId() {
        return this.entity;
    }
    get entityToSpawn() {
        this.toSpawnData.entity = this.entity;
        this.addRelativeSpawnPoint();
        return this.toSpawnData;
    }

    addRelativeSpawnPoint() {
        if (this.totalSpawned >= this.maxActive * this.groupID) {
            this.groupID++;
            this.randomPoint = Utils.randomCircle()
        }
        switch (this.areaType) {
            case SessionSpawner.SpawnAreaType.Rect:
                this.toSpawnData.x = Math.random() * this.width + this.randomPoint.x * this.distanceToSpawn;
                this.toSpawnData.z = Math.random() * this.height + this.randomPoint.y * this.distanceToSpawn;
                break;
            case SessionSpawner.SpawnAreaType.Circle:
                const ang = Math.random() * Math.PI * 2;
                let dist = this.distanceToSpawn * Math.random();
                this.toSpawnData.x = Math.cos(ang) * this.radius + this.randomPoint.x * dist;
                this.toSpawnData.z = Math.sin(ang) * this.radius + this.randomPoint.y * dist;
                break;
            case SessionSpawner.SpawnAreaType.Point:
                this.toSpawnData.x = 0;
                this.toSpawnData.z = 0;
                break;
        }

    }
}
