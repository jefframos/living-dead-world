import signals from "signals";
import Game from "../../Game";
import CookieManager from "../CookieManager";

export default class RewardsManager {
    static _instance;
    static get instance() {
        if (!RewardsManager._instance) {
            RewardsManager._instance = new RewardsManager();
        }
        return RewardsManager._instance;
    }
    constructor() { }
    initialize(usePoki = false) {
        this.usePoki = !usePoki;
        this.noPoki = usePoki;
        this.rewardsPlaying = false;
        this.gameplayIsStopped = true;
        this.onAdds = new signals.Signal();
        this.onStopAdds = new signals.Signal();
        this.onAddBlock = new signals.Signal();
    }

    gameplayStop() {
        if (this.noPoki) return;
        if (this.gameplayIsStopped) {
            return
        }

        console.debug('gameplayStop')

        this.gameplayIsStopped = true;
        PokiSDK.gameplayStop();
    }
    gameplayStart(force = false) {
        if (this.noPoki) return;
        if (!this.gameplayIsStopped && !force) {
            return
        }

        console.debug('gameplayStart')

        this.gameplayIsStopped = false;
        PokiSDK.gameplayStart();
    }
    doComercial(callback, params, toGameplayStart) {
        if (this.noPoki) {
            if (callback) callback(params)
            SOUND_MANAGER.mute();

            return;
        }
        if (toGameplayStart) {
            this.gameplayStop()
        }

        if (this.isDebug) {
            //this.gameplayStart()

            if (callback) callback(params)
            return
        }
        this.onAdds.dispatch();
        SOUND_MANAGER.mute();
        console.debug('doComercial')

        this.rewardsPlaying = true;
        PokiSDK.commercialBreak().then(
            () => {
                this.rewardsPlaying = false;
                console.log("Commercial break finished, proceeding to game");
                if (toGameplayStart) {
                    this.gameplayStart()
                }
                this.onStopAdds.dispatch();
                this.sortOutSound();

                if (callback) callback(params)
            }
        ).catch(
            () => {
                console.log("Initialized, but the user likely has adblock");
                this.rewardsPlaying = false;
                if (toGameplayStart) {
                    this.gameplayStart()
                }
                this.onStopAdds.dispatch();
                this.sortOutSound();

                if (callback) callback(params)
            }
        );
    }

    doReward(callback, params, toGameplayStart) {
        if (this.noPoki) {
            if (callback) callback(params)
            return;
        }

        console.debug('doReward')
        this.gameplayStop()

        if (this.isDebug) {
            this.gameplayStart()

            if (callback) callback(params)
            return
        }


        this.onAdds.dispatch();

        this.rewardsPlaying = true;

        SOUND_MANAGER.mute();
        CookieManager.instance
        PokiSDK.rewardedBreak().then(
            (success) => {
                this.rewardsPlaying = false;
                if (success) {
                    this.onStopAdds.dispatch();
                    this.sortOutSound();
                    if (toGameplayStart) {
                        this.gameplayStart()
                    }
                    if (callback) callback(params)
                } else {
                    this.onStopAdds.dispatch();
                    this.sortOutSound();
                    if (toGameplayStart) {
                        this.gameplayStart()
                    }
                    if (Game.Debug.debug) {
                        if (callback) callback(params)
                    }
                    //this.onAddBlock.dispatch();
                }
            }

        ).catch(
            (error) => {
                console.log("REWARD CATCH", error)
                this.onStopAdds.dispatch();
                if (toGameplayStart) {
                    this.gameplayStart()
                }
                if (Game.Debug.debug) {
                    if (callback) callback(params)
                }
                //if (callback) callback(params)
                //this.onAddBlock.dispatch();
                //if (callback) callback(params)
            }
        );
    }

    sortOutSound() {
        if (!CookieManager.instance.isMute) {
            SOUND_MANAGER.unmute();
        }
    }
}