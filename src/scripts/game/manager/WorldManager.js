
import { generate } from "tguesdon-island-generator"
import Voronoi from "voronoi";
import utils from "../../utils";
import RandomGenerator from "../core/RandomGenerator";
import grahamScan from "graham-scan";
export default class WorldManager {
    static instance;
    constructor(container) {
        WorldManager.instance = this;
        this.container = container;

        this.width = 500
        this.height = 500
        // this.square = new PIXI.Graphics().beginFill(0).drawRect(0, 0, this.width, this.height)
        // this.container.addChild(this.square)

        // const island = generate(this.width, this.height);
        //const voro = new voronoi()
        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: this.width, yt: 0, yb: this.height };
        var sites = []

        this.randomGenerator = new RandomGenerator(Math.random());

        let lines = 11
        let cols = 9
        let cellSize = { width: this.width / lines, height: this.height / cols }
        for (let i = 0; i <= lines; i++) {
            for (let j = 0; j <= cols; j++) {
                let ang = Math.atan2(j - cols / 2, i - lines / 2)

                let dist = utils.distance(i, j, cols / 2, lines / 2) / lines
                sites.push({
                    x: (cellSize.width) * i + Math.cos(ang) * dist + (this.randomGenerator.random() * cellSize.width - cellSize.width / 2),
                    y: (cellSize.height) * j + Math.sin(ang) * 50 + (this.randomGenerator.random() * cellSize.height - cellSize.height / 2)//* dist
                })
            }
        }


        var diagram = voronoi.compute(sites, bbox);
        ///https://www.npmjs.com/package/voronoi
        //console.log(diagram)
        this.cellsContainer = new PIXI.Container();
        this.container.addChild(this.cellsContainer)

        this.numbersContainer = new PIXI.Container();
        this.container.addChild(this.numbersContainer)

        // this.container.addChild(this.drawMap(island))
        // this.container.scale.set(2)
        let done = false

        let count = 0
        diagram.cells.forEach(element => {
            //console.log(element)
            if (element.halfedges.length && element.site.x > 0 && element.site.y > 0 && element.site.x < this.width && element.site.y < this.height && !done) {


                let mid = new PIXI.BitmapText(element.site.voronoiId.toString(), { fontName: 'damage1' });
                mid.anchor.set(0.5)
                mid.x = element.site.x
                mid.y = element.site.y

                //gr.lineTo(element.halfedges[0].edge.vb.x, element.halfedges[0].edge.vb.y)
                let toAdd = []
                let onBounds = true;
                for (let index = 0; index < element.halfedges.length; index++) {
                    const edge = element.halfedges[index];

                    let edgeA = { x: edge.edge.va.x, y: edge.edge.va.y }
                    let edgeB = { x: edge.edge.vb.x, y: edge.edge.vb.y }

                    toAdd = toAdd.filter(item => item.x !== edgeA.x && item.y !== edgeA.y)
                    toAdd.push(edgeA)

                    toAdd = toAdd.filter(item => item.x !== edgeB.x && item.y !== edgeB.y)
                    toAdd.push(edgeB)

                    if (onBounds) {
                        onBounds = this.onBounds(edge.edge.va)
                    }
                    if (onBounds) {
                        onBounds = this.onBounds(edge.edge.vb)
                    }
                }
                if (onBounds) {
                    console.log(element.site.voronoiId, element.getNeighborIds(), 'create my data to point to neibors and stuff')

                    let gr = new PIXI.Graphics();
                    gr.lineStyle(2, 0x999999)
                    gr.beginFill(0x555555 * Math.random())


                    let toScan = []
                    toAdd.forEach(v => {
                        toScan.push([v.x, v.y])
                    });
                    toScan = grahamScan(toScan);

                    let toAdd2 = []

                    toScan.forEach(result => {
                        toAdd2.push({ x: result[0], y: result[1] })
                    });
                    gr.moveTo(toAdd2[0].x, toAdd2[0].y)
                    for (let v = 1; v < toAdd2.length; v++) {
                        const vertex = toAdd2[v];
                        gr.lineTo(vertex.x, vertex.y)
                    }
                    gr.lineTo(toAdd2[0].x, toAdd2[0].y)
                    this.cellsContainer.addChild(gr)
                    this.numbersContainer.addChild(mid)
                    mid.scale.set(0.8)
                }
            }
        });

        this.container.visible = false;

    }
    onBounds(edge) {
        return edge.x > 0 && edge.x < this.width && edge.y > 0 && edge.y < this.height
    }    
}