// A series of functions for working with 2D geometry through various 
// transformations; these functions are critical for the initial rendering 
// process

// Typings
import { vector } from '../primitives'

// Linear transformations
// Translate a vector `u` by a transformation specified by vector `v`
const translate = (u: vector, v: vector): vector => [u[0] + v[0], u[1] + v[1]]
// Scale a vector `v` by scalar `k`
const scale = (v: vector, k: number): vector => [v[0] * k, v[1] * k]
// Negate a vector `v` (180 deg rotation or scale with `k=-1`)
const negate = (v: vector): vector => [-v[0], -v[1]]
const rotate = (v: vector, theta: number): vector => {
    // Rotate a vector `v` by angle `theta`

    // Decompose vector into components
    let [x, y] = v

    // Compute trigonometric values
    const cosTheta = Math.cos(theta)
    const sinTheta = Math.sin(theta)

    // Compute new vector components
    const xNew = x * cosTheta - y * sinTheta
    const yNew = x * sinTheta + y * cosTheta

    // Return new vector
    return [xNew, yNew]

}


export {

    translate,
    scale,
    negate,
    rotate

}
