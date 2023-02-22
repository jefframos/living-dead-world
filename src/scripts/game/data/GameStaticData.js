import { Assets } from 'pixi.js';
import EnemyStaticData from './EnemyStaticData';
import Game from '../../Game';

export default class GameStaticData {

    static _instance;
    static get instance() {
        if (!GameStaticData._instance) {
            GameStaticData._instance = new GameStaticData();
        }
        return GameStaticData._instance;
    }

    constructor() {
        this.staticAssets = {};        
    }

    initialize() {
        let loadList = [
            { type:'entities', list: 'enemy', path: ['enemies'] },
            { type:'entities', list: 'player', path: ['players'] },
            { type:'entities', list: 'companions', path: ['companions'] },
            
            { type:'cards', list: 'cards', path: ['cards'] },
            
            { type:'weapons', list: 'main', path: ['main-weapons'] },
            { type:'weapons',list: 'viewOverriders', path: ['weapon-view-overriders'] },
            { type:'weapons',list: 'inGameView', path: ['weapon-ingame-view'] },
            
            { type:'animation',list: 'entity', path: ['entity-animation'], shared:true },
            { type:'animation',list: 'player', path: ['player-animation'], shared:true },
            { type:'animation',list: 'companion', path: ['companion-animation'], shared:true },

            { type:'vfx',list: 'weaponVFX', path: ['weapon-ss-vfx'], shared:true },
            { type:'vfx',list: 'entityVFXPack', path: ['entity-ss-vfx'] , shared:true},

            { type:'vfx',list: 'weaponVFXPack', path: ['weapon-ss-vfx-packs'] },
            //{ type:'vfx',list: 'particleDescriptors', path: ['entity-particle-descriptor'] },
            { type:'vfx',list: 'particleDescriptors', path: ['effects-descriptors'] },
            { type:'vfx',list: 'behaviours', path: ['vfx-behaviours'] },
        ]

        loadList.forEach(element => {
            if(!this.staticAssets[element.type]) {
                this.staticAssets[element.type] = {
                    sharedData:{}
                };   
            }
            if(!this.staticAssets[element.type][element.list]){
                this.staticAssets[element.type][element.list] = {
                    allElements:[]
                };
            }

            element.path.forEach(jsonPath => {
                let data = Game.MainLoader.resources[jsonPath].data.list
                if(!data){
                    data = Game.MainLoader.resources[jsonPath].data;
                }
                data.forEach(row => {
                    this.staticAssets[element.type][element.list].allElements.push(row);
                    this.staticAssets[element.type][element.list][row.id] = row;
                    if(element.shared){
                        this.staticAssets[element.type].sharedData[row.id] = row;
                    }
                });
            });
        });

        console.log(this.staticAssets)
    }
    getAllCards(){
        return this.getAllDataFrom('cards', 'cards');
    }
    getEntityByIndex(subtype = 'enemy', id = 0) {
        let type = 'entities';
        let data =  this.staticAssets[type][subtype].allElements[id];
        if(!data){
            console.error('unable to find data of', type, subtype, id)
        }else{
            return data;
        }
    }
    getEntityById(subtype = 'enemy', id) {
        let type = 'entities';
        let data =  this.staticAssets[type][subtype][id];
        if(!data){
            console.error('unable to find data of', type, subtype, id)
        }else{
            return data;
        }
    }

    getDataByIndex(type, subtype = 'enemy', id = 0) {
        let data =  this.staticAssets[type][subtype].allElements[id];
        if(!data){
            console.error('unable to find data of', type, subtype, id)
        }else{
            return data;
        }
    }
    getDataById(type, subtype = 'enemy', id) {
        let data =  this.staticAssets[type][subtype][id];
        if(!data){
            console.error('unable to find data of', type, subtype, id)
        }else{
            return data;
        }
    }
    getSharedDataById(type,  id) {
        let data =  this.staticAssets[type].sharedData[id];
        if(!data){
            console.error('unable to find sharedData of', type, id)
        }else{
            return data;
        }
    }
    getAllDataFrom(type, subtype = 'enemy') {
        let data =  this.staticAssets[type][subtype].allElements;
        if(!data){
            console.error('unable to find data of', type, subtype, id)
        }else{
            return data;
        }
    }
    
}