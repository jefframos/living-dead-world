import Engine from "../core/Engine";
import GameAgent from "./GameAgent";
import GameObject from "../core/GameObject";
import PhysicsEntity from "./PhysicsEntity";
import PhysicsModule from "./PhysicsModule";
import StaticPhysicObject from "../entity/StaticPhysicObject";
import config from "../../config";
import glMat4 from "gl-mat4";

export default class RenderModule extends GameObject {
    constructor(container, shadowsContainer, debugContainer) {
        super();

        this.container = container;
        this.debugContainer = debugContainer;
        this.shadowsContainer = shadowsContainer;
        this.renderStats = {
            totalRenderEntities: 0
        }
        window.GUI.add(this.renderStats, 'totalRenderEntities').listen();

        this.cam = {
            x: 0, y: 250, z: 0, aspec: 1, fov: 5, near: 0, far: 200
        }
        window.GUI.add(this.renderStats, 'totalRenderEntities').listen();
        for (const key in this.cam) {
            if (Object.hasOwnProperty.call(this.cam, key)) {

                window.GUI.add(this.cam, key).listen();


            }
        }
    }
    start() {
        this.physics = this.engine.findByType(PhysicsModule)
        this.physics.entityAdded.add(this.newEntityAdded.bind(this))
    }
    newEntityAdded(entities) {
        entities.forEach(element => {
            let view

            if (element instanceof GameAgent) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                view = element.view;

            } else if (element instanceof StaticPhysicObject) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))

                let bounds = {
                    width: element.body.bounds.max.x - element.body.bounds.min.x,
                    height: element.body.bounds.max.y - element.body.bounds.min.y,
                }
                bounds.x = -bounds.width / 2
                bounds.y = -bounds.height / 2

                view = element.view;
                view.anchor.set(0.5)
                view.tint = 0
                view.width = bounds.width
                view.height = bounds.height
            } else if (element instanceof PhysicsEntity) {
                element.gameObjectDestroyed.add(this.elementDestroyed.bind(this))
                view = element.view;
            } else if (element.type == 'circle') {
                view = new PIXI.Sprite.from('new_item')
                view.anchor.set(0.5)
                view.width = element.body.circleRadius * 2
                view.height = element.body.circleRadius * 2
            } else {
                let bounds = {
                    width: element.body.bounds.max.x - element.body.bounds.min.x,
                    height: element.body.bounds.max.y - element.body.bounds.min.y,
                }
                bounds.x = -bounds.width / 2
                bounds.y = -bounds.height / 2
                view = new PIXI.Sprite.from('small-no-pattern-white')
                view.anchor.set(0.5)
                view.width = bounds.width
                view.height = bounds.height
            }

            if (element.debug) {
                this.debugContainer.addChild(element.debug)
            }

            if (element.shadow) {
                this.shadowsContainer.addChild(element.shadow)
            }

            if (!view) {
                return;
            }
            view.gameObject = element;
            this.container.addChild(view)
            if (!view.viewOffset) {
                view.viewOffset = { x: 0, y: 0 }
            }

        });

    }
    elementDestroyed(element) {
        if (element.view) {
            this.container.removeChild(element.view)
        }


        Engine.RemoveFromListById(this.children, element)

        if (element.debug) {
            this.debugContainer.removeChild(element.debug)
        }

        if (element.shadow) {
            this.shadowsContainer.removeChild(element.shadow)
        }
    }
    onRender() {
        if (!this.physics) return
        this.container.children.sort((a, b) => {
            if (a.y < b.y) {
                return -1;
            } else if (a.y > b.y) {
                return 1;
            } else {
                return 0;
            }
        });
        // this.container.children.forEach(element => {
        //     this.transformSprite(element);
        //     if(element.gameObject.shadow){
        //         element.gameObject.shadow.x = element.x
        //         element.gameObject.shadow.y = element.y
        //     }
        // });
        this.renderStats.totalRenderEntities = this.container.children.length;

    }
    transformSprite(sprite) {

        let camM = [1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            this.cam.x, this.cam.y, this.cam.z, 0]
        var projectionMatrix = this.perspective(this.cam.fov, this.cam.aspec, this.cam.near, this.cam.far)

        var somePoint = [sprite.gameObject.transform.position.x+this.cam.x, this.cam.y, sprite.gameObject.transform.position.y+this.cam.z];
        var projectedPoint = this.transformPoint(projectionMatrix, somePoint);

        var screenX = (projectedPoint[0] * 0.5 + 0.5) * config.width - config.width / 2;
        var screenZ = (projectedPoint[1] * -0.5 + 0.5) * config.height + config.height / 2;

        //let test = this.point3d_to_screen(sprite.gameObject.transform, camM, projectionMatrix, config.width, config.height)

        if (this.debugg === undefined) {
            this.debugg = 20
        }

        this.debugg--
        if (this.debugg > 0) {

            console.log(-projectedPoint[3]/1000)
        }
        
        sprite.scale.set(-projectedPoint[3]/1000 * 3)
        sprite.x = screenX//test[0]
        sprite.y = screenZ//test[1]

    }
    transformPoint(m, v) {
        var x = v[0];
        var y = v[1];
        var z = v[2];
        var w = x * m[0 * 4 + 3] + y * m[1 * 4 + 3] + z * m[2 * 4 + 3] + m[3 * 4 + 3];
        return [(x * m[0 * 4 + 0] + y * m[1 * 4 + 0] + z * m[2 * 4 + 0] + m[3 * 4 + 0]) / w,
        (x * m[0 * 4 + 1] + y * m[1 * 4 + 1] + z * m[2 * 4 + 1] + m[3 * 4 + 1]) / w,
        (x * m[0 * 4 + 2] + y * m[1 * 4 + 2] + z * m[2 * 4 + 2] + m[3 * 4 + 2]) / w, w];
    }
    perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
        dst = dst || new Float32Array(16);

        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
        var rangeInv = 1.0 / (zNear - zFar);

        dst[0] = f / aspect;
        dst[1] = 0;
        dst[2] = 0;
        dst[3] = 0;

        dst[4] = 0;
        dst[5] = f;
        dst[6] = 0;
        dst[7] = 0;

        dst[8] = 0;
        dst[9] = 0;
        dst[10] = (zNear + zFar) * rangeInv;
        dst[11] = -1;

        dst[12] = 0;
        dst[13] = 0;
        dst[14] = zNear * zFar * rangeInv * 2;
        dst[15] = 0;

        return dst;
    }
    point3d_to_screen(point, cameraWorldMatrix, projMatrix, screenWidth, screenHeight) {
        var mat, p, x, y;
        p = [point[0], point[1], point[2], 1];
        mat = mat4.create();
        mat4.invert(mat, cameraWorldMatrix);
        mat4.mul(mat, projMatrix, mat);
        vec4.transformMat4(p, p, mat);
        x = (p[0] / p[3] + 1) * 0.5 * screenWidth;
        y = (1 - p[1] / p[3]) * 0.5 * screenHeight;
        return [x, y];
    }
}