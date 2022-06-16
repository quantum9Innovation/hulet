
let createHiPPICanvas = (w, h) => {

    let ratio = window.devicePixelRatio
    let canvas = document.getElementById('canvas')

    canvas.width = w * ratio
    canvas.height = h * ratio
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'
    // canvas.getContext('2d').scale(ratio,  ratio)

    return canvas

}

let cwidth = window.innerWidth
let cheight = window.innerHeight

window.innerWidth < window.innerHeight ? cheight = window.innerWidth : cwidth = window.innerHeight
let size = cwidth

const canvas = createHiPPICanvas(size, size)
const ctx = canvas.getContext('2d')
const two = new hulet.Cartesian(ctx, 10, 10)

let ratio = window.devicePixelRatio
size *= ratio


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


// Zoom (mouse)
let zoomSpeed = 1.1
const zoom = e => {

    e.preventDefault()
    k = e.deltaY > 0 ? zoomSpeed : 1 / zoomSpeed
    two.Camera.zoom *= k
    refresh()
    
}; canvas.onwheel = zoom

// Zoom (mobile)
let mZoomSpeed = 1.075
let oldDist, newDist
let scaling = false

const pinchZoom = e => {
    
    newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
    )
    if (oldDist === undefined) {
        oldDist = newDist
        return
    }

    let scale = newDist > oldDist ? 1 / mZoomSpeed : mZoomSpeed
    two.Camera.zoom *= scale

    oldDist = newDist
    refresh()

}

document.addEventListener('touchstart', e => {

    e.preventDefault()
    if (e.touches.length === 2) scaling = true

}, { passive: false })
document.addEventListener('touchmove', e => {
    if (scaling) pinchZoom(e)
}, { passive: false })
document.addEventListener(
    'touchend', 
    e => { scaling = false }, 
    { passive: false }
)


// Translation (drag)
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

// Translation (mobile)
let mDown = false
document.addEventListener('touchstart', () => { mDown = true })
document.addEventListener('touchend', e => {
    
    e.preventDefault()
    mDown = false
    mx = undefined
    my = undefined

})

let mx, my
const mSpeed = 3
document.addEventListener('touchmove', e => {

    if (mDown && !scaling) {
        
        e.preventDefault()
        if (mx === undefined) mx = e.touches[0].clientX
        if (my === undefined) my = e.touches[0].clientY

        const dx = e.touches[0].clientX - mx
        const dy = e.touches[0].clientY - my

        let [cx, cy] = two.Camera.center
        cx -= dx * mSpeed * two.Camera.zoom
        cy += dy * mSpeed * two.Camera.zoom
        two.Camera.center = [cx, cy]

        mx = e.touches[0].clientX
        my = e.touches[0].clientY

        refresh()

    }

})
