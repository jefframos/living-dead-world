import BasicFloorRender from "./BasicFloorRender";
import GameObject from "../core/gameObject/GameObject";
import GameView from "../core/view/GameView";
import LevelManager from "./LevelManager";
import Player from "../entity/Player";
import RandomGenerator from "../core/utils/RandomGenerator";
import RenderModule from "../core/modules/RenderModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import StaticViewObject from "../entity/StaticViewObject";
import Trees from "../entity/Trees";
import Utils from "../core/utils/Utils";
import WorldManager from "./WorldManager";
import alea from 'alea';
import { createNoise2D } from 'simplex-noise';

export default class EnvironmentManager extends GameObject {
    static instance;

    static Compare = {
        Less: 'less',
        More: 'more',
        Nor: 'nor',
        Between: 'between',
        Always: 'always'
    }
    constructor() {
        super()

        this.bakedData = {
            layers: []
        };

        this.patches = {
            deco: { layerName: 'deco', constructor: StaticViewObject, spriteName: 'deco00', total: 5, weight: -0.4, noise: 300, density: 3, compare: EnvironmentManager.Compare.Less },
            grass: { layerName: 'grass', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 12, compare: EnvironmentManager.Compare.Less },
            grass2: { layerName: 'grass2', constructor: StaticViewObject, list: ['grass-grass'], weight: 0.2, noise: 250, density: 12, compare: EnvironmentManager.Compare.Less },

            grass3: { layerName: 'grass3', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 40, compare: EnvironmentManager.Compare.Always },
            grass4: { layerName: 'grass4', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 40, compare: EnvironmentManager.Compare.Always },

            plants: { layerName: 'plants', constructor: StaticViewObject, spriteName: 'plants00', total: 10, weight: 0.6, noise: 100, density: 15, compare: EnvironmentManager.Compare.More },
            rocks: { layerName: 'rocks', constructor: StaticViewObject, spriteName: 'rocks00', total: 6, weight: [-0.5, 0.5], noise: 300, density: 10, compare: EnvironmentManager.Compare.Nor },
            trunks: { layerName: 'trunks', constructor: StaticViewObject, spriteName: 'trunks00', total: 2, weight: [0.5, 0.6], noise: 50, density: 8, compare: EnvironmentManager.Compare.Between },
            trees: { layerName: 'trees', constructor: Trees, list: ['tree-1', 'tree-2', 'pine-1', 'pine-2'], weight: 0.6, noise: 150, density: 8, width: 50, height: 50, compare: EnvironmentManager.Compare.More },
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

        this.rnd = new RandomGenerator(1)

        const prng = alea('seed2');
        this.noise2D = createNoise2D(prng);

        this.drawBounds = { width: 1000, height: 1000 };

        this.chunkSize = { width: 128, height: 128 }
        this.currentChunkId = { i: -1, j: -1 };
        this.nextChunkId = { i: 0, j: 0 };
        this.drawOffset = { i: 0, j: 0 };
    }

    destroy() {
        super.destroy();
    }
    start() {
        this.levelManager = LevelManager.instance;
        this.player = this.engine.findByType(Player);


        if (!this.player) {
            this.engine.callbackWhenAdding(Player, (player) => {
                this.player = player[0];

                this.updateWorldElements();
            });
        } else {
            this.updateWorldElements();

        }
        const floor = this.engine.poolGameObject(BasicFloorRender);
        floor.setTileSize(this.chunkSize.width)
        this.addChild(floor)
    }
    build(params) {
        super.build(params);


    }
    update(delta) {
        super.update(delta);


    }
    updateWorldElements() {

        //this.drawLayer(this.patches.grass3)
        this.bakedData = {}

        this.updatePlayerChunk();

        //return
        // this.drawLayer(this.patches.deco)
        // // this.drawLayer(this.patches.grass)
        // this.drawLayer(this.patches.grass2)
        // this.drawLayer(this.patches.plants)
        // this.drawLayer(this.patches.trunks)
        // this.drawLayer(this.patches.rocks)

    }
    drawLayer(layer, playerOrigin) {
        const d = layer.density
        //console.log(playerOrigin)
        const chunkW = this.drawBounds.width / layer.density//this.drawBounds.width / layer.density
        const chunkH = this.drawBounds.height / layer.density//this.drawBounds.height / layer.density
        const layerName = layer.layerName

        console.log('noise', playerOrigin, layerName, chunkH)

        if (this.bakedData[layerName]) {

            for (let index = this.bakedData[layerName].length - 1; index >= 0; index--) {
                this.bakedData[layerName][index].destroy();

            }
        }
        this.bakedData[layerName] = [];
        for (let i = -d; i <= d; i++) {
            let accum = 0;
            for (let j = -d; j <= d; j++) {
                const seed = i //* 10 + j * 35;
                // let targetPosition = {
                //     x: (playerOrigin.i * this.chunkSize.width) + i * chunkW + (this.rnd.randomOffset(seed + accum + i) * layer.noise - layer.noise / 2),
                //     y: (playerOrigin.j * this.chunkSize.height) + j * chunkH + (this.rnd.randomOffset(seed + accum + j) * layer.noise - layer.noise / 2)
                // }

                let targetPosition = {
                    x: (i + playerOrigin.i) * chunkW,//*d,//+ Math.sin(i * 0.35465)* layer.noise,//-  this.rnd.randomOffset(playerOrigin.i) * chunkW,//+ i * layer.noise - layer.noise / 2,
                    y: (j + playerOrigin.j) * chunkH //*d//+ Math.cos(j * 0.35465)* layer.noise//+ j * layer.noise - layer.noise / 2
                }


                let v = this.noise2D(i + playerOrigin.i, j + playerOrigin.j)
                let compare = false;
                // if(accum <= 1){
                //     console.log('noise',targetPosition)
                // }
                // accum++
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
                    case EnvironmentManager.Compare.Always:
                        compare = true;
                        break
                }
                if (compare) {
                    //const data = { x: targetPosition.x, z: targetPosition.y, texture: layer.list[Math.floor(0)] }
                    //const data = { x: targetPosition.x, z: targetPosition.y, texture: layer.list[Math.floor(this.rnd.randomOffset(accum) * layer.list.length)] }
                    const data = { x: targetPosition.x, z: targetPosition.y, texture: layer.list[accum % layer.list.length] }
                    data.width = layer.width;
                    data.height = layer.height;
                    //add to the random seed
                    accum++;
                    const entity = this.levelManager.addEntity(layer.constructor, data)
                    this.bakedData[layerName].push(entity)
                    this.addChild(entity)
                }
            }
            console.log(playerOrigin.i, playerOrigin.j)

        }
    }
    updatePlayerChunk() {

        this.nextChunkId.i = Math.floor((this.player.transform.position.x + this.chunkSize.width / 2) / this.chunkSize.width)
        this.nextChunkId.j = Math.floor((this.player.transform.position.z + this.chunkSize.height / 2) / this.chunkSize.height)

        if (this.nextChunkId.i != this.currentChunkId.i || this.nextChunkId.j != this.currentChunkId.j) {

            this.drawOffset.i = this.nextChunkId.i - this.currentChunkId.i
            this.drawOffset.j = this.nextChunkId.j - this.currentChunkId.j
            this.currentChunkId.i = this.nextChunkId.i
            this.currentChunkId.j = this.nextChunkId.j

            this.drawLayer(this.patches.trees, this.currentChunkId)
            this.drawLayer(this.patches.plants, this.currentChunkId)
        }
    }
    update(delta) {

        this.updatePlayerChunk();
    }
}
