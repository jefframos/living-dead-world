export default class Utils {
    constructor(){
        
    }
    static shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    static lerp(x, y, a) {
        return x * (1 - a) + y * a;
    }
    static clamp(a, min = 0, max = 1) {
        return Math.min(max, Math.max(min, a));
    }
    static invlerp(x, y, a) {
        return clamp((a - x) / (y - x));
    }
    static range(x1, y1, x2, y2, a) {
        return lerp(x2, y2, invlerp(x1, y1, a));
    }
    static distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
}