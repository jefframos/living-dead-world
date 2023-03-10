import BaseEnemy from "../entity/BaseEnemy";
import GameStaticData from "../data/GameStaticData";
import SessionSpawner from "./spawn/SessionSpawner";
import Utils from "../core/utils/Utils";

export default class EnemyGlobalSpawner {

    constructor(gameManager) {
        this.gameManager = gameManager;
        this.distanceToSpawn = 400;
    }
    spawnRandom() {
        this.spawnSingleEntity(GameStaticData.instance.getEntityByIndex('enemy', 0));
    }
    spawnEnemy(spawnData) {

        spawnData.updateDistanceToSpawn(this.distanceToSpawn);

        const toSpawn = spawnData.entityToSpawn;
        let enemyData = GameStaticData.instance.getEntityById('enemy', toSpawn.entity);

        spawnData.totalSpawned++;
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)
        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + toSpawn.x
            , this.gameManager.player.transform.position.z + toSpawn.z)
    }
    spawnSingleEntity(enemyData) {
        //find out if uses baseEnemy
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)
        let circleRandom = Utils.randomCircle()
        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn
            , this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn)
    }
}