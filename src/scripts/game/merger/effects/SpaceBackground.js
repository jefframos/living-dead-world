import * as PIXI from 'pixi.js';
import utils from '../../../utils';
import config from '../../../config';
import StarParticle from './StarParticle';
import TweenLite from 'gsap';

export default class SpaceBackground extends PIXI.Container {
	constructor() {

		super();
		this.stars = [];


		this.background = new PIXI.Container();
		this.addChild(this.background);

		this.tiledBackground = new PIXI.TilingSprite(PIXI.Texture.from('seamless-starfield-texture', 256, 256))
		this.addChild(this.tiledBackground);
		this.tiledBackground.width = 5000
		this.tiledBackground.height = 5000
		this.tiledBackground.anchor.set(0.5)

		this.baseTopGradientBlack = new PIXI.Sprite.from('base-gradient')
		this.addChild(this.baseTopGradientBlack);
		this.baseTopGradientBlack.anchor.x = 0.5
		this.baseTopGradientBlack.anchor.y = 1
		this.baseTopGradientBlack.rotation = Math.PI
		this.baseTopGradientBlack.tint = 0
		this.baseTopGradientBlack.alpha = 1

		this.tiledBackground2 = new PIXI.TilingSprite(PIXI.Texture.from('seamless-starfield-texture', 256, 256))
		this.addChild(this.tiledBackground2);
		this.tiledBackground2.width = 5000
		this.tiledBackground2.height = 5000
		this.tiledBackground2.anchor.set(0.5)


		this.backgroundShape = new PIXI.Graphics().beginFill(0x111a20).drawRect(-50, -50, 100, 100);
		this.addChild(this.backgroundShape);
		this.backgroundShape.alpha = 0.5


		this.bottomShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, 0, 10000, 10000);
		this.addChild(this.bottomShape);
		this.bottomShape.alpha = 0.5


		this.topShape = new PIXI.Graphics().beginFill(0xffffff).drawRect(-5000, -10000, 10000, 10000);
		this.addChild(this.topShape);
		this.topShape.alpha = 0.5


		this.baseTopGradient = new PIXI.Sprite.from('base-gradient')
		this.addChild(this.baseTopGradient);
		this.baseTopGradient.anchor.x = 0.5
		this.baseTopGradient.anchor.y = 1
		this.baseTopGradient.rotation = Math.PI
		this.baseTopGradient.tint = 0x550033//0x371f52
		this.baseTopGradient.alpha = 0.3
		this.topShape.tint = this.baseTopGradient.tint

		
		this.middleGradient = new PIXI.Sprite.from('bigblur')
		this.addChild(this.middleGradient);
		this.middleGradient.anchor.x = 0.5
		this.middleGradient.anchor.y = 0.5
		this.middleGradient.rotation = Math.PI
		this.middleGradient.tint = 0x1014aa//0x0d5956
		this.middleGradient.alpha = 0.5
		
		this.baseGradient = new PIXI.Sprite.from('base-gradient')
		this.addChild(this.baseGradient);
		this.baseGradient.anchor.x = 0.5
		this.baseGradient.anchor.y = 1
		this.baseGradient.alpha = 0.5
		this.baseGradient.tint = 0x1014aa
		this.bottomShape.tint = this.baseGradient.tint
		// this.backShape = new PIXI.Sprite.from('background_space')
		// this.addChild(this.backShape);
		// this.backShape.anchor.x = 0.5

		this.starsContainer = new PIXI.Container();
		this.addChild(this.starsContainer);


		this.innerResolution = { width: config.width, height: config.height }


		//this.addStars();


		this.starsMoveTimer = 0;

		this.starsDeacc = 0.9;

		this.currentSpeed = {
			x: 0,
			y: 200
		}


		window.fxSpeed = 1;


	}
	setTopColor(color) {
		//utils.killColorTween(this.baseTopGradient);
		utils.addColorTween(this.baseTopGradient, this.baseTopGradient.tint, color, 5, 0.5)
	}

	resize(innerResolution, scale) {
		if (innerResolution && innerResolution.width && innerResolution.height) {

			this.innerResolution = innerResolution;
			this.backgroundShape.width = innerResolution.width * 4 // scale.x
			this.backgroundShape.height = window.innerHeight * 4// scale.x

			//console.log(innerResolution.height / config.height)
			let globalScale = innerResolution.height / config.height
			this.baseGradient.y = innerResolution.height / 2 / globalScale
			this.baseTopGradient.y = -innerResolution.height / 2 / globalScale

			this.topShape.y  = this.baseTopGradient.y
			this.bottomShape.y = this.baseGradient.y

			this.baseGradient.width = innerResolution.width * 4
			this.baseTopGradient.width = innerResolution.width * 4

			this.baseTopGradientBlack.width = this.baseTopGradient.width
			this.baseTopGradientBlack.y = this.baseTopGradient.y
			// this.starsContainer.x = innerResolution.width / 2
			// this.starsContainer.y = innerResolution.height / 2
		}

	}

	update(delta) {
		this.topShape.tint = this.baseTopGradient.tint
		this.topShape.alpha = this.baseTopGradient.alpha;
		//console.log(this.stars)
		if (window.fxSpeed > 1) {
			window.fxSpeed -= delta * 5;
			if (window.fxSpeed < 1) {
				window.fxSpeed = 1;
			}
		}
		this.currentSpeed.y = this.innerResolution.height * 0.01 * (window.fxSpeed * 2) * 5
		this.tiledBackground.tilePosition.y += delta * 5;
		this.tiledBackground.tilePosition.y %= 256;

		this.tiledBackground2.tilePosition.y += delta * 3;
		this.tiledBackground2.tilePosition.y %= 256;

		this.tiledBackground.rotation += delta * 0.01
		//console.log(this.currentSpeed.y, delta)
		let spd = this.currentSpeed.y * delta;

		if (spd) {
			for (var i = 0; i < this.stars.length; i++) {
				this.stars[i].update(this.currentSpeed.y * delta, this.innerResolution);
			}
		}
	}
	addStars() {
		let totalStars = this.innerResolution.width * 0.2;

		totalStars = Math.min(120, totalStars);
		let l = this.innerResolution.width * 0.001
		l = Math.max(l, 1.5)
		this.stars = [];
		for (var i = 0; i < totalStars; i++) {
			let dist = Math.random() * (l * 2) + l;
			let tempStar = new StarParticle(dist * 2);
			tempStar.alpha = (Math.min(dist, 3) / 3 * 0.2) + 0.1
			tempStar.tint = 0x7C8284
			let toClose = true;
			let acc = 5;
			while (toClose && acc > 0) {
				acc--;
				let angle = Math.random() * Math.PI * 2;
				let max = Math.max(this.innerResolution.width, this.innerResolution.height)
				let radius = Math.random() * max + 20;
				tempStar.x = + Math.cos(angle) * radius// - this.innerResolution.width/2;
				tempStar.y = + Math.sin(angle) * radius// - this.innerResolution.height/2;
				toClose = false;
				for (var j = 0; j < this.stars.length; j++) {
					let distance = utils.distance(this.stars[j].x, this.stars[j].y, tempStar.x, tempStar.y)
					if (distance > 15) { } else {
						toClose = true;
						break
					}
				}
			}
			this.starsContainer.addChild(tempStar);
			this.stars.push(tempStar)
		}
	}


}