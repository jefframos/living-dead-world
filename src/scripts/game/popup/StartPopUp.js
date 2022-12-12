import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../config';
import StandardPop from './StandardPop';
import UIButton from '../ui/uiElements/UIButton';
export default class StartPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        this.onCatsRedirect = new Signals();
        this.playButton = new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        this.playButton.anchor.set(0.5)
            // this.playButton.pivot.x = this.playButton.width / 2
            // this.playButton.pivot.y = this.playButton.height / 2
            // this.playButton.scale.set((this.size / this.playButton.width));
        this.playButton.alpha = 1;

        this.popUp.alpha = 0;

        // this.playButton.y = this.height * 0.5 + this.playButton.height


        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = config.width / 2
        this.logoMask.y = config.height / 2 - 50
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
            // this.screenManager.addChild(this.logoMask);
            // this.screenManager.screensContainer.mask = this.logoMask;

        this.logo = new PIXI.Sprite.from('lettering');
        this.logo.anchor.set(0.5);
        this.logo.x = 0
        this.logo.y = -50
        this.logo.scale.set(this.width / this.logo.width * 0.65)
        this.container.addChild(this.logo);


        // this.container.addChild(this.playButton)

        this.playButton = new UIButton('icon_play', 0.6)//new PIXI.Sprite(PIXI.Texture.from('play button_large_up'));
        // this.playButton.anchor.set(0.5)
        this.playButtonScale = this.logoMask.height / this.playButton.height * 0.5
        this.playButton.scale.set(this.playButtonScale);
        this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - this.playButton.height / 3
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.container.addChild(this.playButton)
        this.playButton.scale.set(0);


        this.infoButton = new UIButton('info', 0.85)
        this.infoButtonScale = this.logoMask.height / this.infoButton.height * 0.15
        this.infoButton.scale.set(this.infoButtonScale, this.infoButtonScale);
        // console.log(this.infoButton.width);
        this.infoButton.x = config.width / 2 - this.infoButton.width;
        this.infoButton.y = -config.height / 2 + this.infoButton.height// + config.height * 0.2;
        // this.infoButton.y = -300
        this.infoButton.interactive = true;
        this.infoButton.buttonMode = true;
        this.infoButton.on('mousedown', this.openInfo.bind(this)).on('touchstart', this.openInfo.bind(this));
        this.container.addChild(this.infoButton)


        this.settingsButton = new UIButton('icon_settings', 0.75)
        this.settingsButtonScale = this.logoMask.height / this.settingsButton.height * 0.15
        this.settingsButton.scale.set(this.settingsButtonScale, this.settingsButtonScale);
        // console.log(this.settingsButton.width);
        this.settingsButton.x = - config.width / 2 + this.settingsButton.width;
        this.settingsButton.y = -config.height / 2 + this.settingsButton.height;
        // this.settingsButton.y = -300
        this.settingsButton.interactive = true;
        this.settingsButton.buttonMode = true;
        this.settingsButton.on('mouseup', this.openSettings.bind(this)).on('touchend', this.openSettings.bind(this));
        this.container.addChild(this.settingsButton)



        let settingsLabel = new PIXI.Text(GAME_DATA.version,
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '48px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });
        settingsLabel.scale.set(config.width / settingsLabel.width * 0.1)
        this.container.addChild(settingsLabel)
        settingsLabel.x = config.width /2 - settingsLabel.width * 1.5
        settingsLabel.y = config.height /2 - settingsLabel.height * 1.5

        // this.container.addChild(this.toCats)
    }

    openSettings(){
        this.screenManager.openSettings();
    }
    openInfo(){
        this.screenManager.showInfo({x:config.width / 2, y:config.height / 2}, 'goodboy_heart', 'Made with fun and love\n by Goodboy Digital team\nmeow!', {x:0, y:0.5})

         SOUND_MANAGER.play('pickup_star');
         SOUND_MANAGER.play(getCatSound());
    }

    hide(dispatch, callback)
    {
        TweenLite.to(this.logoMask.scale, 1,
        {
            x: 3,
            y: 3,
            onComplete: () =>
            {

                this.screenManager.mask = null;
                if (this.logoMask.parent)
                    this.logoMask.parent.removeChild(this.logoMask)

                // if(this.glass.parent)
                // this.glass.parent.removeChild(this.glass)
            }
        })
        super.hide(dispatch, callback);
    }

    show()
    {
        // return
        if (this.screenManager.screensContainer.mask)
        {
            this.screenManager.screensContainer.mask = null;
        }
        // TweenLite.to(this.glass, 0.5, {alpha:1});

        this.screenManager.screensContainer.mask = this.logoMask;
        this.screenManager.screensContainer.addChild(this.logoMask)
            // this.screenManager.screensContainer.addChild(this.glass)

        this.logoMask.scale.set(5)

        //    this.glass.scale.set(5)

        //    TweenLite.to(this.glass.scale, 0.75, {x:this.logoStartScale,y:this.logoStartScale,onComplete:()=>{
        // }})

        TweenLite.to(this.playButton.scale, 0.75,
        {
            delay: 0.5,
            x: this.playButtonScale,
            y: this.playButtonScale,
            ease: Elastic.easeOut
        })
        TweenLite.to(this.logoMask.scale, 0.75,
        {
            x: this.logoStartScale,
            y: this.logoStartScale,
            onComplete: () =>
            {}
        })
        super.show();
    }
}