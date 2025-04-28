const fs = require('fs-extra');
const path = require('path');

const from = path.resolve(__dirname, "../release/win-unpacked/resources/app/dist");
const to = path.resolve(from, "../");

(async () => {
    try {
        const items = await fs.readdir(from);

        for (const item of items) {
            const srcPath = path.join(from, item);
            const destPath = path.join(to, item);
            await fs.move(srcPath, destPath, { overwrite: true });
        }

        console.log('Good.');
        await fs.remove(from);
    } catch (err) {
        console.error('Somthing wrong:', err);
    }
})();