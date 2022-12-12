import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import StandardPop from './StandardPop';
import UIButton from '../../ui/uiElements/UIButton';
export default class OnboardingPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        	


        this.popUp.alpha = 0;

        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = 0//config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = 0//config.height / 2

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(-config.width/2, -config.height/2, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        tiled.x = -config.width/2;
        tiled.y = -config.height/2;

        this.onboardingImage = new PIXI.Sprite.from('onboarding_image');
        this.onboardingImage.anchor.set(0.5);
        this.onboardingStartScale = this.width / this.onboardingImage.width * 0.75;
        this.onboardingImage.scale.set(this.onboardingStartScale)
        this.onboardingImage.x = 0//config.width / 2
        this.onboardingImage.y = -this.onboardingImage.height * 0.1//config.height / 2

        this.backgroundContainer.addChild(tiled)
        this.backgroundContainer.addChild(this.logoMask) 
        this.backgroundContainer.mask = this.logoMask
        this.container.addChild(this.backgroundContainer);

        this.container.addChild(this.onboardingImage) 

        this.playButton = new UIButton('icon_confirm');
        this.playButton.scale.set(config.width / this.playButton.width * 0.085)
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.container.addChild(this.playButton)
        
        let videoLabel = new PIXI.Text('Press the pink buttons at the\nright time to save the cats!',
            {
                fontFamily: 'blogger_sansregular',
                fontSize: '24px',
                fill: 0xFFFFFF,
                align: 'center',
                fontWeight: '800'
            });
        this.container.addChild(videoLabel)
        // videoLabel.pivot.x = -videoLabel.width;
        // videoLabel.pivot.y = videoLabel.height / 2;
        videoLabel.scale.set(config.width / videoLabel.width * 0.4)

        videoLabel.y = - this.h / 3 + 50
        this.playButton.x =  this.playButton.width * 2.5
        this.playButton.y =  this.playButton.height*2

        videoLabel.x = this.playButton.x - videoLabel.width - this.playButton.width * 0.65
        videoLabel.y = this.playButton.y - this.playButton.height / 2 - videoLabel.height / 2 + this.playButton.height * 0.5


        this.backGraphic = new PIXI.Graphics().beginFill(0xFF00FF).drawRect(-this.w, -this.playButton.height*0.1, this.w*2, this.playButton.height*1.2)
        this.backgroundContainer.addChild(this.backGraphic)
        this.backGraphic.y = this.playButton.y - this.playButton.height / 2
        this.backGraphic.alpha = 0.25;


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.35;
        this.addChildAt(this.prizeDark,0);
    }
    update(delta){

    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);

        this.container.scale.set(0, 2)
        TweenLite.to(this.container.scale, 1,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })
    }
    afterHide(){
        // this.visible = false;
    }
    hide(dispatch = true, callback = null)
    {
        console.log(callback);
        TweenLite.to(this.container.scale, 0.25,
        {
            x: 0,
            y: 1.5,
            ease: Back.easeIn,
            onComplete: () =>
            {
                if(dispatch){
        		  this.onHide.dispatch(this);
                }
                if(callback){
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }
    confirm()
    {
        SOUND_MANAGER.play('button_click');
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}