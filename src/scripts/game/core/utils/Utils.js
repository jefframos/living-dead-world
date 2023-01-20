export default class Utils {
    constructor(){
        
    }
    static shuffle(a) {
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    static shortAngleDist(a0,a1) {
        var max = Math.PI*2;
        var da = (a1 - a0) % max;
        return 2*da % max - da;
    }
    static scaleToFit(element, size){
        return Math.min(size / element.width * element.scale.x, size / element.height * element.scale.y)
    }
    static angleLerp(a0,a1,t) {
        return a0 + Utils.shortAngleDist(a0,a1)*t;
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
    static distSort(point, array){

        array.forEach(element => {
            element._playerDist = this.distance(element.transform.position.x,element.transform.position.z,point.x, point.z)
        });

        array.sort(Utils.playerDistCompare)
    }
    static collidingDistSort(point, array){

        array.forEach(element => {
            element._playerDist = this.distance(element.entity.transform.position.x,element.entity.transform.position.z,point.x, point.z)
        });

        array.sort(Utils.playerDistCompare)
    }

    static playerDistCompare(a, b) {
        var yA = a._playerDist;
        var yB = b._playerDist;
        if (yA === yB) {
            return 0;
        }
        if (yA < yB) {
            return -1;
        }
        if (yA > yB) {
            return 1;
        }
        return 0;
    }
}