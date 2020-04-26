const fs = require('fs-extra')
const path = require('path')

fs.emptyDirSync(path.join(path.dirname(__filename), 'dist'))

