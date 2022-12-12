import * as PIXI from 'pixi.js';
import Signals from 'signals';
import EnemyProgressionSlot from './EnemyProgressionSlot';
import BossCounter from './BossCounter';
export default class EnemyProgressionView extends PIXI.Container {
    constructor(enemySystem) {
        super()

        this.enemySystem = enemySystem;
        this.enemySystem.onNextEnemy.add(this.updateLevel.bind(this))
        this.prevLevelContainer = new EnemyProgressionSlot(20);
        this.addChild(this.prevLevelContainer)

        this.currentLevelContainer = new EnemyProgressionSlot(25);
        this.addChild(this.currentLevelContainer)
        this.currentLevelContainer.setFontSize(22)

        this.nextLevelContainer = new EnemyProgressionSlot(20);
        this.addChild(this.nextLevelContainer)

        this.prevLevelContainer.x = - 80
        this.nextLevelContainer.x = 80


        this.bossCounter = new BossCounter(30);
        this.addChild(this.bossCounter)

        this.bossCounter.x = 250
        this.bossCounter.y = 22

    }
    setEnemySet(enemySet){
        this.enemySet = enemySet;
        this.bossCounter.addSprite(this.enemySet.portrait)
    }
    updateLevel() {
        let nextLevel = this.enemySystem.enemyLevel - 1
        let isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;

        if (this.enemySystem.enemyLevel > 1) {
            this.prevLevelContainer.updateLevel(nextLevel, isBoss)
            this.prevLevelContainer.visible = true;
        } else {
            this.prevLevelContainer.visible = false;
        }

        if(isBoss){
            //this.prevLevelContainer.addSprite(this.enemySet.portrait)
        }else{
            this.prevLevelContainer.removeSprite()
        }

        nextLevel = this.enemySystem.enemyLevel
        isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;        

        this.currentLevelContainer.updateLevel(nextLevel, isBoss)

        if(isBoss){
            this.bossCounter.updateLevel(this.enemySystem.nextBoss - 10)
            this.currentLevelContainer.addSprite(this.enemySet.portrait)
        }else{
            this.currentLevelContainer.removeSprite()
            this.bossCounter.updateLevel(this.enemySystem.nextBoss)
        }


        nextLevel = this.enemySystem.enemyLevel + 1
        isBoss = this.enemySystem.nextBoss == nextLevel || nextLevel == this.enemySystem.nextBoss - this.enemySystem.bossGap;
        this.nextLevelContainer.updateLevel(nextLevel, isBoss)

        //console.log(this.enemySystem.nextBoss)
        
        if(isBoss){
            this.nextLevelContainer.addSprite(this.enemySet.portrait)
        }else{
            this.nextLevelContainer.removeSprite()
        }
    }
}