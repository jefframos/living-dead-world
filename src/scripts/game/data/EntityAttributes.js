//thunder:
//bullets: every x seconds connect all bullets and hits enemies on the way
//player: increase speed and bullet speed

//fire 
//bullets: explodes every bullet after hit or remove
//player: increase defense and drop damage zone every x seconds

//leaf
//bullet: lower damage but absorve HP
//player: increase the speed, bullet distance and make player invencible for few time after every hit

//water
//player: every bullet drops a puddle that slow enemies on that area

//ice 
//bullet: ray cast back to the player and damages enemyes on the way
//player: slow player but adds ice protective shield
export default class EntityAttribute {
    constructor(){
        this.baseHealth = 100;
        this.baseDefense = 10;
        this.baseSpeed = 10;
        this.bulletSpeed = 10;
        this.bulletDistance = 10;
        this.damageZone = 10;
    }
}