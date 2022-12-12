import * as PIXI from 'pixi.js';
import Signals from 'signals';
import config from '../../../config';
export default class ShopButton extends PIXI.Container
{
    constructor(catData, price)
        {
            super()
            this.enableAutoCollect = new Signals();

            this.onClickItem = new Signals();

            this.container = new PIXI.Container();
            this.addChild(this.container);
            // this.background = new PIXI.Graphics().beginFill(0xFFFFFF).drawRect(0, 0, 120, 40);

            this.backButton = new PIXI.mesh.NineSlicePlane(
                PIXI.Texture.from(config.assets.button.primaryLong), 20, 20, 20, 20)
            this.backButton.width = 130
            this.backButton.height = 60 

            config.addPaddingLongButton(this.backButton)
            // this.grey = new PIXI.mesh.NineSlicePlane(
            //     PIXI.Texture.from('Button23grey'), 20, 20, 20, 20)
            // this.grey.width = 110
            // this.grey.height = 40 

            this.container.addChild(this.backButton);
//            this.container.addChild(this.grey);

            this.w = this.backButton.width;
            this.h = this.backButton.height;
            // this.background.alpha = 0
            // this.container.addChild(this.background)
            this.catData = catData;


            //GAME_DATA.moneyData.softIcon
            this.sprite = new PIXI.Sprite.from('coin');
            //this.container.addChild(this.sprite);
            this.sprite.anchor.set(0, 0.5)
            this.defaultSpriteScale = this.h / this.sprite.height * 0.5;
            this.sprite.scale.set(this.defaultSpriteScale)
            this.sprite.x = this.sprite.width * 0.5;
            this.sprite.y = this.h / 2;
            this.interactive = true;
            this.buttonMode = true;

            this.on('mousedown', this.onClick.bind(this)).on('touchstart', this.onClick.bind(this));
            this.on('mouseup', this.mouseUp.bind(this))
                .on('touchend', this.mouseUp.bind(this))
                // .on('pointerout', this.mouseUp.bind(this))
                .on('pointerupoutside', this.mouseUp.bind(this))
                .on('mouseupoutside', this.mouseUp.bind(this));

            this.priceLabel = new PIXI.Text('',LABELS.LABEL1);
            this.priceLabel.style.fill = 0xff5566
            this.priceLabel.style.fontSize = 18
            this.priceLabel.anchor.set(0.5)
            this.container.addChild(this.priceLabel);
            this.container.pivot.x = this.container.width / 2
            this.container.pivot.y = this.container.height / 2
                // this.reset()

            this.container.x = this.container.width / 2
            this.container.y = this.container.height / 2

        }
        // updateData(catData) {
        //     this.catData = catData;
        // }
    mouseUp(e)
    {
        clearInterval(this.timeoutHold);
        this.onHold = false;
    }
    onClick()
    {
        if (this.deactived)
        {
            this.shake();
        }
        else
        {
            // SOUND_MANAGER.play(getCoinSound(), 0.2)
            this.onClickItem.dispatch(this);
            this.timeoutHold = setTimeout(() =>
            {
                this.onClick();
            }, !this.onHold ? 500: 50);
            this.onHold = true;
        }
    }
    setType(type = 'soft')
    {
        this.type = type;
        if (type == 'soft')
        {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.moneyData.softIcon);
        }
        else if (type == 'hard')
        {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.trophyData.icon);
        }
        else
        {
            this.sprite.texture = PIXI.Texture.from(GAME_DATA.moneyData.videoIcon);
        }

        this.defaultSpriteScale = this.h / (this.sprite.height / this.sprite.scale.y) * 0.65;
        this.sprite.scale.set(this.defaultSpriteScale)

        if (type == 'video')
        {
            this.sprite.x = this.w / 2 - this.sprite.width / 2;
            this.priceLabel.visible = false;
        }

    }
    updateCoast(value)
    {
        this.priceLabel.text = value
        this.priceLabel.x = this.backButton.width / 2
        this.priceLabel.y = this.h / 2
    }
    deactiveMax()
    {
        this.enabled = false;
        this.deactived = true;
        this.backButton.tint = 0xFFFFFF;
        this.priceLabel.style.fill = 0xFFFFFF;
        this.priceLabel.text = 'MAX'
        this.priceLabel.x = this.backButton.width / 2
        this.priceLabel.y = this.h / 2
        this.backButton.alpha = 1;
        this.backButton.texture = PIXI.Texture.from(config.assets.button.greyLong)
        this.sprite.visible = false;

        clearInterval(this.timeoutHold);
    }
    deactive()
    {
        this.enabled = false;
        this.deactived = true;
        this.sprite.visible = true;
        this.backButton.tint = 0xFFFFFF;
        this.priceLabel.style.fill = 0xFFFFFF;
        this.backButton.alpha = 1;
        this.backButton.texture = PIXI.Texture.from(config.assets.button.greyLong)


    }
    enable()
    {
        this.enabled = true;
        this.deactived = false;
        this.sprite.visible = true;
        //this.backButton.tint = 0x6250e5;
        this.backButton.alpha = 1;
        this.priceLabel.style.fill = 0xFFFFFF;
        this.backButton.texture = PIXI.Texture.from(config.assets.button.primaryLong)


    }

    shake(force = 0.25, steps = 5, time = 0.4)
    {
        // SOUND_MANAGER.play('boing');
        let timelinePosition = new TimelineLite();
        let positionForce = (force * -20);
        let spliterForce = (force * 20);
        let pos = [positionForce * 2, positionForce, positionForce * 2, positionForce, positionForce * 2, positionForce]
        let speed = time / pos.length;

        for (var i = pos.length; i >= 0; i--)
        {
            timelinePosition.append(TweenLite.to(this.container, speed,
            {
                rotation: i % 2 == 0 ? 0.1 : -0.1,
                x: this.container.width / 2 + pos[i], //- positionForce / 2,
                // y: 0, //Math.random() * positionForce - positionForce / 2,
                ease: "easeNoneLinear"
            }));
        };

        timelinePosition.append(TweenLite.to(this.container, speed,
        {
            rotation: 0,
            x: this.container.width / 2,
            // y: 0,
            ease: "easeeaseNoneLinear"
        }));
    }
}