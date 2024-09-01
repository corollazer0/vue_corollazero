//node processMaps.js /path/to/old_assets /path/to/new_assets
//processMap 위치 : /check-in/.../PP_VUE/processMap.js
//dist/assets 위치 : /check-in/.../PP_VUE/dist/assets
//
const fs = require('fs');
const path = require('path');

// Define the directories containing the assets
const oldAssetsDir = process.argv[2] || path.join(__dirname, 'dist', 'old_assets');
const newAssetsDir = process.argv[3] || path.join(__dirname, 'dist', 'new_assets');

// Initialize oldAssetMap and newAssetMap objects
const oldAssetMap = {};
const newAssetMap = {};

// Function to generate a map from a given assets directory
function generateMap(directory, map, callback) {
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Error reading directory ${directory}:`, err);
            return;
        }

        files.forEach(file => {
            // Extract the program name and hash value from the filename
            // Assuming the filename format is: ProgramName-HashValue.Ext
            const match = file.match(/^(.+)-([a-zA-Z0-9]+)\.(.+)$/);
            if (match) {
                const [fullMatch, programName, hash, ext] = match;
                map[fullMatch] = {
                    filename: fullMatch,
                    programName: programName,
                    hash: hash,
                    type: ext
                };
            }
        });

        // Output the map object
        console.log(`AssetMap 생성 완료 (${directory}):`, map);
        callback(); // Proceed to the next step
    });
}

// Function to generate deleteMap based on oldAssetMap and newAssetMap
function generateDeleteMap() {
    const deleteMap = [];

    for (const key in oldAssetMap) {
        if (newAssetMap[key]) {
            if (oldAssetMap[key].hash !== newAssetMap[key].hash
                && oldAssetMap[key].ext === newAssetMap[key].ext) {
                deleteMap.push(oldAssetMap[key].filename);
            }
        } else {
            deleteMap.push(oldAssetMap[key].filename);
        }
    }

    console.log("삭제할 파일 목록 :");
    var deleteCount = 0;
    deleteMap.forEach(filename => {
        console.log(filename);
        deleteCount++;
    });
    console.log("삭제 파일 갯수: " + deleteCount);

    const deleteMapContent = deleteMap.join('\n');
    fs.writeFile('deleteFiles.txt', deleteMapContent, err => {
        if (err) {
            console.error('deleteFiles.txt 파일 생성 중 오류 발생:', err);
        } else {
            console.log('deleteFiles.txt 생성 완료.');
        }
    });
}

// Generate oldAssetMap and newAssetMap, then generate deleteMap
generateMap(oldAssetsDir, oldAssetMap, () => {
    generateMap(newAssetsDir, newAssetMap, generateDeleteMap);
});
