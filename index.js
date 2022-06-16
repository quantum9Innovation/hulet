
const canvas = document.getElementById('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.innerWidth < window.innerHeight ? canvas.height = window.innerWidth : canvas.width = window.innerHeight
const size = canvas.width

const ctx = canvas.getContext('2d')
const two = new hulet.Cartesian(ctx, 10, 10)

const refresh = () => {

    // Clear the canvas
    two.clear()

    // Algebra

    // Setup
    let delta = 2 ** Math.round( Math.log2(
        size / 10 * two.Camera.zoom
    ))

    two.grid(delta / 2, '#eee')
    two.grid(delta, '#bbb')
    two.label(delta, 'black', '24px times')
    two.axes()


    // Parametric
    const f = t => [Math.cos(t), Math.sin(t)]
    const T = [0, 2 * Math.PI]
    two.strokeStyle = '#0f0'
    two.parametric(f, T)


    // Function
    const g = x => x ** 2
    two.strokeStyle = '#f00'
    two.graph(g)

    const h = x => Math.sin(2 * x) * 2 / 3 + 1
    two.strokeStyle = '#00f'
    two.graph(h)

}; refresh()

// Zoom
let zoomSpeed = 1.1
const zoom = e => {

    e.preventDefault()
    k = e.deltaY > 0 ? zoomSpeed : 1 / zoomSpeed
    two.Camera.zoom *= k
    refresh()
    
}; canvas.onwheel = zoom

// Translation
let down = false
document.addEventListener('mousedown', () => { down = true })
document.addEventListener('mouseup', () => { 
    
    down = false
    x = undefined
    y = undefined

})

let x, y
const speed = 1.5
document.addEventListener('mousemove', e => {

    if (down) {
        
        if (x === undefined) x = e.clientX
        if (y === undefined) y = e.clientY

        const dx = e.clientX - x
        const dy = e.clientY - y

        let [cx, cy] = two.Camera.center
        cx -= dx * speed * two.Camera.zoom
        cy += dy * speed * two.Camera.zoom
        two.Camera.center = [cx, cy]

        x = e.clientX
        y = e.clientY

        refresh()

    }

})
