const path = require('path');

// get the file path where the main file is
// use require main instead because main.module is depriciated
module.exports = path.dirname(process.mainModule.filename);