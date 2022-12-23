// transformSprite(sprite) {

//     let camM = [1, 0, 0, 0,
//         0, 1, 0, 0,
//         0, 0, 1, 0,
//         this.cam.x, this.cam.y, this.cam.z, 0]
//     var projectionMatrix = this.perspective(this.cam.fov, this.cam.aspec, this.cam.near, this.cam.far)

//     var somePoint = [sprite.gameObject.transform.position.x + this.cam.x, this.cam.y, sprite.gameObject.transform.position.y + this.cam.z];
//     var projectedPoint = this.transformPoint(projectionMatrix, somePoint);

//     var screenX = (projectedPoint[0] * 0.5 + 0.5) * config.width - config.width / 2;
//     var screenZ = (projectedPoint[1] * -0.5 + 0.5) * config.height + config.height / 2;

//     //let test = this.point3d_to_screen(sprite.gameObject.transform, camM, projectionMatrix, config.width, config.height)

//     if (this.debugg === undefined) {
//         this.debugg = 20
//     }

//     this.debugg--
//     if (this.debugg > 0) {

//         console.log(-projectedPoint[3] / 1000)
//     }

//     sprite.scale.set(-projectedPoint[3] / 1000 * 3)
//     sprite.x = screenX//test[0]
//     sprite.y = screenZ//test[1]

// }
// transformPoint(m, v) {
//     var x = v[0];
//     var y = v[1];
//     var z = v[2];
//     var w = x * m[0 * 4 + 3] + y * m[1 * 4 + 3] + z * m[2 * 4 + 3] + m[3 * 4 + 3];
//     return [(x * m[0 * 4 + 0] + y * m[1 * 4 + 0] + z * m[2 * 4 + 0] + m[3 * 4 + 0]) / w,
//     (x * m[0 * 4 + 1] + y * m[1 * 4 + 1] + z * m[2 * 4 + 1] + m[3 * 4 + 1]) / w,
//     (x * m[0 * 4 + 2] + y * m[1 * 4 + 2] + z * m[2 * 4 + 2] + m[3 * 4 + 2]) / w, w];
// }
// perspective(fieldOfViewYInRadians, aspect, zNear, zFar, dst) {
//     dst = dst || new Float32Array(16);

//     var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
//     var rangeInv = 1.0 / (zNear - zFar);

//     dst[0] = f / aspect;
//     dst[1] = 0;
//     dst[2] = 0;
//     dst[3] = 0;

//     dst[4] = 0;
//     dst[5] = f;
//     dst[6] = 0;
//     dst[7] = 0;

//     dst[8] = 0;
//     dst[9] = 0;
//     dst[10] = (zNear + zFar) * rangeInv;
//     dst[11] = -1;

//     dst[12] = 0;
//     dst[13] = 0;
//     dst[14] = zNear * zFar * rangeInv * 2;
//     dst[15] = 0;

//     return dst;
// }
// point3d_to_screen(point, cameraWorldMatrix, projMatrix, screenWidth, screenHeight) {
//     var mat, p, x, y;
//     p = [point[0], point[1], point[2], 1];
//     mat = mat4.create();
//     mat4.invert(mat, cameraWorldMatrix);
//     mat4.mul(mat, projMatrix, mat);
//     vec4.transformMat4(p, p, mat);
//     x = (p[0] / p[3] + 1) * 0.5 * screenWidth;
//     y = (1 - p[1] / p[3]) * 0.5 * screenHeight;
//     return [x, y];
// }