import Game from "../../Game";
import GameView from "../core/view/GameView";
import Layer from "../core/Layer";
import StaticPhysicObject from "./StaticPhysicObject";
import TagManager from "../core/TagManager";
import Utils from "../core/utils/Utils";

export default class Trees extends StaticPhysicObject {
    constructor() {
        super();
        this.gameView.tag = TagManager.Tags.Occlusion;
        
    }
    start()
    {
        super.start();
    }
    build(params) {
        super.build(params)
        
        this.gameView.view.scale.set(0.5)
        this.gameView.view.anchor.set(0.5, 1)

        this.gameView.view.texture = PIXI.Texture.from(Utils.findValueOrRandom(params.texture));
        this.layerCategory = Layer.Environment
        this.layerMask = Layer.EnvironmentCollision

        this.skewValue = Math.random() * Math.PI * 2;
        this.skewSpeed = Math.random() * 0.2 + 0.2;
    }
    update(delta) {
        super.update(delta);

        this.gameView.update(delta)

        this.skewValue = Game.Time + this.transform.position.z;

        this.gameView.view.skew.x = Math.cos(this.skewValue) * 0.1

    }
}