import BasicFloorRender from "./BasicFloorRender";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LevelManager from "./LevelManager";
import Player from "../entity/Player";
import PlayerHalo from "./PlayerHalo";
import RenderModule from "../core/modules/RenderModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import StaticViewObject from "../entity/StaticViewObject";
import Trees from "../entity/Trees";
import WorldManager from "./WorldManager";
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';

export default class EnvironmentManager extends GameObject {
    static instance;

    static Compare = {
        Less: 'less',
        More: 'more',
        Nor: 'nor',
        Between: 'between'
    }
    constructor() {
        super()


        this.patches = {
            deco: { constructor: StaticViewObject, spriteName: 'deco00', total: 5, weight: -0.4, noise: 300, density: 3, compare: EnvironmentManager.Compare.Less },
            grass: { constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 12, compare: EnvironmentManager.Compare.Less },
            plants: { constructor: StaticViewObject, spriteName: 'plants00', total: 10, weight: 0.6, noise: 100, density: 15, compare: EnvironmentManager.Compare.More },
            rocks: { constructor: StaticViewObject, spriteName: 'rocks00', total: 6, weight: [-0.5, 0.5], noise: 300, density: 10, compare: EnvironmentManager.Compare.Nor },
            trunks: { constructor: StaticViewObject, spriteName: 'trunks00', total: 2, weight: [0.5, 0.6], noise: 50, density: 8, compare: EnvironmentManager.Compare.Between },
            trees: { constructor: Trees, list: ['tree-1', 'tree-2','pine-1', 'pine-2'], weight: 0.6, noise: 150, density: 12, width: 50, height: 50, compare: EnvironmentManager.Compare.More },
        }

        for (const key in this.patches) {
            const element = this.patches[key];
            if (!element.list) {

                element.list = [];

                for (let index = 1; index <= element.total; index++) {
                    element.list.push(element.spriteName + (index < 10 ? '0' + index : index))
                }
            }

        }

        const prng = alea('seed2');
        this.noise2D = createNoise2D(prng);

        this.drawBounds = { width: 1000, height: 800 };
    }
    destroy(){
        super.destroy();
        }
    start() {
        this.levelManager = LevelManager.instance;
        this.player = this.engine.findByType(Player);


        
        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];

                this.addWorldElements();
            });
        }else{
            this.addWorldElements();

        }

        this.addChild(this.engine.poolGameObject(BasicFloorRender))
    }
    build(params) {
        super.build(params);


    }
    update(delta) {
        super.update(delta);


    }
    addWorldElements() {

        this.drawLayer(this.patches.trees)
        this.drawLayer(this.patches.deco)
        this.drawLayer(this.patches.grass)
        this.drawLayer(this.patches.plants)
        this.drawLayer(this.patches.trunks)
        this.drawLayer(this.patches.rocks)

    }
    drawLayer(layer) {
        const d = layer.density
        const chunkW = this.drawBounds.width / layer.density
        const chunkH = this.drawBounds.height / layer.density

        for (let i = -d; i <= d; i++) {
            for (let j = -d; j <= d; j++) {
                let targetPosition = { x: this.player.transform.position.x + i * chunkW + (Math.random() * layer.noise - layer.noise / 2), y: this.player.transform.position.z + j * chunkH + (Math.random() * layer.noise - layer.noise / 2) }
                let v = this.noise2D(i / d, j / d)

                let compare = false;
                switch (layer.compare) {
                    case EnvironmentManager.Compare.More:
                        compare = v > layer.weight
                        break
                    case EnvironmentManager.Compare.Less:
                        compare = v < layer.weight
                        break
                        case EnvironmentManager.Compare.Between:
                        compare = v > layer.weight[0] && v < layer.weight[1]
                        break
                        case EnvironmentManager.Compare.Nor:
                        compare = v < layer.weight[0] || v > layer.weight[1]

                        break
                }
                if (compare) {
                    const data = { x: targetPosition.x, z: targetPosition.y, texture: layer.list }
                    data.width = layer.width;
                    data.height = layer.height;
                    
                    this.addChild(this.levelManager.addEntity(layer.constructor, data))
                }
            }

        }
    }
    addWorldElementsOld() {
        // return
        let i = 5
        let j = 8
        let chunkX = (config.width * 2) / i
        let chunkY = (config.height * 2) / j
        for (let index = 0; index <= i; index++) {
            for (let indexj = 0; indexj <= j; indexj++) {
                let targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX / 2), y: chunkY * indexj - 500 + (Math.random() * chunkY / 2) }
                if (Math.random() < 0.5) {
                    this.levelManager.addEntity(Trees, { x: targetPosition.x, y: targetPosition.y, width: 50, height: 50 })
                } else {

                }

            }
        }


        for (let index = 0; index <= i; index++) {
            for (let indexj = 0; indexj <= j; indexj++) {
                for (let index = 0; index < 8; index++) {
                    let targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX), y: chunkY * indexj - 500 + (Math.random() * chunkY) }
                    this.levelManager.addEntity(StaticViewObject, { x: targetPosition.x, z: targetPosition.y, texture: this.patches.grass.list })

                    targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX), y: chunkY * indexj - 500 + (Math.random() * chunkY) }
                    this.levelManager.addEntity(StaticViewObject, { x: targetPosition.x, z: targetPosition.y, texture: this.patches.plants.list })

                    targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX), y: chunkY * indexj - 500 + (Math.random() * chunkY) }
                    this.levelManager.addEntity(StaticViewObject, { x: targetPosition.x, z: targetPosition.y, texture: this.patches.rocks.list })


                }
                let targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX), y: chunkY * indexj - 500 + (Math.random() * chunkY) }
                this.levelManager.addEntity(StaticViewObject, { x: targetPosition.x, z: targetPosition.y, texture: this.patches.deco.list })

                targetPosition = { x: chunkX * index - 500 + (Math.random() * chunkX), y: chunkY * indexj - 500 + (Math.random() * chunkY) }
                this.levelManager.addEntity(StaticViewObject, { x: targetPosition.x, z: targetPosition.y, texture: this.patches.trunks.list })
            }
        }
    }
}
