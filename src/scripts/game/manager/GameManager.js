import EffectsManager from "./EffectsManager";
import Layer from "../core/Layer";
import Vector3 from "../core/gameObject/Vector3";

export default class GameManager {
    static instance;
    constructor(engine) {
        GameManager.instance = this;
        this.gameEngine = engine;
        this.gameplayEntities = [];
        this.entityRegister = [];
        this.activeEnemies = [];

        this.gameManagerStats = {
            LtotalGameObjects: 0
        }
        window.GUI.add(this.gameManagerStats, 'LtotalGameObjects').listen();

        console.log('when registering, some times i remove the events that are beign used in other places')
    }
    addEntity(constructor, autoBuild = false) {

        
        let entity = this.gameEngine.poolGameObject(constructor, autoBuild)

        this.gameplayEntities.push(entity);

        this.gameManagerStats.LtotalGameObjects = this.gameplayEntities.length
        //entity.gameObjectDestroyed.remove(this.removeEntity.bind(this))
        entity.gameObjectDestroyed.addOnce(this.removeEntity.bind(this))

        if(entity.layerCategory && entity.layerCategory == Layer.Enemy){
            this.activeEnemies.push(entity)
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

        if(entity.layerCategory && entity.layerCategory == Layer.Enemy){
            this.activeEnemies = this.activeEnemies.filter(item => item !== entity)
        }
    }
    entityDamaged(entity, value) {
        EffectsManager.instance.popDamage(entity.gameObject, value)
    }

    entityKilled(entity, value) {
        EffectsManager.instance.popKill(entity.gameObject, value)
    }
    findClosestEnemy(point){
        let closest = 0;
        let minDist = 999999;
        for (var i = 0; i < this.activeEnemies.length; i++){
            let enemy = this.activeEnemies[i];

            let dist = Vector3.distance(enemy.transform.position, point)
            if(dist < minDist){
                minDist = dist;
                closest = i;
            }
        }

        return this.activeEnemies[closest];
    }
}