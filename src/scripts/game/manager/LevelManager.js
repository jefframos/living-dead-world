import BaseEnemy from "../entity/BaseEnemy";
import Collectable from "../entity/Collectable";
import EffectsManager from "./EffectsManager";
import EnemyGlobalSpawner from "./EnemyGlobalSpawner";
import GameStaticData from "../data/GameStaticData";
import Layer from "../core/Layer";
import Player from "../entity/Player";
import PlayerSessionData from "../data/PlayerSessionData";
import Pool from "../core/utils/Pool";
import SessionSpawner from "./spawn/SessionSpawner";
import Vector3 from "../core/gameObject/Vector3";

export default class LevelManager {
    static instance;
    constructor(engine) {
        LevelManager.instance = this;
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
        this.gameplayTime = 0;

        this.currentLevelWaves = GameStaticData.instance.getWaves();
        
        this.levelStructure = { phases: [] }
        this.currentLevelWaves.forEach(element => {
            this.levelStructure.phases.push(Pool.instance.getElement(SessionSpawner).build(element.startAt || 0, element.duration, element.waves));
        });
       
        this.currentPhase = 0;
        this.init = false;
    }
    start(player) {
        this.player = player;


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
        this.activeSpawners = [];
        this.entitiesByType = {}
    }
    onPlayerLevelUp(xpData) {

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

        this.gameManagerStats.Phase = this.currentPhase
        if (this.gameplayTime > 0.5 && delta > 0) {            
            for (var i = 0; i < this.levelStructure.phases.length; i++){
                const phase = this.levelStructure.phases[i];
                if(phase.startAt < this.gameplayTime && (phase.startAt + phase.duration) > this.gameplayTime ){
                    this.updateLevelPhase(phase)
                }
            }
        }

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

    updateLevelPhase(phase) {
        if (window.noEnemy || !phase) return;
        phase.spawnData.forEach(spawnerData => {
            if (spawnerData.canSpawn) {

                if(Array.isArray(spawnerData.entity)){
                    let count = 0;

                    spawnerData.entity.forEach(element => {
                        if(this.entitiesByType[element]){
                            count += this.entitiesByType[element].length;
                        }
                    });
                    if(count < spawnerData.maxActive) {
                        this.spawnEnemy(spawnerData);
                    }

                }else{

                    if (!this.entitiesByType[spawnerData.entityId] ||
                        this.entitiesByType[spawnerData.entityId].length < spawnerData.maxActive) {
                            this.spawnEnemy(spawnerData);
                        }
                    }
            }
        });

    }
}