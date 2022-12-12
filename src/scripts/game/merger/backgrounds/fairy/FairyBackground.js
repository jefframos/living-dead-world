import FairyCastleBackground from "./FairyCastleBackground";
import InteractiveBackgrounds from "../InteractiveBackgrounds";
import PuzzleFairyBackground from "./PuzzleFairyBackground";

export default class FairyBackground extends InteractiveBackgrounds {
    constructor() {
        super();
       
    }

    build(){
 
        this.castleBackground = new FairyCastleBackground();
        this.puzzleBackground = new PuzzleFairyBackground();
        this.addChildAt(this.puzzleBackground, 0);
        this.addChildAt(this.castleBackground, 0);

        this.zero = new PIXI.Graphics().beginFill(0x00FF00).drawCircle(0, 0, 50,)
        //this.addChild(this.zero)
        this.zero.alpha = 0.5
    }
    
    resize(resolution, innerResolution) {
        if(!innerResolution || !innerResolution.height) return
        var topRight = game.getBorder('topRight', this.parent)
        var toGlobalBack = this.toLocal({ x: 0, y: innerResolution.height })

        this.puzzleBackground.resize(resolution, innerResolution)
        this.castleBackground.resize(resolution, innerResolution)
        if (!window.isPortrait) {

            this.puzzleBackground.pivot.x = this.puzzleBackground.usableArea.x
            this.puzzleBackground.pivot.y = this.puzzleBackground.usableArea.height + this.puzzleBackground.usableArea.y
            this.puzzleBackground.x = toGlobalBack.x + 20//toGlobalBack.x + 390
            this.puzzleBackground.y = config.height / 2 + 20
            let scale = Math.min(
                topRight.x / this.puzzleBackground.usableArea.width * 0.6,
                config.height / this.puzzleBackground.usableArea.height * 0.9)
            this.puzzleBackground.scale.set(scale)


            this.castleBackground.x = toGlobalBack.x + (this.puzzleBackground.usableArea.width + 100) * scale

            scale = Math.min((topRight.x - this.castleBackground.x) / this.castleBackground.usableArea.width * 0.75, config.height / this.castleBackground.usableArea.height * 0.9)
            scale = Math.max(0.55, scale)
            this.castleBackground.scale.set(scale)
            this.castleBackground.pivot.x = this.castleBackground.usableArea.x
            this.castleBackground.pivot.y = this.castleBackground.usableArea.height + this.castleBackground.usableArea.y
            this.castleBackground.y = config.height * 0.85 * 0.5




        } else {
            this.puzzleBackground.pivot.x = 0
            this.puzzleBackground.pivot.y = 80
            this.puzzleBackground.scale.set(1)
            this.puzzleBackground.x = 0
            this.puzzleBackground.y = -100

            this.castleBackground.pivot.x = 0
            this.castleBackground.pivot.y = 0
            this.castleBackground.x = 0
            this.castleBackground.y = -200
            this.castleBackground.scale.set(0.8)
            

        }
    }
}