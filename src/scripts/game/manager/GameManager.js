import BaseEnemy from "../entity/BaseEnemy";
import EffectsManager from "./EffectsManager";
import GameStaticData from "../data/GameStaticData";
import Layer from "../core/Layer";
import Player from "../entity/Player";
import Vector3 from "../core/gameObject/Vector3";

export default class GameManager {
    static instance;
    constructor(engine) {
        GameManager.instance = this;
        this.gameEngine = engine;
        this.gameplayEntities = [];
        this.entityRegister = [];
        this.activeEnemies = [];
        this.entitiesByType = {};

        this.gameStaticData = GameStaticData.instance;
        this.gameManagerStats = {
            GMtotalGameObjects: 0,
            GMenemiesDeaths: 0,
            Phase: 0,
            Time: 0,
        }
        window.GUI.add(this.gameManagerStats, 'GMtotalGameObjects').listen();
        window.GUI.add(this.gameManagerStats, 'GMenemiesDeaths').listen();

        window.GUI.add(this.gameManagerStats, 'Phase').listen();
        window.GUI.add(this.gameManagerStats, 'Time').listen();

        this.gameplayTime = 0;

        this.levelStructure = {
            phases: [
                {
                    duration: 60,
                    spawnData: [{
                        id: 0,
                        max: 20
                    },
                    {
                        id: 1,
                        max: 5,
                        force: true
                    }],
                },
                {
                    duration: 80,
                    spawnData: [{
                        id: 1,
                        max: 20,
                        force: true
                    }],
                },
                {
                    duration: 120,
                    spawnData: [{
                        id: 0,
                        max: 200
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
        this.init = true;
        this.gameplayTime = 0;
        this.currentPhase = 0;
        for (var i = this.activeEnemies.length - 1; i >= 0; i--) {
            this.activeEnemies[i].destroy();
        }
        this.entitiesByType = {}
    }
    spawnEnemy(id = 0) {
        let enemyData = this.gameStaticData.enemies[id];
        //find out if uses baseEnemy
        let enemy = this.addEntity(BaseEnemy, enemyData)
        let angle = Math.PI * 2 * Math.random();

        enemy.setPositionXZ(
            this.player.transform.position.x + Math.cos(angle) * 800
            , this.player.transform.position.z + Math.sin(angle) * 500)

        return enemy;
    }
    addEntity(constructor, buildParams) {


        let entity = this.gameEngine.poolGameObject(constructor, false)
        entity.build(buildParams)

        this.gameplayEntities.push(entity);

        this.gameManagerStats.GMtotalGameObjects = this.gameplayEntities.length
        //entity.gameObjectDestroyed.remove(this.removeEntity.bind(this))
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
            entity.health.gotKilledParticles.add(this.entityKilled.bind(this))

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
        if (entity.dying) return;
        EffectsManager.instance.popDamage(entity.gameObject, value)
    }

    entityKilled(entity, value) {
        this.gameManagerStats.GMenemiesDeaths++;
        EffectsManager.instance.popKill(entity.gameObject, value)
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
    update(delta) {
        if (!this.init) {
            return;
        }
        this.gameplayTime += delta;

        this.gameManagerStats.Time = this.gameplayTime

        if (this.gameplayTime > 1) {
            this.updateLevelPhase();
        }
        this.gameManagerStats.Phase = this.currentPhase
    }

    updateLevelPhase() {
        let phase = this.levelStructure.phases[this.currentPhase];
        if (this.gameplayTime > phase.duration && this.currentPhase < this.levelStructure.phases.length - 1) {
            this.currentPhase++
            this.currentPhase %= this.levelStructure.phases.length;
        }
        phase.spawnData.forEach(spawnerData => {
            if (!this.entitiesByType[this.gameStaticData.enemies[spawnerData.id].id] || this.entitiesByType[this.gameStaticData.enemies[spawnerData.id].id].length < spawnerData.max) {
                this.spawnEnemy(spawnerData.id);
            }
        });

    }
}