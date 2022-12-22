export default class Layer {

    static Nothing = 0;
    static Everything = 1;
    static Default = 2;
    static Player = 0b0001;
    static Enemy = 0b0011;
    static Environment = 0b0010;
    static Bullet = 0b0100;

    static PlayerCollision = Layer.Environment | Layer.Default | Layer.Enemy
    static EnemyCollision = Layer.Environment | Layer.Default | Layer.Player | Layer.Bullet
    static BulletCollision = Layer.Environment | Layer.Default | Layer.Enemy
}