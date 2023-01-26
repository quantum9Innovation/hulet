// Test algebra
// Activate with: `mocha`

// Imports
import * as hulet from '../hulet'
import { expect } from '@jest/globals'
import { join } from 'path'
import { readFileSync } from 'fs'
import { createCanvas, Canvas } from 'canvas'

// Type extractions
type vector = [number, number]
type range = [number, number]

// Helper funcs
const check = (data: Canvas, filename: string) => {
    // Check local file against baseline image
    const DATA = data.toDataURL()
    const BASELINE = 'data:image/png;base64,'
        + readFileSync(join(__dirname, 'baseline', filename), { encoding: 'base64' })
    expect(DATA).toBe(BASELINE)
}

// Tests
// Draw algebraic curves
test('algebra', () => {
    // Canvases
    const canvas = createCanvas(256, 256)
    const ctx: any = canvas.getContext('2d')
    const two = new hulet.Cartesian(ctx, 4, 4)

    // Algebra

    // Setup
    two.grid(1 / 2, '#ccc')
    two.grid(1)
    two.axes()
    two.label(1 / 2, '16px times')

    // Parametric
    const f = (t: number): vector => [Math.cos(t), Math.sin(t)]
    const T: range = [0, 2 * Math.PI]
    two.parametric(f, T)

    // Function
    const g = (x: number) => x ** 2
    two.strokeStyle = '#f00'
    two.graph(g)

    const h = (x: number) => Math.sin(2 * x) * 2 / 3 + 1
    two.strokeStyle = '#00f'
    two.graph(h)

    // Finish
    check(canvas, 'algebra.png')
})

// Draw geometric objects
test('geometry', () => {
    // Canvases
    const canvas = createCanvas(256, 256)
    const ctx: any = canvas.getContext('2d')
    const two = new hulet.Cartesian(ctx, 10, 10)

    // Geometry

    // Lines
    two.segment([0, 0], [1, 1])
    two.ray([-1, 2], [-1, -1])
    two.line([-2, 3], [2, 3])

    // Shapes
    two.polygon([[-1, -1], [-2, -1], [-2, -2], [-1, -2]])
    two.stroke = false; two.fillStyle = '#0af'
    two.circle([-3, -3], 1)

    // Points
    two.point([0, 0])
    two.point([1, 1])

    // Finish
    check(canvas, 'geometry.png')
})
