import GameObject from "../core/GameObject";

export default class EffectsManager extends GameObject {
    static instance;
    constructor(container, gameContainer) {
        super();
        EffectsManager.instance = this;
        this.effectsContainer = container;
        this.gameContainer = gameContainer;

        this.labels = [];
this.news = 0
        this.damageFontPool = [];
    }

    update(delta) {
        this.effectsContainer.pivot.x = this.gameContainer.pivot.x
        this.effectsContainer.pivot.y = this.gameContainer.pivot.y

        this.effectsContainer.x = this.gameContainer.x
        this.effectsContainer.y = this.gameContainer.y
        
        //for (let index = 0; index < this.labels.length; index++) {
        for (let index = this.labels.length-1; index >=0; index--) {
            this.labels[index].alpha -= delta * 2;
            if(this.labels[index].alpha <= 0){
                this.damageFontPool.push(this.labels[index]);
                this.labels.splice(index,1)
            }

        }
    }
    popDamage(entity, value) {
       // console.log(entity.engineID)
        let text = this.getDamageFont()
        text.alpha = 1
        text.text = value
        text.x = entity.gameView.x
        text.y = entity.gameView.y
        text.anchor.set(0.5)
        this.labels.push(text)
        this.effectsContainer.addChild(text)
    }

    getDamageFont() {

        if (this.damageFontPool.length > 0) {
            let element = this.damageFontPool.pop();
            return element;
        }
        let newElement = new PIXI.BitmapText("150", { fontName: 'damage1' });
        this.news++
        return newElement;

    }
}