import BaseEnemy from "../entity/BaseEnemy";
import Utils from "../core/utils/Utils";

export default class EnemyGlobalSpawner {
    static SpawnType = {
        Single: 1,
        Brust: 2,
        Group: 3
    }
    static SpawnAreaType = {
        Point: 1,
        Rect: 2,
        Circle: 3
    }
    constructor(gameManager) {
        this.gameManager = gameManager;

        this.distanceToSpawn = 800

    }
    spawnRandom(){
        this.spawnSingleEntity(this.gameManager.gameStaticData.enemies[Math.floor(Math.random() * this.gameManager.gameStaticData.enemies.length)]);
    }
    spawnEnemy(spawnData) {
        if (!spawnData.spawnParameters || !spawnData.spawnParameters.areaType) {
            this.spawnSingleEntityFromSpawner(spawnData)
            return;
        }

        switch (spawnData.spawnParameters.areaType) {
            case EnemyGlobalSpawner.SpawnAreaType.Point:
                this.spawnSingleEntityFromSpawner(spawnData);
                break;
            case EnemyGlobalSpawner.SpawnAreaType.Rect:
                this.spawnRectGroup(spawnData);
                break;
            case EnemyGlobalSpawner.SpawnAreaType.Circle:
                this.spawnCircle(spawnData);
                break;
        }
    }
    spawnSingleEntity(enemyData){

        //find out if uses baseEnemy
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)

        let circleRandom = Utils.randomCircle()

        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn
            , this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn)
    }
    spawnSingleEntityFromSpawner(spawnData) {

        let enemyData = this.gameManager.gameStaticData.enemies[spawnData.id];

        //find out if uses baseEnemy
        let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)

        let circleRandom = Utils.randomCircle()

        enemy.setPositionXZ(
            this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn
            , this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn)


    }
    spawnRectGroup(spawnData) {

        let circleRandom = Utils.randomCircle()
        let middlePosition = {
            x:this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn,
            y:this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn,
        }

        for (let index = 0; index < spawnData.spawnParameters.total; index++) {
            
            let enemyData = this.gameManager.gameStaticData.enemies[spawnData.id];
            let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)

            circleRandom = Utils.randomRect()
    
            enemy.setPositionXZ(
                middlePosition.x + circleRandom.x * spawnData.spawnParameters.width
                , middlePosition.y + circleRandom.y * spawnData.spawnParameters.height)
        }
    }
    spawnCircle(spawnData) {

        let circleRandom = Utils.randomCircle()
        let middlePosition = {
            x:this.gameManager.player.transform.position.x + circleRandom.x * this.distanceToSpawn,
            y:this.gameManager.player.transform.position.z + circleRandom.y * this.distanceToSpawn,
        }

        for (let index = 0; index < spawnData.spawnParameters.total; index++) {
            
            let enemyData = this.gameManager.gameStaticData.enemies[spawnData.id];
            let enemy = this.gameManager.addEntity(BaseEnemy, enemyData)

            circleRandom = Utils.randomCircle()
    
            enemy.setPositionXZ(
                middlePosition.x + circleRandom.x * spawnData.spawnParameters.radius * Math.random()
                , middlePosition.y + circleRandom.y * spawnData.spawnParameters.radius * Math.random())
        }

    }
}