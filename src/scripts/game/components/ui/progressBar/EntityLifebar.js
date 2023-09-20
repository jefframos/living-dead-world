import BaseFillBar from "./BaseFillBar";
import UIUtils from "../../../utils/UIUtils";
import Utils from "../../../core/utils/Utils";
import CircleCounter from "../../../ui/hudElements/CircleCounter";
import LocalizationManager from "../../../LocalizationManager";

export default class EntityLifebar extends BaseFillBar {
    constructor() {
        super();
        this.size = 14
        this.circleCounter = new CircleCounter(this.size, 40)

        this.backCounter = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, this.size + 1)
        this.backCounter2 = new PIXI.Graphics().beginFill(0x272822).drawCircle(0, 0, this.size)

        this.iconContainer = new PIXI.Graphics().beginFill(0x272822).drawCircle(0, 0, (this.size + 2) / 2)

        this.mainIcon = new PIXI.Sprite.from('white-circle')
        this.mainIcon.anchor.set(0.5)

        this.timerContainer = new PIXI.Container();
        this.gameView.view.addChild(this.timerContainer);
        this.timerContainer.addChild(this.backCounter);
        this.timerContainer.addChild(this.backCounter2);
        this.timerContainer.addChild(this.circleCounter);
        this.timerContainer.addChild(this.iconContainer);
        this.timerContainer.addChild(this.mainIcon);
        this.timerContainer.y = -100
        this.timerContainer.x = -30

        this.bar.visible = false;

        this.infoLabel = new PIXI.Text(LocalizationManager.instance.getLabel("FTUE_HEALTH"), window.LABELS.LABEL1)
        this.infoLabel.anchor.set(1, 1)
        this.infoLabel.style.fontSize = 14
        this.infoLabel.style.strokeThickness = 1
        this.infoLabel.style.dropShadowDistance = 1
        this.infoLabel.style.wordWrap=150
        this.infoLabel.y = -20
        this.infoLabel.x = 0
        this.infoLabel.alpha = 0;
        this.timerContainer.addChild(this.infoLabel);



    }
    showFtue(delay = 5){
        this.infoLabel.alpha = 1;
        TweenLite.to(this.infoLabel, 0.5, {delay:delay, alpha:0})
    }
    build(width = 50, height = 10, border = 1) {
        super.build(width, height, border);
        this.health = this.parent.health;

        this.mainIcon.texture = PIXI.Texture.from(UIUtils.getIconByAttribute('baseHealth'))
        this.mainIcon.scale.set(Utils.scaleToFit(this.mainIcon, this.size * 1.5))
        //this.circleCounter.build()
        // this.addIcon(UIUtils.getIconByAttribute("baseHealth"))
    }


    update(delta, unscaled) {
        super.update(delta, unscaled);
        this.normal = this.health.normal;

        this.circleCounter.maskedShape.tint = this.bar.fillBar.tint
        this.circleCounter.update(1 - this.health.normal)
    }
}
