import signals from "signals";

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
        this.usePoki = usePoki;
        this.gameplayIsStopped = true;
        this.onAdds = new signals.Signal();
        this.onStopAdds = new signals.Signal();
    }

    gameplayStop() {
        if (this.noPoki) return;
        if (this.gameplayIsStopped) {
            return
        }
        
        this.gameplayIsStopped = true;
        PokiSDK.gameplayStop();
    }
    gameplayStart(force = false) {
        if (this.noPoki) return;
        if (!this.gameplayIsStopped && !force) {
            return
        }
        this.gameplayIsStopped = false;
        PokiSDK.gameplayStart();
    }
    doComercial(callback, params) {
        if (this.noPoki) {
            if (callback) callback(params)
            return;
        }
        this.gameplayStop()

        if (this.isDebug) {
            this.gameplayStart()

            if (callback) callback(params)
            return
        }
        this.onAdds.dispatch();
        PokiSDK.commercialBreak().then(
            () => {
                console.log("Commercial break finished, proceeding to game");
                this.gameplayStart()
                this.onStopAdds.dispatch();

                if (callback) callback(params)
            }
        ).catch(
            () => {
                console.log("Initialized, but the user likely has adblock");
                this.gameplayStart()
                this.onStopAdds.dispatch();

                if (callback) callback(params)
            }
        );
    }

    doReward(callback, params) {
        if (this.noPoki) {
            if (callback) callback(params)
            return;
        }
        this.gameplayStop()

        if (this.isDebug) {
            this.gameplayStart()

            if (callback) callback(params)
            return
        }

        this.onAdds.dispatch();
        PokiSDK.rewardedBreak().then(
            (success) => {
                if (success) {
                    this.onStopAdds.dispatch();
                    this.gameplayStart()
                    if (callback) callback(params)
                } else {
                    this.onStopAdds.dispatch();
                    this.gameplayStart()
                    if (callback) callback(params)
                }
            }

        )
    }
}