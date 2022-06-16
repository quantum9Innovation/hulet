// Core logic and functions for Hulet
// Most of the code depends on other modules

// Dependencies
const { form } = require('./math')


// Camera
class Camera {
    // Create a new camera linked to a specific canvas
    // Manages perspective, zoom, translation, and other 2D transformations

    constructor(Canvas) { 
        // Initialize the camera

        this.Canvas = Canvas
        this.center = [0, 0]
        this.zoom = Canvas.width / Canvas.cwidth

    }

    transform(vec) {
        // Transform a coordinate pair given by the vector `vec` from the 
        // Cartesian plane into the canvas coordinate system

        // Transformations
        let nVec = form.translate(vec, form.negate(this.center))
        nVec = form.scale(nVec, 1 / this.zoom)
        
        // Set origin to the top-left
        nVec = [nVec[0], -nVec[1]]
        nVec = form.translate(
            nVec, 
            [
                this.Canvas.cwidth / 2, 
                this.Canvas.cheight / 2
            ]
        )

        return nVec

    }
    invTransform(vec) {
        // Transform a coordinate pair given by the vector `vec` from the
        // canvas coordinate system into the Cartesian plane
        // *Inverse of `transform`*

        // Set origin to the top-left
        let nVec = form.translate(
            vec,
            [
                -this.Canvas.cwidth / 2,
                -this.Canvas.cheight / 2
            ]
        )
        nVec = [nVec[0], -nVec[1]]

        // Transformations
        nVec = form.scale(nVec, this.zoom)
        nVec = form.translate(nVec, this.center)

        return nVec

    }
    getEndpoints() {
        // Get the endpoints of the camera's viewport (as Cartesian coordinates)
        // In the order of the quadrants I-IV

        let w = this.Canvas.cwidth
        let h = this.Canvas.cheight
        let endpoints = [
            [w, 0],
            [0, 0],
            [0, h],
            [w, h],
        ]

        return endpoints.map(endpoint => this.invTransform(endpoint))

    }

}


// Create the Cartesian plane
class Cartesian {
    // Initialize a Cartesian plane over an existing canvas instance
    // The standard drawing context in Hulet

    constructor(ctx, w, h) {
        // Initialize a Cartesian plane over the given context `ctx` with
        // dimensions `w` (width) and `h` (height), which set the initial 
        // `Camera` perspective.

        // Set intrinsic canvas properties
        this.ctx = ctx
        this.cwidth = ctx.canvas.width
        this.cheight = ctx.canvas.height

        // Set internal canvas dimensions
        this.width = w
        this.height = h

        // Initialize the Cartesian plane
        this.init()

        // Control variables
        this.pointStyle = '#c70000'
        this.pointSize = 2.5
        this.strokeStyle = 'black'
        this.lineWidth = 2.5
        this.fillStyle = 'rgba(200, 0, 0, 0.5)'
        this.stroke = true
        this.fill = true

    }
    init() {
        // Initialize the Cartesian plane as the standard 2D rendering context
        // Performs basic setup routines on the canvas

        // Set the canvas to be white
        this.ctx.save()
        this.ctx.fillStyle = 'white'
        this.ctx.fillRect(0, 0, this.cwidth, this.cheight)
        this.ctx.restore()
        
        // Initialize the camera
        this.Camera = new Camera(this)

    }

    // Controls
    clear() {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.cwidth, this.cheight)
    }


    // Geometry
    point(vec) {
        // Draw a point at the given vector `vec`

        // Get coordinates
        let [x, y] = this.Camera.transform(vec)

        // Draw the point
        this.ctx.beginPath()
        this.ctx.arc(x, y, this.pointSize, 0, 2 * Math.PI)
        this.ctx.fillStyle = this.pointStyle
        this.ctx.fill()

    }
    segment(u, v) {
        // Draw a line segment from the vector `u` to the vector `v`

        // Get coordinates
        let [x1, y1] = this.Camera.transform(u)
        let [x2, y2] = this.Camera.transform(v)

        // Draw the segment
        this.ctx.beginPath()
        this.ctx.moveTo(x1, y1)
        this.ctx.lineTo(x2, y2)
        this.ctx.strokeStyle = this.strokeStyle
        this.ctx.lineWidth = this.lineWidth
        this.ctx.stroke()

    }
    ray(u, v) {
        // Draw a ray from the vector `u` extending past the vector `v`

        // Decompose coordinates
        let [x1, y1] = u
        let [x2, y2] = v

        // Calculate ray equation
        if (x1 === x2) {
            // Vertical ray

            // Determine direction
            let dir = y2 > y1 ? 1 : -1

            // Calculate endpoint
            let end
            let endY
            let endpoints = this.Camera.getEndpoints()
            dir === 1 ? endY = endpoints[0][1] : endY = endpoints[2][1]
            end = [x1, endY]

            // Draw the ray
            this.segment(u, end)

        }
        let m = (y2 - y1) / (x2 - x1)
        const rayEq = (x) => y1 + m * (x - x1)

        // Determine direction
        let dir = x2 > x1 ? 1 : -1

        // Calculate endpoint
        let end
        let endX
        let endpoints = this.Camera.getEndpoints()
        dir === 1 ? endX = endpoints[0][0] : endX = endpoints[1][0]
        end = [endX, rayEq(endX)]

        // Draw the ray
        this.segment(u, end)

    }
    line(u, v) {
        // Draw a line extending through two vectors `u` and `v`

        this.ray(u, v)
        this.ray(v, u)

    }
    polygon(vertices) {
        // Draw a polygon with the given vertices `vertices`

        // Get coordinates
        let coords = vertices.map(v => this.Camera.transform(v))

        // Draw the polygon
        this.ctx.beginPath()
        this.ctx.moveTo(coords[0][0], coords[0][1])

        for (let i = 1; i < coords.length; i++) {
            this.ctx.lineTo(coords[i][0], coords[i][1])
        }
        this.ctx.closePath()

        // Render polygon
        if (this.fill) {
            this.ctx.fillStyle = this.fillStyle
            this.ctx.fill()
        }
        if (this.stroke) {
            this.ctx.strokeStyle = this.strokeStyle
            this.ctx.lineWidth = this.lineWidth
            this.ctx.stroke()
        }

    }
    circle(c, r) {
        // Draw a circle with the given center `c` and radius `r`

        // Get coordinates
        let [x, y] = this.Camera.transform(c)

        // Draw the circle
        this.ctx.beginPath()
        this.ctx.arc(x, y, r / this.Camera.zoom, 0, 2 * Math.PI)
        if (this.fill) {
            this.ctx.fillStyle = this.fillStyle
            this.ctx.fill()
        }
        if (this.stroke) {
            this.ctx.strokeStyle = this.strokeStyle
            this.ctx.lineWidth = this.lineWidth
            this.ctx.stroke()
        }

    }

    // Algebra
    axes(x=true, y=true, style='black') {
        // Draw the Cartesian axes with `style='black'`
        // Use `x` and `y` to determine which axes to draw (default to `true`)

        let oldStyle = this.strokeStyle
        this.strokeStyle = style
        
        let endpoints = this.Camera.getEndpoints()
        if (x) this.segment([endpoints[1][0], 0], [endpoints[0][0], 0])
        if (y) this.segment([0, endpoints[2][1]], [0, endpoints[0][1]])

        this.strokeStyle = oldStyle

    }
    grid(delta, x=true, y=true, style='rgba(0,0,0,0.25)') {
        // Draw the Cartesian grid with the given spacing `delta` and
        // `style='rgba(0,0,0,0.25)'`; use `x` and `y` to determine 
        // which axes to draw (default to `true`)

        if (arguments.length === 2) {
            
            style = arguments[1]
            x = true
            y = true

        }

        let oldStyle = this.strokeStyle
        this.strokeStyle = style

        let endpoints = this.Camera.getEndpoints()
        let x1 = Math.round(endpoints[1][0] / delta) * delta
        let y1 = Math.round(endpoints[2][1] / delta) * delta
        let x2 = Math.round(endpoints[0][0] / delta) * delta
        let y2 = Math.round(endpoints[0][1] / delta) * delta

        if (x) {

            if (x1 <= 0 && x2 >= 0) {

                for (let x = 0; x < x2; x += delta) {
                    this.segment([x, y1], [x, y2])
                }
                for (let x = 0; x > x1; x -= delta) {
                    this.segment([x, y1], [x, y2])
                }

            } else {
                for (let x = x1 + delta; x < x2; x += delta) {
                    this.segment([x, y1], [x, y2])
                }
            }

        }
        if (y) {

            if (y1 <= 0 && y2 >= 0) {

                for (let y = 0; y < y2; y += delta) {
                    this.segment([x1, y], [x2, y])
                }
                for (let y = 0; y > y1; y -= delta) {
                    this.segment([x1, y], [x2, y])
                } 

            } else {
                for (let y = y1 + delta; y < y2; y += delta) {
                    this.segment([x1, y], [x2, y])
                }
            }

        }

        this.strokeStyle = oldStyle

    }
    label(delta, X=true, Y=true, style='black', font='16px times', offset=5) {
        // Label axes with the given spacing `delta` and `style='black'`, 
        // `font='times'`; use `X` and `Y` to determine which axes to label
        // (default to `true`)

        if (arguments.length == 2) {

            style = arguments[1]
            X = true
            Y = true

        } else if (arguments.length == 3) {

            if (typeof arguments[1] === 'string') {

                style = arguments[1]
                font = arguments[2]
                X = true
                Y = true

            }

        }

        this.ctx.save()
        this.ctx.font = font
        this.ctx.fillStyle = style

        let endpoints = this.Camera.getEndpoints()
        let x1 = Math.round(endpoints[1][0] / delta) * delta
        let y1 = Math.round(endpoints[2][1] / delta) * delta
        let x2 = Math.round(endpoints[0][0] / delta) * delta
        let y2 = Math.round(endpoints[0][1] / delta) * delta

        if (X) {

            for (let x = x1; x < x2; x += delta) {

                this.ctx.textAlign = 'center'
                this.ctx.textBaseline = 'top'

                if (x === 0) {
                    // Don't intersect origin label with axes
                    this.ctx.textAlign = 'right'
                    this.ctx.textBaseline = 'top'
                    let pos = this.Camera.transform([0, 0])
                    let dist = delta / this.Camera.zoom
                    this.ctx.fillText(x, pos[0] - offset, pos[1] + offset, dist)
                    continue

                }

                let pos = this.Camera.transform([x, 0])
                let dist = delta / this.Camera.zoom
                this.ctx.fillText(x, pos[0], pos[1] + offset, dist)

            }

        }
        if (Y) {

            for (let y = y1; y < y2; y += delta) {

                // Don't duplicate the origin label
                if (y == 0 && X) continue

                let pos = this.Camera.transform([0, y])
                this.ctx.textAlign = 'right'
                this.ctx.textBaseline = 'middle'
                this.ctx.fillText(y, pos[0] - offset, pos[1])

            }

        }

        this.ctx.restore()

    }
    parametric(f, T, k=256) {
        // Plot the parametric curve `f(t)` over the interval [`T[0]`, `T[1]`]
        // with `k=256` linear approximations

        let start = T[0]
        let span = T[1] - T[0]

        for (let i = 0; i < k; i++) {

            // Calculate the current parameter
            let t = start + i * span / k
            let [x, y] = f(t)

            // Calculate with the next parameter value
            let tPrime = start + (i + 1) * span / k
            let [xPrime, yPrime] = f(tPrime)

            // Plot a linear approximation
            this.segment([x, y], [xPrime, yPrime])

        }

    }
    graph(f, X, Y, k=256) {
        /*
            Plot the graph of `f(x, y)` over the domains:
            x ∈ [`X[0]`, `X[1]`] and y ∈ [`Y[0]`, `Y[1]`]
            with `k=256` linear approximations.
            If `X`, `Y` domains are not specified, 
            graph endpoints are used instead.
        */

        if (X === undefined || Y === undefined) {

            // Get endpoints
            let endpoints = this.Camera.getEndpoints()

            // Set domains
            X === undefined ? X = [endpoints[1][0], endpoints[0][0]] : X = X
            Y === undefined ? Y = [endpoints[2][1], endpoints[0][1]] : Y = Y

        }

        let start = X[0]
        let span = X[1] - X[0]

        for (let i = 0; i < k; i++) {

            // Calculate the current parameter
            let x = start + i * span / k
            if (x < X[0] || x > X[1]) continue
            let y = f(x)
            if (y < Y[0] || y > Y[1]) continue

            // Calculate with the next parameter value
            let xPrime = start + (i + 1) * span / k
            if (xPrime < X[0] || xPrime > X[1]) continue
            let yPrime = f(xPrime)
            if (yPrime < Y[0] || yPrime > Y[1]) continue

            // Plot a linear approximation
            this.segment([x, y], [xPrime, yPrime])

        }

    }

}


// Initialize Hulet and export relevant functions
module.exports = {

    // Base
    Cartesian,

    // Camera
    Camera,

}
