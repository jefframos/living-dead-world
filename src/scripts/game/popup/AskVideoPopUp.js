import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
import StandardPop from './StandardPop';
import UIButton from '../../ui/uiElements/UIButton';
export default class AskVideoPopUp extends StandardPop
{
    constructor(label, screenManager)
    {
        super(label, screenManager);

        let videoLabel = new PIXI.Text('Do you want watch a video\nand start with a bonus?',
        {
            fontFamily: 'blogger_sansregular',
            fontSize: '24px',
            fill: 0xFFFFFF,
            align: 'center',
            fontWeight: '800'
        });


        this.popUp.alpha = 0;



        this.backgroundContainer = new PIXI.Container();
        let tiled = new PIXI.extras.TilingSprite(PIXI.Texture.from('pattern'), 132, 200);
        tiled.width = config.width;
        tiled.height = config.height;
        tiled.alpha = 0.05
        tiled.tileScale.set(0.5)

        this.logoMask = new PIXI.Sprite.from('logo_mask_white');
        this.logoMask.anchor.set(0.5);
        this.logoMask.x = 0 //config.width / 2
        this.logoStartScale = this.width / this.logoMask.width;
        this.logoMask.scale.set(this.logoStartScale)
        this.logoMask.y = 0 //config.height / 2

        let bgColor = new PIXI.Graphics().beginFill(0x12073f).drawRect(-config.width / 2, -config.height / 2, config.width, config.height);
        this.backgroundContainer.addChild(bgColor)

        let bigBlur = new PIXI.Sprite(PIXI.Texture.from('bigblur'));
        this.backgroundContainer.addChild(bigBlur)
        bigBlur.width = this.width // 2;
        bigBlur.height = this.height // 2;
        bigBlur.alpha = 0.2
        bigBlur.anchor.set(0.5);

        tiled.x = -config.width / 2;
        tiled.y = -config.height / 2;

        this.backgroundContainer.addChild(tiled)
        this.backgroundContainer.addChild(this.logoMask)
        this.backgroundContainer.mask = this.logoMask
        this.container.addChild(this.backgroundContainer);


        this.titlePrizes = new PIXI.Sprite.from('video_rewards_title');
        this.titlePrizes.anchor.set(0.5, 1);
        this.titlePrizesScale = config.width / this.titlePrizes.width * 0.85
        this.titlePrizes.scale.set(this.titlePrizesScale)
        this.addChild(this.titlePrizes)
        this.titlePrizes.x = config.width / 2;
        this.titlePrizes.y = config.height / 2 - this.logoMask.height * 0.5;


        this.videoAnimationContainer = new PIXI.Container();

        this.videoShine = new PIXI.Sprite.from('video_rewards_shine');
        this.videoShine.anchor.set(0.5);
        this.videoAnimationContainer.addChild(this.videoShine);
        this.videoShine.alpha = 0.5

        this.videoLogo = new PIXI.Sprite.from('video_rewards_video');
        this.videoLogo.anchor.set(0.8, 0.5);
        this.videoAnimationContainer.addChild(this.videoLogo);


        this.auto = new PIXI.Sprite.from('text_catnip_frenzy');
        this.auto.anchor.set(0, 0.5);
        this.auto.scale.set(config.height / this.auto.height * 0.22);
        this.auto.x = this.auto.width * 0.1
        this.auto.y = -this.auto.height / 2
        this.auto.rotation = -0.1
        this.videoAnimationContainer.addChild(this.auto);


        this.double = new PIXI.Sprite.from('text_double_points');
        this.double.anchor.set(0, 0.5);
        this.double.scale.set(config.height / this.double.height * 0.22);
        this.videoAnimationContainer.addChild(this.double);
        this.double.x = this.auto.width * 0.1
        this.double.y = this.double.height / 2
        this.double.rotation = 0.1


        this.container.addChild(this.videoAnimationContainer);

        this.videoAnimationContainer.scale.set(config.width / this.videoAnimationContainer.width * 0.55)
        this.videoAnimationContainer.y = -this.videoAnimationContainer.height * 0.015


        this.playButton = new UIButton('icon_play_video');
        // this.playButton.anchor.set(0.5)
        this.playButtonScale = config.width / this.playButton.width * 0.20;
        this.playButton.scale.set(this.playButtonScale)
        this.playButtonSin = 0;
        // this.playButtonScale = this.logoMask.height / this.playButton.height * 0.35
        // this.playButton.scale.set(this.playButtonScale);
        // this.playButton.y = config.height - this.container.y - this.playButton.height / 2 - 20
        this.playButton.interactive = true;
        this.playButton.buttonMode = true;
        this.playButton.on('mousedown', this.confirm.bind(this)).on('touchstart', this.confirm.bind(this));
        this.container.addChild(this.playButton)

        this.cancelButton = new UIButton('icon_close');
        // this.cancelButton.anchor.set(0.5)
        this.cancelButton.scale.set(config.width / this.cancelButton.width * 0.085)
            // this.cancelButtonScale = this.logoMask.height / this.cancelButton.height * 0.35
            // this.cancelButton.scale.set(this.cancelButtonScale);
            // this.cancelButton.y = config.height - this.container.y - this.cancelButton.height / 2 - 20
        this.cancelButton.interactive = true;
        this.cancelButton.buttonMode = true;
        this.cancelButton.on('mousedown', this.close.bind(this)).on('touchstart', this.close.bind(this));
        this.container.addChild(this.cancelButton)





        // this.container.addChild(videoLabel)
        videoLabel.pivot.x = videoLabel.width / 2;
        videoLabel.pivot.y = videoLabel.height / 2;

        videoLabel.scale.set(config.height / videoLabel.height * 0.07)

        videoLabel.y = -this.h / 3 + 50
        this.cancelButton.x = config.width / 2 - this.cancelButton.width * 2.5
        this.cancelButton.y = - this.cancelButton.height * 2.5
        // this.playButton.x = this.cancelButton.width * 1.5 //this.playButton.width * 2.5
        this.playButton.y = this.playButton.height * 1.2//this.playButton.height*2


        this.prizeDark = new PIXI.Graphics().beginFill(0).drawRect(0, 0, config.width, config.height) //new PIXI.Sprite(PIXI.Texture.from('UIpiece.png'));
        this.prizeDark.alpha = 0.35;
        this.addChildAt(this.prizeDark, 0);

    }
    update(delta)
    {
        if (this.visible)
        {
            this.playButtonSin += 10 * delta
            this.playButtonSin %= Math.PI * 2;
            this.playButton.rotation = Math.sin(this.playButtonSin) * 0.1
            this.playButton.scale.set(this.playButtonScale + Math.cos(this.playButtonSin) * 0.01, this.playButtonScale + Math.sin(this.playButtonSin) * 0.01)


            this.videoShine.rotation += delta * 1.5
            this.videoShine.rotation %= Math.PI * 2;
        }
    }
    show(param)
    {
        this.toRemove = false;
        this.onShow.dispatch(this);

        this.playButtonSin = 0;

        this.titlePrizes.scale.set(0);
        TweenLite.to(this.titlePrizes.scale, 1,
        {
            delay: 0.5,
            onStart:()=>{
                SOUND_MANAGER.play('pickup_star');
            },
            x: this.titlePrizesScale,
            y: this.titlePrizesScale,
            ease: Elastic.easeOut
        })

        this.container.scale.set(0, 2)
        TweenLite.to(this.container.scale, 1,
        {
            x: 1,
            y: 1,
            ease: Elastic.easeOut
        })
    }
    afterHide()
    {
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
                if (dispatch)
                {
                    this.onHide.dispatch(this);
                }
                if (callback)
                {
                    callback();
                }
                this.afterHide();
                this.toRemove = true
            }
        })
    }
    confirm()
    {
        this.onConfirm.dispatch(this);
        this.hide();
    }
    close()
    {
        this.onClose.dispatch(this);
        this.hide();
    }
}