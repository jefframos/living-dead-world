import * as PIXI from 'pixi.js';

import EnemyProgressionView from '../enemy/EnemyProgressionView';
import ProgressBar from '../ProgressBar';
import Signals from 'signals';
import StandardEnemy from '../enemy/StandardEnemy';
import UIButton1 from '../../ui/UIButton1';
import config from '../../../config';
import utils from '../../../utils';
import UILabelButton1 from '../../ui/UILabelButton1';

export default class EnemySystem {
    constructor(containers, baseEnemies) {
        this.container = containers.mainContainer;
        this.baseEnemies = baseEnemies;
        this.onPopLabel = new Signals();
        this.onNextEnemy = new Signals();
        this.onParticles = new Signals();
        this.onGetResources = new Signals();
        this.onChangeEnemySet = new Signals();

        this.mainEnemy = new StandardEnemy();
        this.container.addChild(this.mainEnemy);

        this.enemyProgressionView = new EnemyProgressionView(this);
        this.container.addChild(this.enemyProgressionView);

        this.allEnemies = {}
        this.baseEnemies.list.forEach(element => {
            this.allEnemies[element.id] = element;
        });

        this.enemiesIds = []

        this.enemiesIds.push(this.baseEnemies.levels[0].available[Math.floor(this.baseEnemies.levels[0].available.length * Math.random())]);
        for (let index = 1; index < 1000; index++) {
            let id = 0;

            if (index % 5 == 0 || (index > 80 && index % 3 == 0)) {
                id = 1
            }
            let next = this.baseEnemies.levels[id].available[Math.floor(this.baseEnemies.levels[id].available.length * Math.random())];
            while (next == this.enemiesIds[index - 1]) {
                next = this.baseEnemies.levels[id].available[Math.floor(this.baseEnemies.levels[id].available.length * Math.random())]
            }
            this.enemiesIds.push(next);
        }


        //color, icon, iconColor =0xFFFFFF, width = 40, height = 40

        this.invokeBossBattle = new UILabelButton1( 150, 60, 'boss-button')
        this.invokeBossBattle.addCenterLabel(window.localizationManager.getLabel('boss-fight'))
        //this.invokeBossBattle.updateIconScale(0.8)
        this.container.addChild(this.invokeBossBattle)
        this.invokeBossBattle.x = 240
        this.invokeBossBattle.y = 60
        this.invokeBossBattle.onClick.add(() => {
            this.invokeBoss()
        })

        this.enemyProgressionView.y = - 35

        this.enemyStartLife = 10;
        this.enemyLife = 10;
        this.enemyCurrentLife = 10;
        this.lifeCoefficient = 1.07
        this.enemyLevel = 1;
        this.nextBoss = 10;
        this.bossGap = 10;

        this.enemyLifeBar = new ProgressBar({ width: 200, height: 24 }, 4, 4);
        this.enemyLifeBar.updateBackgroundFront(0xff0000)
        this.enemyLifeBar.updateBackgroundColor(0x330000)

        this.container.addChild(this.enemyLifeBar)
        this.enemyLifeBar.pivot.x = this.enemyLifeBar.width / 2
        this.enemyLifeBar.y = -2


        this.bossBattleTimer = new ProgressBar({ width: 200, height: 12 }, 3, 3);
        this.bossBattleTimer.updateBackgroundFront(0xff9000)
        this.bossBattleTimer.updateBackgroundColor(0x331000)
        this.container.addChild(this.bossBattleTimer)
        this.bossBattleTimer.pivot.x = this.bossBattleTimer.width / 2
        this.bossBattleTimer.y = 15

        this.bossTimerLabel = new PIXI.Text('', LABELS.LABEL1);
        this.bossTimerLabel.style.fontSize = 12
        this.container.addChild(this.bossTimerLabel)

        this.bossTimerLabel.x = this.bossBattleTimer.x + this.bossBattleTimer.width / 2 + 5
        this.bossTimerLabel.y = this.bossBattleTimer.y - 3


        this.label = new PIXI.Text('', LABELS.LABEL1);
        this.label.style.fontSize = 16
        this.label.style.stroke = 0
        this.label.style.strokeThickness = 4
        this.container.addChild(this.label)


        this.mainEnemy.y = 80
        this.lockOnLevel = false;
        this.sortNextEnemy();
        this.loadData();
        this.sortNextEnemy();
        this.updateEnemyLife();

        this.damageColors = [0xec3e3e, 0xff9000, 0xffd200]

        this.enemyDeathTimer = 0;
        this.bossTimer = 0;
        this.bossDefaultTimer = 60;

        this.updateLevelView();
        this.mainEnemy.setAsEnemy(this.getNextEnemySprite());

        setTimeout(() => {
            this.onChangeEnemySet.dispatch(this.currentEnemySet);
        }, 10);


    }
    sortNextEnemy() {
        let levelID = Math.floor(this.enemyLevel / 10)
        if (this.enemiesIds[levelID] != this.currentEnemySetID) {
            this.currentEnemySetID = this.enemiesIds[levelID];

            this.currentEnemySet = this.allEnemies[this.currentEnemySetID]
            this.onChangeEnemySet.dispatch(this.currentEnemySet);
        }


        this.enemyProgressionView.setEnemySet(this.currentEnemySet, this.allEnemies[this.enemiesIds[levelID + 1]])

    }
    resetSystem() {
        this.updateLevelView();
        this.enemyLevel = 0
        COOKIE_MANAGER.saveEnemyLevel(1);
        this.lockOnLevel = false;
        this.inABossBattle = false;
        this.nextEnemy();
    }
    loadData() {
        this.savedProgression = COOKIE_MANAGER.getProgression();
        this.enemyLevel = this.savedProgression.currentEnemyLevel;
        this.calcNextBoss();

        if (this.enemyLevel % this.bossGap == 0) {
            this.bankBoss()
        } else {
            this.enemyCurrentLife = this.savedProgression.currentEnemyLife
        }
    }
    calcNextBoss() {
        this.nextBoss = this.enemyLevel + this.bossGap - this.enemyLevel % this.bossGap;
    }
    getEnemy() {
        return this.mainEnemy;
    }
    update(delta) {

        this.invokeBossBattle.visible = this.lockOnLevel && !this.inABossBattle;


        if (this.enemyDeathTimer > 0) {
            this.enemyDeathTimer -= delta;
            this.updateVisibleUI();
            return;
        } else if (this.enemyDeathTimer < 0.5) {
            this.mainEnemy.alpha = utils.lerp(this.mainEnemy.alpha, 1, delta * 2);
        }

        if (this.inABossBattle && this.bossTimer > 0) {
            this.bossTimer -= delta;
            this.bossBattleTimer.setProgressBar(this.bossTimer / this.bossDefaultTimer, 0xFF00FF)

            this.bossTimerLabel.text = this.bossTimer.toFixed(1)

            if (this.bossTimer <= 0) {
                this.bankBoss();
            }
        } else {
            this.bossTimerLabel.text = '';
        }
        this.updateVisibleUI();


        this.mainEnemy.update(delta)
        this.enemyLifeBar.setProgressBar(this.enemyCurrentLife / this.enemyLife, 0xFF0000)



        this.updateLifeLabel();


    }
    updateMouse(e) {

    }
    updateLevelView() {
        this.enemyProgressionView.updateLevel();
    }
    isAlive() {
        return this.enemyDeathTimer <= 0;
    }
    invokeBoss() {
        this.setAsBos();
    }
    bankBoss() {
        this.lockOnLevel = true;
        this.inABossBattle = false;

        this.nextEnemy(true);
    }
    setAsBos() {

        this.updateEnemyLife(true);
        this.inABossBattle = true;
        this.mainEnemy.setAsBoss(this.getNextBossSprite());
        this.bossTimer = this.bossDefaultTimer;
        this.enemyDeathTimer = 2;
        this.mainEnemy.alpha = 0;
        this.updateLevelView();
        this.calcNextBoss();


    }
    getNextEnemySprite() {
        var pref = this.currentEnemySet.prefix;
        var id = Math.floor(Math.random() * this.currentEnemySet.max - 1) + this.currentEnemySet.min;
        id = Math.max(id, 1)
        return pref.replace("$", id);
    }
    getNextBossSprite() {
        var pref = this.currentEnemySet.prefix;
        return pref.replace("$", this.currentEnemySet.max);
    }
    nextEnemy(bossWin = false) {
        if (!this.lockOnLevel) {
            this.enemyLevel++;
            this.inABossBattle = false;
        }
        this.enemyDeathTimer = 1;
        this.mainEnemy.alpha = 0;
        COOKIE_MANAGER.saveEnemyLevel(this.enemyLevel);
        this.updateEnemyLife();
        this.updateLevelView();
        if (this.mainEnemy.isBoss) {
            //window.gameModifyers.addShards(1)
        }
        if (bossWin) {
            this.mainEnemy.setAsEnemy(this.getNextEnemySprite());

            return
        }

        this.addResources();
        if (this.inABossBattle || this.enemyLevel == this.nextBoss) {
            this.setAsBos();
        } else {
            this.mainEnemy.setAsEnemy(this.getNextEnemySprite());
        }
        this.calcNextBoss();

        COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        this.onNextEnemy.dispatch();
    }
    addResources() {
        let customData = {}
        customData.texture = 'coin'
        customData.scale = 0.02
        customData.alphaDecress = 0.1
        let targetPos = this.mainEnemy.getGlobalPosition()
        let reward = (window.gameEconomy.currentResources * (0.005 + Math.random() * 0.001));
        reward = Math.max(10, reward);
        this.onGetResources.dispatch(targetPos, customData, reward, 5)
    }

    updateEnemyLife(isBoss = false) {
        //* (0.95 + Math.random()*0.05)
        this.enemyLife = this.enemyStartLife *
            Math.pow(this.lifeCoefficient * this.lifeCoefficient* this.lifeCoefficient, this.enemyLevel) *
            (isBoss ? (this.lifeCoefficient * this.lifeCoefficient* this.lifeCoefficient) : 1)

        this.enemyCurrentLife = this.enemyLife;
    }
    damageEnemy(damage) {
        if (this.enemyDeathTimer > 0) {
            return
        }
        let ang = Math.random() * Math.PI * 2;
        let targetPosition = this.mainEnemy.getGlobalPosition()
        targetPosition.x += Math.cos(ang) * 20
        targetPosition.y += Math.sin(ang) * 10
        this.onPopLabel.dispatch(targetPosition, utils.formatPointsLabel(damage));

        this.enemyCurrentLife -= damage;


        let customData = {}
        customData.texture = 'spark2'
        customData.scale = 0.005
        customData.alphaDecress = 0.5
        customData.gravity = 0
        customData.tint = this.getDamageColor()

        for (let index = 0; index < 5; index++) {
            let particleAng = Math.random() * 3.14 * 2;
            customData.forceX = Math.cos(particleAng) * 20
            customData.forceY = Math.sin(particleAng) * 20
            this.onParticles.dispatch(targetPosition, customData, 1)
        }

        if (this.enemyCurrentLife < 0) {
            this.enemyCurrentLife = 0;
            this.updateLifeLabel();
            if (this.inABossBattle) {
                this.lockOnLevel = false;
                this.sortNextEnemy();
            }
            this.nextEnemy();
        } else {
            COOKIE_MANAGER.saveEnemyLife(this.enemyCurrentLife)
        }
    }
    getDamageColor() {
        return this.damageColors[Math.floor(Math.random() * this.damageColors.length)]
    }

    updateLifeLabel() {
        this.label.text = utils.formatPointsLabel(Math.ceil(this.enemyCurrentLife)) + "/" + utils.formatPointsLabel(Math.ceil(this.enemyLife))
        this.label.x = -this.label.width / 2
        this.label.y = this.enemyLifeBar.y
    }
    updateVisibleUI() {
        this.label.alpha = this.mainEnemy.alpha
        this.enemyLifeBar.alpha = this.mainEnemy.alpha
        this.bossBattleTimer.alpha = this.mainEnemy.alpha
        this.bossBattleTimer.visible = this.inABossBattle;
        this.bossTimerLabel.visible = this.bossBattleTimer.visible;
    }

    resize(resolution, innerResolution, wrapper) {
        console.log(this.container.x)
        if (!window.isPortrait) {
            this.enemyProgressionView.bossCounter.x = (wrapper.x + wrapper.width / 2 ) - this.container.x + 10
            this.enemyProgressionView.bossCounter.y = 50
            this.enemyProgressionView.bossCounter.scale.set(1.5)
            this.invokeBossBattle.x = this.enemyProgressionView.bossCounter.x - this.invokeBossBattle.width - this.enemyProgressionView.bossCounter.width / 2+10
            this.invokeBossBattle.y = -18

        } else {
            this.enemyProgressionView.bossCounter.x = (wrapper.x + wrapper.width / 2 ) - this.container.x
            this.enemyProgressionView.bossCounter.scale.set(1)
            this.invokeBossBattle.x =  this.enemyProgressionView.bossCounter.x - this.invokeBossBattle.width + this.enemyProgressionView.bossCounter.width / 2
            this.invokeBossBattle.y = 45
            this.enemyProgressionView.bossCounter.y = 20


        }
    }
}