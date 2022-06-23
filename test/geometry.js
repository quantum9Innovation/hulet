// Test geometry
// Activate with: `mocha`

// Imports
const fs = require('fs')
const path = require('path')
const hulet = require('../hulet')
const { createCanvas } = require('canvas')

console.log('Starting geometry... (artifacts/geometry.png)')

// Canvases
const canvas = createCanvas(256, 256)
const ctx = canvas.getContext('2d')
const two = new hulet.Cartesian(ctx, 10, 10)

const draw = () => {
    // Geometry

    // Lines
    two.segment([0, 0], [1, 1])
    two.ray([-1, 2], [-1, -1])
    two.line([-2, 3], [2, 3])

    // Shapes
    two.polygon([
        [-1, -1],
        [-2, -1],
        [-2, -2],
        [-1, -2],
    ])
    two.stroke = false
    two.fillStyle = '#0af'
    two.circle([-3, -3], 1)

    // Points
    two.point([0, 0])
    two.point([1, 1])
}
draw()

// Storage
const out = fs.createWriteStream(
    path.join(__dirname, 'artifacts', 'geometry.png'),
)
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () => {
    console.log('Geometry succeeded')
})
