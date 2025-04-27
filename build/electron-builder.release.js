const path = require('path');

module.exports = {
    appId: 'zxc.artreader',
    productName: 'ArtReader',
    directories: {
        output: path.resolve(__dirname, '../release')
    },
    files: [
        'dist/**/*',
        'node_modules/**/*',
        'package.json'
    ],
    asar: false,
    win: {
        target: 'nsis',
        icon: 'build/icons/icon.ico'
    },
    mac: {
        target: 'dmg',
        icon: 'build/icons/icon.icns'
    }, //mb will buy mac:D
    linux: {
        target: 'AppImage',
        icon: 'build/icons'
    },
    nsis: {
        oneClick: false,
        perMachine: true,
        allowToChangeInstallationDirectory: true
    }
};
