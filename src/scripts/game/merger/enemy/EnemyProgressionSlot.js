import * as PIXI from 'pixi.js';
import Signals from 'signals';
export default class EnemyProgressionSlot extends PIXI.Container {
    constructor(size) {
        super()

        this.size = size;

        this.backShape = new PIXI.Sprite.from('backTilesSmall')
        this.backShape.width = size * 2
        this.backShape.height = size * 2
        this.backShape.alpha = 0.5
        this.backShape.anchor.set(0.5)
        this.addChild(this.backShape)

        
        this.bossSprite = new PIXI.Sprite.from('backTilesSmall')
        this.bossSprite.width = size * 2
        this.bossSprite.height = size * 2
        this.bossSprite.anchor.set(0.5)
        this.bossSprite.y = -5
        this.addChild(this.bossSprite)


        this.levelLabel = new PIXI.Text('0', window.LABELS.LABEL2)
        this.levelLabel.style.stroke = 0xFFFF45
        this.levelLabel.style.strokeThickness = 4
        this.levelLabel.style.fontWeight = 900
        this.levelLabel.style.fontSize = 24
        this.addChild(this.levelLabel)

    }
    addSprite(sprite){
        this.bossSprite.visible = true;
        this.bossSprite.texture = new PIXI.Texture.from(sprite)
    }

    removeSprite(){
        this.bossSprite.visible = false;
    }
    updateLevel(level, isboss = false) {
        this.levelLabel.text = level
        this.levelLabel.pivot.x = this.levelLabel.width / 2
        this.levelLabel.y = 5

        this.levelLabel.style.stroke = isboss ? 0xff2255 :0xFFFF45
    }
    setFontSize(size) {
        this.levelLabel.style.fontSize = size
    }
}