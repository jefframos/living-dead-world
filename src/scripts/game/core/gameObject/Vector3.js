export default class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    copy(target){
        this.x = target.x;
        this.y = target.y;
        this.z = target.z;
    }
    zero(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }
    static distance(v1,v2) {
        return Math.sqrt((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y) + (v1.z - v2.z) * (v1.z - v2.z));
    }
    static atan2XZ(v1,v2) {
        return Math.atan2(v1.z - v2.z, v1.x - v2.x)
    }
}