export default class ParticleBehaviour {
    constructor() {

        this.property = 'alpha';
        this.type = 'sprite'

        this.time = 3;
        this.delay = 0;

        this.startValue = 0;
        this.endValue = 1;

        this.currentTime = 0;
        this.currentValue = 0;

        this.normalValue = 0;
    }
    reset() {
        this.currentTime = 0;
    }
    build(params) {

    }
    update(delta) {
        if (this.currentTime > this.time) {
            return;
        }
        this.normalValue = ParticleBehaviour.easeOutCubic(this.currentTime / this.time, 0, 1, 1);

        if (typeof this.currentValue === 'number') {
            this.currentValue = this.normalValue * (this.endValue - this.startValue) + this.startValue;
        }
        this.currentTime += delta;
    }


    static linearTween(t, b, c, d) {
        return c * t / d + b;
    }
    static easeOutCubic(t, b, c, d) {
        t /= d;
        t--;
        return c * (t * t * t + 1) + b;
    }
    static easeInExpo(t, b, c, d) {
        return c * Math.pow(2, 10 * (t / d - 1)) + b;
    }

    static easeInCirc(t, b, c, d) {
        t /= d;
        return -c * (Math.sqrt(1 - t * t) - 1) + b;
    }

    static findValue(data) {
        if (Array.isArray(data)) {
            if (data.length == 1) {
                return data[0];
            }
            return Math.random() * (data[1] - data[0]) + data[0];
        }
        return data;
    }
}