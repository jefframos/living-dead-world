import * as PIXI from 'pixi.js';
import PuzzleBackgroundBase from '../PuzzleBackgroundBase';

export default class PuzzleBackground extends PuzzleBackgroundBase {
	constructor() {

		super();
	}
	build() {
		this.baseContainer = new PIXI.Container()
		this.addChild(this.baseContainer)

		this.baseTerrain = new PIXI.Sprite.from('base-terrain')
		this.baseTerrain.anchor.set(0.5, 0)
		this.baseTerrain.scale.set(1)
		this.baseTerrain.tint = 0x1FD18B
		this.baseContainer.addChild(this.baseTerrain)

		// this.bottomPatch = new PIXI.Sprite.from('bottomPatch')
		// this.bottomPatch.x = 220
		// this.bottomPatch.y = 550
		// this.baseContainer.addChild(this.bottomPatch)

		this.leftDetail = new PIXI.Sprite.from('leftPatch')
		this.leftDetail.anchor.set(1, 0)
		this.leftDetail.x = -150
		this.leftDetail.y = -180
		this.baseContainer.addChild(this.leftDetail)


		this.rightDetail = new PIXI.Sprite.from('rightPatch')
		this.rightDetail.x = 150
		this.rightDetail.y = -180
		this.baseContainer.addChild(this.rightDetail)

		this.leftPines = new PIXI.Sprite.from('pineSidePatch')
		this.leftPines.anchor.set(1, 0)
		this.leftPines.x = -380
		this.leftPines.y = -250
		this.baseContainer.addChild(this.leftPines)


		this.rightPines = new PIXI.Sprite.from('pineSidePatch')
		this.rightPines.x = 380
		this.rightPines.y = -250
		this.baseContainer.addChild(this.rightPines)
	}
	resize(innerResolution, scale) {
		if (innerResolution && innerResolution.width && innerResolution.height) {

			this.innerResolution = innerResolution;

			if (window.isPortrait) {
				this.rightPines.visible = true;
				this.baseTerrain.scale.set(1,1.5)
				this.rightDetail.texture = new PIXI.Texture.from('rightPatch')
				this.rightDetail.scale.set(1)
				this.leftDetail.scale.set(1)
				this.leftDetail.x = -152
				this.leftDetail.y = -189
				this.rightDetail.x = 150
				this.rightDetail.y = -182
				//this.bottomPatch.visible = false;

			} else {

				this.rightPines.visible = false;
				this.baseTerrain.scale.x = 0.7
				this.rightDetail.texture = new PIXI.Texture.from('rightPatchCliff')
				this.rightDetail.scale.set(0.8)
				this.leftDetail.scale.set(0.8)

				this.leftDetail.x = -150
				this.leftDetail.y = -146

				this.rightDetail.x = 160
				this.rightDetail.y = -140
				//this.bottomPatch.visible = true;
			}

		}

	}

	update(delta) {

	}

}