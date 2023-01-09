import EffectsManager from "./EffectsManager";

export default class GameManager {
    static instance;
    constructor(engine) {
        GameManager.instance = this;
        this.gameEngine = engine;
        this.gameplayEntities = [];
        this.entityRegister = [];

        this.gameManagerStats = {
            totalGameObjects: 0
        }
        window.GUI.add(this.gameManagerStats, 'totalGameObjects').listen();

        console.log('when registering, some times i remove the events that are beign used in other places')
    }
    addEntity(constructor, autoBuild = false) {
        let entity = this.gameEngine.poolGameObject(constructor, autoBuild)

        this.gameplayEntities.push(entity);

        this.gameManagerStats.totalGameObjects = this.gameplayEntities.length
        entity.gameObjectDestroyed.remove(this.removeEntity.bind(this))
        entity.gameObjectDestroyed.add(this.removeEntity.bind(this))

        this.registerEntity(entity)
        return entity;
    }
    registerEntity(entity) {
        if (entity.health) {
            entity.health.gotDamaged.removeAll()
            entity.health.gotDamaged.add(this.entityDamaged.bind(this))
            
            //entity.health.gotKilledParticles.removeAll()
            //entity.health.gotKilledParticles.add(this.entityKilled.bind(this))

            this.entityRegister.push();
        }
    }
    removeEntity(entity) {
        this.entityRegister = this.entityRegister.filter(item => item !== entity)
        this.gameplayEntities = this.gameplayEntities.filter(item => item !== entity)
        this.gameManagerStats.totalGameObjects = this.gameplayEntities.length
    }
    entityDamaged(entity, value) {
        EffectsManager.instance.popDamage(entity.gameObject, value)
    }

    entityKilled(entity, value) {
        EffectsManager.instance.popKill(entity.gameObject, value)
    }
}