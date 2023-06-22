import PlayerViewStructure from './entity/PlayerViewStructure';
import Signals from 'signals';

export default class CookieManager {
	static _instance;
	static get instance() {
		if (!CookieManager._instance) {
			CookieManager._instance = new CookieManager();
		}
		return CookieManager._instance;
	}
	constructor() {
		this.onUpdateAchievments = new Signals();
		this.defaultStats = {
			test: 0,
			tutorialStep: 0
		}
		this.defaultSettings = {
			version: '0.0.1',
			isMute: false
		}
		this.defaultEconomy = {
			resources: 0,
			lastChanged: 0,
			lastOpen: 0
		}
		this.defaultResources = {
			version: '0.0.1',
			entities: {},
			dataProgression: {}
		}
		this.defaultProgression = {
			version: '0.0.1',
			latestClaim: -1,
			latestClaimFreeMoney: -1,
			isInitialized: false
		}
		this.defaultPlayer = {
			version: '0.0.1',
			totalPlayers: 1,
			currentPlayer: 0,
			playerLevel: 0,
			playerStructures: [],
		}
		this.defaultInventory = {
			version: '0.0.1',
			weapons: [{ id: 'PISTOL_01', level: 0 }, { id: 'SUB_MACHINE_GUN_01', level: 0 }, { id: 'SNIPER_01', level: 0 }, { id: 'MINIGUN_01', level: 0 }, { id: 'SHOTGUN_01', level: 0 }, { id: 'PLAYER_MULTISHOT', level: 0 }],
			bodyParts: [],
			companions: [{ id: 'DOG-1', level: 0 }, { id: 'DOG-2', level: 0 }, { id: 'CAT-1', level: 0 }, { id: 'FISH-1', level: 0 }, { id: 'FROG-1', level: 0 }, { id: 'BIRD-1', level: 0 }],
			masks: [{ id: 'MASK_01', level: 0 }],
			trinkets: [{ id: 'TRINKET_01', level: 0 },{ id: 'TRINKET_01', level: 0 },{ id: 'TRINKET_01', level: 0 },{ id: 'TRINKET_01', level: 0 }],
			shoes: [{ id: 'SHOE_01', level: 0 }, { id: 'SHOE_02', level: 0 }, { id: 'SHOE_03', level: 0 }, { id: 'SHOE_04', level: 0 }, { id: 'SHOE_05', level: 0 }, { id: 'SHOE_06', level: 0 }, { id: 'SHOE_07', level: 0 }, { id: 'SHOE_08', level: 0 }],
		}
		this.defaultLoadout = {
			version: '0.0.1',
			currentWeapon: [{ id: 'PISTOL_01', level: 0 }],
			currentTrinket: [{ id: null, level: 0 }],
			currentCompanion: [{ id: null, level: 0 }],
			currentMask: [{ id: null, level: 0 }],
			currentShoe: [{ id: null, level: 0 }],
			currentPlayer: 0,
			playerStructures: []
		}
		this.defaultItemProgression = {
			version: '0.0.1',
			discoveredItems: []
		}
		this.defaultGifts = {
			version: '0.0.1',
			entities: {},
		}
		this.defaultAchievments = {
			version: '0.0.1',
			discovery: { progress: 0, claimed: 0 },
			level: { progress: 0, claimed: 0 },
			buy: { progress: 0, claimed: 0 },
			merge: { progress: 0, claimed: 0 },
			tap: { progress: 0, claimed: 0 },
			reveal: { progress: 0, claimed: 0 },
			revealMystery: { progress: 0, claimed: 0 },
		}


		this.defaultModifyers = {
			version: '0.0.1',
			entities: {},
			drillSpeed: 1,
			resourcesMultiplier: 1,
			damageMultiplier: 1,
			attackSpeed: 1,
			attackSpeedValue: 1,
			autoMerge: 1,
			autoCollectResource: false,
			permanentBonusData: {
				damageBonus: 1,
				resourceBonus: 1,
				damageSpeed: 1,
				resourceSpeed: 1,
				shards: 0
			}
		}

		this.version = '0.0.0.1'
		this.cookieVersion = this.getCookie('cookieVersion')
		//alert(this.cookieVersion != this.version)
		if (!this.cookieVersion || this.cookieVersion != this.version) {
			this.storeObject('cookieVersion', this.version)
			this.wipeData2();
		}
		this.fullData = this.getCookie('fullData')
		if (!this.fullData) {
			this.fullData = {}
		}

		this.storeObject('fullData', this.fullData)

		this.settings = this.getCookie('settings')
		if (!this.settings) {
			this.storeObject('settings', this.defaultSettings)

			this.settings = this.defaultSettings;
		}

	}
	claimAchievment(id, type) {
		if (this.fullData[id].achievments[type] !== undefined) {
			this.fullData[id].achievments[type].claimed++;
			this.storeObject('fullData', this.fullData)

		} else {
			console.log('achievment ', type, ' not found')
		}
	}
	getAchievment(id, type) {
		if (this.fullData[id].achievments[type] !== undefined) {
			return this.fullData[id].achievments[type];

		} else {
			console.log('achievment ', type, ' from ', id, ' not found')
		}
	}
	addAchievment(id, type, quant = 1, hard = false) {
		if (this.fullData[id].achievments[type] !== undefined) {
			if (hard) {
				this.fullData[id].achievments[type].progress = quant;
			} else {
				this.fullData[id].achievments[type].progress += quant;
			}
			this.onUpdateAchievments.dispatch(type);
			this.storeObject('fullData', this.fullData)

		} else {
			console.log('achievment ', type, ' not found')
		}
	}
	getChunck(type, from = 'main') {
		return this.fullData[from][type]
	}
	saveChunk(type, data, from = 'main') {
		this.fullData[from][type] = data;
		this.storeObject('fullData', this.fullData)
	}
	sortCookie(id) {
		if (!this.fullData[id]) {
			this.fullData[id] = {}
		}
		var version = this.getCookie('cookieVersion')
		if (!version || version != this.version) {
			this.wipeData2()
		}

		this.fullData[id]['settings'] = this.sortCookieData('settings', this.defaultSettings);
		this.fullData[id]['player'] = this.sortCookieData('player', this.defaultPlayer);
		this.fullData[id]['gifts'] = this.sortCookieData('gifts', this.defaultGifts);
		this.fullData[id]['progression'] = this.sortCookieData('progression', this.defaultProgression);
		this.fullData[id]['economy'] = this.sortCookieData('economy', this.defaultEconomy);
		this.fullData[id]['achievments'] = this.sortCookieData('achievments', this.defaultAchievments);
		this.fullData[id]['loadout'] = this.sortCookieData('loadout', this.defaultLoadout);
		this.fullData[id]['items'] = this.sortCookieData('items', this.defaultItemProgression);
		this.fullData[id]['inventory'] = this.sortCookieData('inventory', this.defaultInventory);

		this.storeObject('fullData', this.fullData)

	}
	get inventory() {
		return this.getChunck('inventory');
	}
	get totalPlayers() {
		return this.getChunck('player').totalPlayers;
	}
	get currentPlayer() {
		return this.getChunck('player').currentPlayer;
	}
	get loadout() {
		return this.getChunck('loadout');
	}
	changePlayer(id) {
		const data = this.getChunck('player')
		data.currentPlayer = id;
		this.saveChunk('player', data)
	}
	sortPlayers() {
		const data = this.getChunck('player')
		for (let index = 0; index < data.totalPlayers; index++) {
			const element = this.getPlayer(index);
			if (!element) {
				this.savePlayer(index)
			}
		}
	}
	getPlayer(id) {
		const data = this.getChunck('player')
		if (!data.playerStructures || data.playerStructures.length <= id) {
			return null;
		} else {
			return data.playerStructures[id]
		}
	}
	saveEquipment(type, equip, level = 0) {
		const data = this.getChunck('loadout')
		if (data[type] === undefined) {
			console.log(type, 'not found on loadout, not saving');
			return;
		}



		data[type][this.currentPlayer].id = equip;
		data[type][this.currentPlayer].level = level;
		console.log(type, equip, 'saving', data);
		this.saveChunk('loadout', data)

	}

	addToInventory(type, equip) {
		const data = this.getChunck('inventory')
		if (data[type] === undefined) {
			console.log(type, 'not found on inventory, not saving', data);
			return;
		}
		data[type].push({ id: equip.id, level: equip.level });
		this.saveChunk('inventory', data)

	}
	removeFromInventory(type, equip, quant = 1) {
		const data = this.getChunck('inventory')
		if (data[type] === undefined) {
			console.log(type, 'not found on inventory, not saving', data);
			return;
		}
		for (let i = data[type].length - 1; i >= 0; i--) {
			const element = data[type][i]
			if (element.id == equip.id && element.level == equip.level) {
				data[type].splice(i, 1)
				quant --
				if(quant <= 0){
					break;
				}
			}
		}
		this.saveChunk('inventory', data);

	}

	savePlayer(id, dataToSave) {

		const data = this.getChunck('player')

		if (data.playerStructures.length <= id) {
			if (dataToSave) {

				data.playerStructures.push(dataToSave.serialize());
			} else {

				const newP = new PlayerViewStructure();
				data.playerStructures.push(newP.serialize());
			}

		} else {
			if (dataToSave) {

				data.playerStructures[id] = (dataToSave.serialize());
			} else {

				const newP = new PlayerViewStructure();
				data.playerStructures[id] = (newP.serialize());
			}

			const loadout = this.getChunck('loadout')

			if (loadout.currentWeapon.length < id + 1) {
				loadout.currentWeapon.push({ id: 'PISTOL_01', level: 0 })
				loadout.currentTrinket.push({ id: null, level: 0 })
				loadout.currentCompanion.push({ id: null, level: 0 })
				loadout.currentMask.push({ id: null, level: 0 })
				loadout.currentShoe.push({ id: null, level: 0 })
				this.saveChunk('loadout', loadout)
			}
		}
		this.saveChunk('player', data)

	}
	generateCookieData(nameID, defaultData, force = false) {
		let cookie = this.getCookie(nameID);
		if (force) {
			cookie = null;
		}
		let target
		if (cookie) {
			target = cookie;

			for (const key in defaultData) {
				const element = defaultData[key];
				if (target[key] === undefined) {
					target[key] = element;
				}
			}
		} else {
			target = defaultData
		}

		return target
	}
	sortCookieData(nameID, defaultData, force = false) {
		let cookie = this.getChunck(nameID);

		if (force) {
			cookie = null;
		}
		let target
		if (cookie) {
			target = cookie;

			for (const key in defaultData) {
				const element = defaultData[key];
				if (target[key] === undefined) {
					console.log("Cookie Default", nameID, cookie)
					target[key] = element;
					//this.storeObject(nameID, target)
				}
			}
		} else {
			target = defaultData
			//this.storeObject(nameID, target)
		}

		return target
	}
	updateResources(total, id) {
		this.fullData[id].economy.resources = total;
		this.fullData[id].economy.lastChanged = Date.now() / 1000 | 0
		//this.storeObject('economy', this.economy)
		this.storeObject('fullData', this.fullData)
	}
	resetAllCollects() {
		for (const key in this.resources) {
			if (Object.hasOwnProperty.call(this.resources, key)) {
				const element = this.resources[key];
				if (element.latestResourceCollect) {
					element.latestResourceCollect = Date.now() / 1000 | 0
					element.pendingResource = 0
				}
			}
		}
		this.storeObject('resources', this.resources)
	}
	pickResource(mergeData) {
		this.resources.entities[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.resources.entities[mergeData.rawData.nameID].latestResourceCollect = Date.now() / 1000 | 0
		this.resources.entities[mergeData.rawData.nameID].pendingResource = 0

		this.storeObject('resources', this.resources)

	}
	openSystem(id) {
		this.fullData[id].economy.lastOpen = Date.now() / 1000 | 0
		this.storeObject('fullData', this.fullData)
	}
	addResourceUpgrade(mergeData) {
		this.resources.entities[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		this.storeObject('resources', this.resources)
	}
	addPendingResource(mergeData, current) {
		this.resources.entities[mergeData.rawData.nameID].pendingResource = current
		this.resources.entities[mergeData.rawData.nameID].latestResourceAdd = Date.now() / 1000 | 0

		this.storeObject('resources', this.resources)
	}
	buyResource(mergeData) {
		this.resources.entities[mergeData.rawData.nameID] = {
			currentLevel: mergeData.currentLevel,
			latestResourceCollect: Date.now() / 1000 | 0,
			pendingResource: 0,
			latestResourceAdd: 0
		}
		this.storeObject('resources', this.resources)
	}

	addMergePiece(mergeData, i, j, id, blocked) {
		if (blocked > 0) {
			this.fullData[id].gifts.entities[i + ";" + j] = blocked
			this.fullData[id].board.entities[i + ";" + j] = null
		}
		if (mergeData == null) {
			this.fullData[id].board.entities[i + ";" + j] = null
		} else {
			this.fullData[id].gifts.entities[i + ";" + j] = null
			this.fullData[id].board.entities[i + ";" + j] = {
				nameID: mergeData.rawData.nameID,
			}
		}

		this.fullData[id].economy.lastChanged = Date.now() / 1000 | 0

		this.storeObject('fullData', this.fullData)
	}
	addMergePieceUpgrade(mergeData, id) {

		if (this.fullData[id].board.dataProgression[mergeData.rawData.nameID] == null) {
			this.fullData[id].board.dataProgression[mergeData.rawData.nameID] = {
				currentLevel: mergeData.currentLevel
			}
		} else {
			this.fullData[id].board.dataProgression[mergeData.rawData.nameID].currentLevel = mergeData.currentLevel
		}
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)
	}
	endTutorial(step) {
		this.stats.tutorialStep = step;
		this.storeObject('stats', this.stats)

	}
	saveBoardLevel(level, id) {
		this.fullData[id].board.currentBoardLevel = level;
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)

	}

	claimGift(id, override = 0) {
		this.fullData[id].progression.latestClaim = override ? override : Date.now();
		this.storeObject('fullData', this.fullData)
	}

	claimFreeMoney(id, override = 0) {
		this.fullData[id].progression.latestClaimFreeMoney = override ? override : Date.now();
		this.storeObject('fullData', this.fullData)
	}
	getLatestGiftClaimFreeMoney(id) {
		return this.fullData[id].progression.latestClaimFreeMoney;
	}
	getLatestGiftClaim(id) {
		return this.fullData[id].progression.latestClaim;
	}
	initBoard(id) {
		this.fullData[id].progression.isInitialized = true;
		this.storeObject('fullData', this.fullData)
	}
	isInitialized(id) {
		return this.fullData[id].progression.isInitialized;
	}
	saveBoardProgress(boardProgress, id) {
		this.fullData[id].board.boardLevel = boardProgress;
		this.storeObject('fullData', this.fullData)
		//this.storeObject('board', this.board)

	}

	updateModifyers(data) {
		this.modifyers = data;
		this.storeObject('modifyers', this.modifyers)
	}
	resetProgression() {
		this.sortCookieData('progression', this.defaultProgression, true)
		this.sortCookieData('modifyers', this.defaultModifyers, true)
		this.sortCookieData('resources', this.defaultResources, true)
		this.sortCookieData('economy', this.defaultEconomy, true)
	}
	getSettings() {
		return this.getCookie('settings')
	}
	setSettings(param, value) {
		if (this.settings[param] !== undefined) {
			this.settings[param] = value;
		}
		return this.storeObject('settings', this.settings)
	}
	getStats() {
		return this.getCookie('stats')
	}
	getModifyers() {
		return this.getCookie('modifyers')
	}
	getEconomy(id) {
		return this.fullData[id].economy
		return this.getCookie('economy')
	}

	getLastResourceTime(id) {
		return this.fullData[id].economy
	}

	getResources(id) {
		return this.fullData[id].resources
		return this.getCookie('resources')
	}
	getProgression() {
		return this.getCookie('progression')
	}

	getGifts(id) {
		return this.fullData[id].gifts//this.getCookie('board')
	}
	getBoard(id) {
		return this.fullData[id].board//this.getCookie('board')
	}

	createCookie(name, value, days) {
		let sValue = JSON.stringify(value);
		try {
			window.localStorage.setItem(name, sValue)
		} catch (e) {
		}
	}
	getCookie(name) {
		try {
			return JSON.parse(window.localStorage.getItem(name))
		} catch (e) {
			return this[name]
		}
	}
	storeObject(name, value) {

		try {
			window.localStorage.setItem(name, JSON.stringify(value))
		} catch (e) {
		}
	}
	resetCookie() {
		try {
			for (var i in window.localStorage) {
				window.localStorage.removeItem(i);
			}
		} catch (e) {
		}
	}
	wipeData() {
		this.resetCookie();

		try {
			window.localStorage.clear();
			window.location.reload();
		} catch (e) {
		}
	}

	wipeData2() {
		this.resetCookie();

		try {
			window.localStorage.clear();
			this.storeObject('cookieVersion', this.version)
			window.location.reload();
		} catch (e) {
		}
	}
}