import BaseEnemy from "../entity/BaseEnemy";
import Collectable from "../entity/Collectable";
import EffectsManager from "./EffectsManager";
import EnemyGlobalSpawner from "./EnemyGlobalSpawner";
import GameStaticData from "../data/GameStaticData";
import Layer from "../core/Layer";
import Player from "../entity/Player";
import PlayerSessionData from "../data/PlayerSessionData";
import Vector3 from "../core/gameObject/Vector3";

export default class GameManager {
    static instance;
    constructor(engine) {
        GameManager.instance = this;
        this.gameEngine = engine;
        this.gameplayEntities = [];
        this.entityRegister = [];
        this.activeEnemies = [];
        this.collectables = [];
        this.entitiesByType = {};

        this.gameManagerStats = {
            GMtotalGameObjects: 0,
            GMenemiesDeaths: 0,
            Phase: 0,
            Time: 0,
        }
        window.gameplayFolder.add(this.gameManagerStats, 'GMtotalGameObjects').listen();
        window.gameplayFolder.add(this.gameManagerStats, 'GMenemiesDeaths').listen();

        window.gameplayFolder.add(this.gameManagerStats, 'Phase').listen();
        window.gameplayFolder.add(this.gameManagerStats, 'Time').listen();

        this.enemyGlobalSpawner = new EnemyGlobalSpawner(this);

        this.playerSessionData = new PlayerSessionData();

        this.gameplayTime = 0;

        this.levelStructure = {
            phases: [
                {
                    duration: 60,
                    spawnData: [{
                        id: 0,
                        max: 20,
                        spawnParameters: {
                            areaType: EnemyGlobalSpawner.SpawnAreaType.Point
                        }
                    },
                    {
                        id: 1,
                        max: 15,
                        spawnParameters: {
                            limitSpawn: 0,
                            areaType: EnemyGlobalSpawner.SpawnAreaType.Circle,
                            radius: 150,
                            total: 30
                        }
                    },
                    {
                        id: 2,
                        max: 15,
                        spawnParameters: {
                            limitSpawn: 0,
                            areaType: EnemyGlobalSpawner.SpawnAreaType.Rect,
                            width: 100,
                            height: 100,
                            total: 15
                        }
                    }],
                },
                {
                    duration: 80,
                    spawnData: [
                        {
                            id: 1,
                            max: 100,
                            spawnParameters: {
                                limitSpawn: 0,
                                areaType: EnemyGlobalSpawner.SpawnAreaType.Circle,
                                radius: 50,
                                total: 5
                            }

                        }],
                },
                {
                    duration: 120,
                    spawnData: [
                        {
                            id: 0,
                            max: 200,
                            spawnParameters: {
                                limitSpawn: 0,
                                areaType: EnemyGlobalSpawner.SpawnAreaType.Circle,
                                radius: 400,
                                total: 80
                            }

                        },
                        {
                            id: 2,
                            max: 200,
                            spawnParameters: {
                                limitSpawn: 0,
                                areaType: EnemyGlobalSpawner.SpawnAreaType.Circle,
                                radius: 400,
                                total: 50
                            }

                        }],
                }
            ],
        }
        this.currentPhase = 0;
        console.log('when registering, some times i remove the events that are beign used in other places')

        this.init = false;
    }
    start(player) {
        this.player = player;
        this.playerSessionData.reset();
        this.player.sessionData = this.playerSessionData;
        
        this.init = true;
        this.gameplayTime = 0;
        this.currentPhase = 0;
        for (var i = this.activeEnemies.length - 1; i >= 0; i--) {
            this.activeEnemies[i].destroy();
        }
        for (var i = this.collectables.length - 1; i >= 0; i--) {
            this.collectables[i].destroy();
        }
        this.collectables = [];
        this.activeEnemies = [];
        this.entitiesByType = {}
    }
    onPlayerLevelUp(xpData){
        
    }
    spawnRandomEnemy() {
        this.enemyGlobalSpawner.spawnRandom();
    }
    spawnEnemy(spawnData) {
        if (!spawnData) {
            console.log('cant spawn without data');
            return
        }
        this.enemyGlobalSpawner.spawnEnemy(spawnData)
    }
    addEntity(constructor, buildParams) {
        let entity = this.gameEngine.poolGameObject(constructor, false)
        entity.build(buildParams)

        this.gameplayEntities.push(entity);

        this.gameManagerStats.GMtotalGameObjects = this.gameplayEntities.length
        entity.gameObjectDestroyed.addOnce(this.removeEntity.bind(this))

        if (entity.layerCategory && entity.layerCategory == Layer.Enemy) {
            this.activeEnemies.push(entity)

            if (!this.entitiesByType[buildParams.id]) {
                this.entitiesByType[buildParams.id] = []
            }

            this.entitiesByType[buildParams.id].push(entity)

        }

        this.registerEntity(entity)
        return entity;
    }
    registerEntity(entity) {

        if (this.entityRegister.indexOf(entity) < 0 && entity.health) {
            //entity.health.gotDamaged.remove(this.entityDamaged)

            entity.health.gotDamaged.add(this.entityDamaged.bind(this))
            entity.health.gotKilled.add(this.entityKilled.bind(this))
            // entity.health.gotKilledParticles.add(this.entityKilled.bind(this))

            this.entityRegister.push(entity);

        }
    }
    removeEntity(entity) {
        this.entityRegister = this.entityRegister.filter(item => item !== entity)
        this.gameplayEntities = this.gameplayEntities.filter(item => item !== entity)
        this.gameManagerStats.totalGameObjects = this.activeEnemies.length//this.gameplayEntities.length

        if (entity.layerCategory && entity.layerCategory == Layer.Enemy) {
            this.activeEnemies = this.activeEnemies.filter(item => item !== entity)
            this.entitiesByType[entity.staticData.id] = this.entitiesByType[entity.staticData.id].filter(item => item !== entity)
        }
    }
    entityDamaged(entity, value) {
        // if (entity.dying) return;
        // EffectsManager.instance.popDamage(entity.gameObject, value)
    }

    entityKilled(health, value) {
        if (Math.random() > 0.3) return;
        let collectable = this.addEntity(Collectable);
        collectable.setPositionXZ(health.gameObject.transform.position.x, health.gameObject.transform.position.z)
        this.collectables.push(collectable);
        // this.gameManagerStats.GMenemiesDeaths++;
        // EffectsManager.instance.popKill(entity.gameObject, value)
    }
    findClosestEnemy(point) {
        let closest = 0;
        let minDist = 999999;
        for (var i = 0; i < this.activeEnemies.length; i++) {
            let enemy = this.activeEnemies[i];

            let dist = Vector3.distance(enemy.transform.position, point)
            if (dist < minDist) {
                minDist = dist;
                closest = i;
            }
        }

        return this.activeEnemies[closest];
    }
    angleFromPlayer(point) {
        return Vector3.atan2XZ(point, this.player.transform.position);
    }
    distanceFromPlayer(point) {
        return Vector3.distance(point, this.player.transform.position);
    }
    update(delta) {
        if (!this.init) {
            return;
        }

        if (this.gameplayTime > 0.5) {
            this.updateLevelPhase();
        }
        this.gameManagerStats.Phase = this.currentPhase

        for (var i = this.collectables.length - 1; i >= 0; i--) {
            if (this.collectables[i].isDestroyed) {
                this.collectables.splice(i, 1);
            }
        }
    }

    lateUpdate(delta) {
        this.gameplayTime += delta;
        this.gameManagerStats.Time = this.gameplayTime
    }

    updateLevelPhase() {
        if (window.noEnemy) return;
        let phase = this.levelStructure.phases[this.currentPhase];
        if (this.gameplayTime > phase.duration && this.currentPhase < this.levelStructure.phases.length - 1) {
            this.currentPhase++
            this.currentPhase %= this.levelStructure.phases.length;
        }
        phase.spawnData.forEach(spawnerData => {
            let enemyData = GameStaticData.instance.getEntityByIndex('enemy', spawnerData.id)
            if (!enemyData) {
                console.log('No enemy data', spawnerData);
                return;
            }
            if (!this.entitiesByType[enemyData.id] ||
                this.entitiesByType[enemyData.id].length < spawnerData.max) {
                this.spawnEnemy(spawnerData);
            }
        });

    }
}