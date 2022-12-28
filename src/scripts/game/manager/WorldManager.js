
import { generate } from "tguesdon-island-generator"
import Voronoi from "voronoi";
import utils from "../../utils";
export default class WorldManager {
    static instance;
    constructor(container) {
        WorldManager.instance = this;
        this.container = container;

        this.width = 50
        this.height = 50
        this.square = new PIXI.Graphics().beginFill(0).drawRect(0, 0, this.width, this.height)
        //this.container.addChild(this.square)

        const island = generate(this.width, this.height);
        //const voro = new voronoi()
        var voronoi = new Voronoi();
        var bbox = { xl: 0, xr: 800, yt: 0, yb: 600 }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        var sites = [{ x: 200, y: 200 }, { x: 50, y: 250 }, { x: 400, y: 100 } /* , ... */];

        // a 'vertex' is an object exhibiting 'x' and 'y' properties. The
        // Voronoi object will add a unique 'voronoiId' property to all
        // sites. The 'voronoiId' can be used as a key to lookup the associated cell
        // in diagram.cells.

        var diagram = voronoi.compute(sites, bbox);
        console.log(diagram)

        ///https://www.npmjs.com/package/voronoi

        // this.container.addChild(this.drawMap(island))
        // this.container.scale.set(2)

    }

    drawMap(island) {

        let container = new PIXI.Container();
        let gr = new PIXI.Graphics();
        console.log(island.points)
        for (let x = 0; x < island.points.length; x++) {
            for (let y = 0; y < island.points[x].length; y++) {
                let point = island.points[x][y];
                //console.log
                gr.beginFill(point.elevation > 0.25 ? 0xFFFFFF : 0, 1);
                gr.drawRect(x, y, 1, 1);
            }
        }
        container.addChild(gr)
        return container//utils.generateSpriteFromContainer('map',container,[])
    }
}