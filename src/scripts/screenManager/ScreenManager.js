import * as PIXI from 'pixi.js';

export default class ScreenManager extends PIXI.Container{
	constructor(){
		super();
		this.prevScreen = null;
		this.currentScreen = null;
		this.screenList = [];
		this.screensContainer = new PIXI.Container();
		this.addChild(this.screensContainer);
	}
	addScreen(screen){
		this.screenList.push(screen);
		this.currentScreen = screen;
		screen.screenManager = this;
		if(screen.onAdded){
			screen.onAdded();
		}
	}
	backScreen(){
		this.change(this.prevScreen);
	}
	change(screenLabel, param){
		let tempScreen;
		for(let i = 0; i < this.screenList.length; i++){
			if(this.screenList[i].label == screenLabel){
				tempScreen = this.screenList[i];
			}
		}
		if(this.currentScreen){
			this.currentScreen.transitionOut(tempScreen, param);
		}
		//this.resize()
	}
	//change between screens
	forceChange(screenLabel, param){
		if(this.currentScreen && this.currentScreen.parent){
			this.screensContainer.removeChild(this.currentScreen);
			this.prevScreen = this.currentScreen.label;
		}
		let tempScreen;
		for(let i = 0; i < this.screenList.length; i++){
			if(this.screenList[i].label == screenLabel){
				tempScreen = this.screenList[i];
			}
		}
		this.currentScreen = tempScreen;
		this.currentScreen.build(param);
		this.currentScreen.transitionIn();
		this.screensContainer.addChild(this.currentScreen);	
		if(!this.resolution){
			this.resolution = {width:innerWidth, height:innerHeight};
		}
		this.resize(this.resolution);
	}
	//update manager
	update(delta){
		this.resolution = {width:innerWidth, height:innerHeight};
		//this.resize(this.resolution);
		if(this.screenList != null){
			this.currentScreen.update(delta);
		}
	}
	resize(newSize, innerResolution){

		for(let i = 0; i < this.screenList.length; i++){
			if(this.screenList[i].resize){
				this.screenList[i].resize(newSize, innerResolution)
			}
		}
	}
}
