// Initialize Hulet and export relevant functions
// All logic is contained within `core.js`

// Imports
const core = require('./core')
const { Cartesian } = core

// Exports
module.exports = {
    // Reserved
    Cartesian,

    // Base
    core,

    // Metadata
    version: 'v0.1.4',

}
