"use strict";
// A series of functions for working with 2D geometry through various 
// transformations; these functions are critical for the initial rendering 
// process
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotate = exports.negate = exports.scale = exports.translate = void 0;
// Linear transformations
// Translate a vector `u` by a transformation specified by vector `v`
const translate = (u, v) => [u[0] + v[0], u[1] + v[1]];
exports.translate = translate;
// Scale a vector `v` by scalar `k`
const scale = (v, k) => [v[0] * k, v[1] * k];
exports.scale = scale;
// Negate a vector `v` (180 deg rotation or scale with `k=-1`)
const negate = (v) => [-v[0], -v[1]];
exports.negate = negate;
const rotate = (v, theta) => {
    // Rotate a vector `v` by angle `theta`
    // Decompose vector into components
    let [x, y] = v;
    // Compute trigonometric values
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    // Compute new vector components
    const xNew = x * cosTheta - y * sinTheta;
    const yNew = x * sinTheta + y * cosTheta;
    // Return new vector
    return [xNew, yNew];
};
exports.rotate = rotate;
//# sourceMappingURL=form.js.map