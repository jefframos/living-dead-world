import * as PIXI from 'pixi.js';
import signals from 'signals';
import Game from '../../../Game';
import PlayerGameViewSpriteSheet from '../../components/PlayerGameViewSpriteSheet';
import GameData from '../../data/GameData';
import UIUtils from '../../utils/UIUtils';

export default class ChoosePlayer extends PIXI.Container {
    constructor(message, buttonData) {
        super();

        this.infoShade = new PIXI.Sprite.from(PIXI.Texture.from('modal_blur'));
        this.addChild(this.infoShade);
        this.infoShade.alpha = 0.75;
        this.infoShade.anchor.set(0.5)

        this.message = message || 'Choose your starter';

        const player1 = new PlayerGameViewSpriteSheet()
        player1.setData(GameData.instance.getPlayer1Preview());
        player1.buildSpritesheet(GameData.instance.getPlayer1Preview());
        player1.generateNewTexture();
        player1.destroy()

        const player2 = new PlayerGameViewSpriteSheet()
        player2.setData(GameData.instance.getPlayer2Preview());
        player2.buildSpritesheet(GameData.instance.getPlayer2Preview());
        player2.generateNewTexture();
        player2.destroy()

        const player3 = new PlayerGameViewSpriteSheet()
        player3.setData(GameData.instance.getPlayer3Preview());
        player3.buildSpritesheet(GameData.instance.getPlayer3Preview());
        player3.generateNewTexture();
        player3.destroy()

        this.buttonData = buttonData || [
            { texture: UIUtils.baseButtonTexture + '_0001', label: 'Button 1', images: [player1.staticTexture, 'pistol1-icon', 'pet-cat-10001'] },
            { texture: UIUtils.baseButtonTexture + '_0002', label: 'Button 2', images: [player2.staticTexture, 'multishot-gun-1-icon', 'pet-fish-10001'] },
            { texture: UIUtils.baseButtonTexture + '_0004', label: 'Button 3', images: [player3.staticTexture, 'zombie-hand-icon', 'pet-dog-10001'] }
        ];
        this.buttons = [];
        this.onSelect = new signals.Signal();

        this.createMessage();
        this.createButtons();
        this.update();
    }


    createMessage() {
        this.messageText = UIUtils.getPrimaryLabel(this.message, { fontSize: 48, wordWrapWidth: 800 });
        this.messageText.anchor.set(0.5, 0.5);
        this.messageText.position.set(window.innerWidth / 2, window.innerHeight / 2 - 100);
        this.addChild(this.messageText);
    }

    createButtons() {
        this.buttonData.forEach((data, index) => {
            const button = this.createButton(data);
            button.on('pointerdown', () => this.onButtonClick(index));
            this.buttons.push(button);
            this.addChild(button);
        });
    }

    createButton(data) {
        const button = new PIXI.Container();

        const buttonBackground = new PIXI.NineSlicePlane(PIXI.Texture.from(data.texture), 30, 30, 30, 30);
        buttonBackground.width = 250;
        buttonBackground.height = 300;
        button.addChild(buttonBackground);


        button.interactive = true;
        buttonBackground.interactive = true;
        buttonBackground.buttonMode = true;

        buttonBackground.on('pointerover', () => buttonBackground.tint = 0xAAAAAA);
        buttonBackground.on('pointerout', () => buttonBackground.tint = 0xFFFFFF);

        const img = PIXI.Sprite.from(data.images[0]);
        img.anchor.set(0.5, 0.5);
        img.position.set(buttonBackground.width / 2, 120);
        button.addChild(img);

        const img2 = PIXI.Sprite.from(data.images[1]);
        img2.anchor.set(0.5, 0.5);
        img2.position.set(buttonBackground.width / 2 + 65, 70);
        img2.scale.set(1)
        button.addChild(img2);

        const img3 = PIXI.Sprite.from(data.images[2]);
        img3.anchor.set(0.5, 0.5);
        img3.scale.set(1.25)
        img3.position.set(buttonBackground.width / 2 + 60, 190);
        button.addChild(img3);

        return button;
    }

    onButtonClick(index) {
        this.onSelect.dispatch(index);
    }

    update() {
        const screenWidth = Game.Borders.width;
        const screenHeight = Game.Borders.height;
        const buttonSpacing = 300;
        const middleIndex = Math.floor(this.buttons.length / 2);
        const middleButtonX = screenWidth / 2;

        this.buttons.forEach((button, index) => {
            button.position.set(middleButtonX + (index - middleIndex) * buttonSpacing - 250 / 2, screenHeight / 2 - 250);
        });

        this.messageText.position.set(screenWidth / 2, screenHeight / 2 + 100);

        this.infoShade.x = screenWidth / 2
        this.infoShade.y = screenHeight / 2

        this.infoShade.scale.set(20)

        //this.x = Game.Borders.width / 2 - 
    }
}