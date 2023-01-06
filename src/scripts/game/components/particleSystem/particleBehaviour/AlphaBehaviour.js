import ParticleBehaviour from "./ParticleBehaviour";

export default class AlphaBehaviour extends ParticleBehaviour {
    constructor(time) {
        super();
        this.time = time;
        this.startValue = 1;
        this.endValue = 0;
    }
    build(params) {

        this.startValue = ParticleBehaviour.findValue(params.startValue) | 1;
        this.endValue = ParticleBehaviour.findValue(params.endValue) | 0.1;
        this.time = ParticleBehaviour.findValue(params.time) | 5;

    }
    update(delta) {
        super.update(delta);
    }
}