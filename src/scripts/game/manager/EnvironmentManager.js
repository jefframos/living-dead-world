import BasicFloorRender from "./BasicFloorRender";
import Camera from "../core/Camera";
import Game from "../../Game";
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
            deco: { layerName: 'deco', constructor: StaticViewObject, spriteName: 'deco00', total: 5, weight: -0.4, noise: 300, density: 2, compare: EnvironmentManager.Compare.Less },
            grass: { layerName: 'grass', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 5, compare: EnvironmentManager.Compare.Less },
            grass2: { layerName: 'grass2', constructor: StaticViewObject, list: ['grass-grass'], weight: 0.2, noise: 250, density: 5, compare: EnvironmentManager.Compare.Less },

            grass3: { layerName: 'grass3', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 5, compare: EnvironmentManager.Compare.Always },
            grass4: { layerName: 'grass4', constructor: StaticViewObject, spriteName: 'grass-patches00', total: 6, weight: 0.2, noise: 250, density: 5, compare: EnvironmentManager.Compare.Always },

            plants: { layerName: 'plants', constructor: StaticViewObject, spriteName: 'plants00', total: 10, weight: 0.5, noise: 100, density: 3, compare: EnvironmentManager.Compare.More },
            rocks: { layerName: 'rocks', constructor: StaticViewObject, spriteName: 'rocks00', total: 6, weight: [-0.5, 0.5], noise: 300, density: 2, compare: EnvironmentManager.Compare.Nor },
            trunks: { layerName: 'trunks', constructor: StaticViewObject, spriteName: 'trunks00', total: 2, weight: [0.5, 0.6], noise: 50, density: 2, compare: EnvironmentManager.Compare.Between },
            trees: { layerName: 'trees', constructor: Trees, list: ['tree-1', 'tree-2', 'pine-1', 'pine-2'], weight: 0.5, noise: 150, density: 1, width: 50, height: 50, compare: EnvironmentManager.Compare.More },
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

        this.drawBounds = { width: 800, height: 800 };
        this.drawBoundsDistance = { i: 4, j: 4 };

        this.chunkSize = { width: 256, height: 256 }
        this.currentChunkId = { i: -11111111, j: -11111111 };
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

        this.bakedData = {}
        this.updatePlayerChunk();

    }
    drawLayer(layer, playerOrigin) {
        this.drawBounds.width = this.drawBoundsDistance.i * this.chunkSize.width
        this.drawBounds.height = this.drawBoundsDistance.j * this.chunkSize.height

        const layerName = layer.layerName

        if (this.bakedData[layerName]) {

            for (let index = this.bakedData[layerName].length - 1; index >= 0; index--) {
                this.bakedData[layerName][index].destroy();

            }
        }
        this.bakedData[layerName] = [];
        for (let i = -this.drawBoundsDistance.i; i <= this.drawBoundsDistance.i; i++) {
            for (let j = -this.drawBoundsDistance.j; j <= this.drawBoundsDistance.j; j++) {
                for (let k = 0; k <= layer.density; k++) {
                    let v = this.noise2D((i + playerOrigin.i)*0.5, (j + playerOrigin.j) * 0.5)
                    let targetPosition = {
                        x: (i + playerOrigin.i) * this.chunkSize.width + this.rnd.randomOffset(v + k + this.totalLayersDraw) * this.chunkSize.width - this.chunkSize.width / 2,
                        y: (j + playerOrigin.j) * this.chunkSize.height + this.rnd.randomOffset(v - k + this.totalLayersDraw) * this.chunkSize.height - this.chunkSize.height / 2
                    }

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
                        case EnvironmentManager.Compare.Always:
                            compare = true;
                            break
                    }
                    if (compare) {
                        const data = { x: targetPosition.x, z: targetPosition.y, texture: layer.list[Math.floor(this.rnd.randomOffset(v + this.totalLayersDraw * layer.list.length) * layer.list.length)] }
                        data.width = layer.width;
                        data.height = layer.height;
                        const entity = this.levelManager.addEntity(layer.constructor, data)
                        this.bakedData[layerName].push(entity)
                        this.addChild(entity)
                    }
                }
            }
        }
        this.totalLayersDraw += 2.15;
    }
    updatePlayerChunk() {

        this.nextChunkId.i = Math.floor((this.player.transform.position.x + this.chunkSize.width / 2) / this.chunkSize.width)
        this.nextChunkId.j = Math.floor((this.player.transform.position.z + this.chunkSize.height / 2) / this.chunkSize.height)

        if (this.nextChunkId.i != this.currentChunkId.i || this.nextChunkId.j != this.currentChunkId.j) {

            this.drawOffset.i = this.nextChunkId.i - this.currentChunkId.i
            this.drawOffset.j = this.nextChunkId.j - this.currentChunkId.j
            this.currentChunkId.i = this.nextChunkId.i
            this.currentChunkId.j = this.nextChunkId.j

            this.drawAllLayers();

        }
    }
    drawAllLayers() {
        this.totalLayersDraw = 0;
        this.drawLayer(this.patches.rocks, this.currentChunkId)
        this.drawLayer(this.patches.grass2, this.currentChunkId)
        this.drawLayer(this.patches.plants, this.currentChunkId)
        this.drawLayer(this.patches.trunks, this.currentChunkId)

        this.drawLayer(this.patches.trees, this.currentChunkId)
    }
    update(delta) {

        this.updatePlayerChunk();

    }
    resize(res, newRes) {
        const nextI = Math.ceil(res.width * Game.GlobalScale.max / this.chunkSize.width) + 1
        const nextJ = Math.ceil(res.height * Game.GlobalScale.max / this.chunkSize.height) + 1

        let redraw = false;
        if (this.drawBoundsDistance.i != nextI || this.drawBoundsDistance.j != nextJ) {
            redraw = true;
        }
        this.drawBoundsDistance.i = nextI
        this.drawBoundsDistance.j = nextJ

        if (redraw) {
            this.drawAllLayers();

        }
    }
}
