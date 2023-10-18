import BaseFillBar from "./BaseFillBar";
import CircleCounter from "../../../ui/hudElements/CircleCounter";
import LocalizationManager from "../../../LocalizationManager";
import RenderModule from "../../../core/modules/RenderModule";
import UIUtils from "../../../utils/UIUtils";
import Utils from "../../../core/utils/Utils";

export default class WeaponLoadingBar extends BaseFillBar {
    constructor() {
        super();

        this.gameView.layer = RenderModule.UILayerOverlay


        this.size = 14
        this.circleCounter = new CircleCounter(this.size,40)

        this.backCounter = new PIXI.Graphics().beginFill(0xffffff).drawCircle(0, 0, this.size + 1)
        this.backCounter2 = new PIXI.Graphics().beginFill(0x272822).drawCircle(0, 0, this.size)

        this.iconContainer = new PIXI.Graphics().beginFill(0x272822).drawCircle(0, 0, (this.size + 2) / 2)

        this.weaponIcon = new PIXI.Sprite.from('white-circle')
        this.weaponIcon.anchor.set(0.5)
        this.weaponIcon.visible = false;

        
        this.timerContainer = new PIXI.Container();
        this.gameView.view.addChild(this.timerContainer);
        this.timerContainer.addChild(this.backCounter);
        this.timerContainer.addChild(this.backCounter2);

        this.timerContainer.addChild(this.circleCounter);
        this.timerContainer.addChild(this.iconContainer);
        this.timerContainer.addChild(this.weaponIcon);
        this.timerContainer.y = -100
        this.timerContainer.x = 30
        
        
        this.bar.visible = false;
        
        this.infoLabel = new PIXI.Text(LocalizationManager.instance.getLabel("FTUE_WEAPON"), window.LABELS.LABEL1)
        this.infoLabel.anchor.set(0,1)
        this.infoLabel.style.fontSize = 14
        this.infoLabel.style.strokeThickness = 1
        this.infoLabel.style.dropShadowDistance=1
        this.infoLabel.style.wordWrap=150
        this.infoLabel.y = 60
        this.infoLabel.x = 0
        this.infoLabel.alpha = 0;
        this.timerContainer.addChild(this.infoLabel);
    }
    showFtue(delay = 5){
        this.infoLabel.alpha = 1;
        TweenLite.to(this.infoLabel, 0.5, {delay:delay, alpha:0})
    }
    setWeapon(weapon){
        this.weapon = weapon;
        
        console.log(this.weapon.weaponData            )
        this.weaponIcon.texture = PIXI.Texture.from(this.weapon.weaponData.entityData.icon)
        this.weaponIcon.scale.set(Utils.scaleToFit(this.weaponIcon, this.size * 1.5))
        this.weaponIcon.visible = true;

        this.circleCounter.build()
    }
    update(delta, unscaled){
        super.update(delta, unscaled);

        if(!this.weapon) return
        this.normal = this.weapon.shootNormal;

         
        this.gameView.view.x = 35
        this.gameView.view.y = 240
        this.gameView.view.scale.set(1.25)
        
        this.timerContainer.x = 0
        this.timerContainer.y = 0

        this.circleCounter.update(this.weapon.shootNormal)
    }
}
