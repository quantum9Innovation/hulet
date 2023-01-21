// Test algebra
// Activate with: `mocha`

// Imports
const fs = require('fs')
const path = require('path')
const hulet = require('../hulet')
const { createCanvas } = require('canvas')

console.log('Starting algebra... (artifacts/algebra.png)')

// Canvases
const canvas = createCanvas(256, 256)
const ctx = canvas.getContext('2d')
const two = new hulet.Cartesian(ctx, 4, 4)

const draw = () => {
    // Algebra

    // Setup
    two.grid(1 / 2, '#ccc')
    two.grid(1)
    two.axes()
    two.label(1 / 2, '16px times')

    // Parametric
    const f = (t) => [Math.cos(t), Math.sin(t)]
    const T = [0, 2 * Math.PI]
    two.parametric(f, T)

    // Function
    const g = (x) => x ** 2
    two.strokeStyle = '#f00'
    two.graph(g)

    const h = (x) => (Math.sin(2 * x) * 2) / 3 + 1
    two.strokeStyle = '#00f'
    two.graph(h)
}
draw()

// Storage
const out = fs.createWriteStream(
    path.join(__dirname, 'artifacts', 'algebra.png'),
)
const stream = canvas.createPNGStream()
stream.pipe(out)
out.on('finish', () => {
    console.log('Algebra succeeded')
})
