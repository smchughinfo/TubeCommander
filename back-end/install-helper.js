const fs = require("fs");
const path = require('path');

function createUpdateScriptIfNotExist() {
    var updatePath = "C:\\TubeCommander\\update.bat";
    var updateScript = fs.readFileSync(path.join(__dirname,"../update.bat"));
    if(fs.existsSync(updatePath) === false) {
        createTubeCommanderDirIfNotExit();
        fs.writeFileSync(updatePath, updateScript);
    }
}

function createSecretFileTemplateIfNotExist() {
    var secretPath = "C:\\TubeCommander\\secrets.json";
    if(fs.existsSync(secretPath) === false) {
        createTubeCommanderDirIfNotExit();
        fs.writeFileSync(secretPath, '{\n    "google-api-key": "my key - https://developers.google.com/youtube/v3/getting-started"\n}');
    }
}

function createTubeCommanderDirIfNotExit() {
    var tubeCommanderDir = "c:\\TubeCommander";
    if(fs.existsSync(tubeCommanderDir) === false) {
        fs.mkdirSync(tubeCommanderDir);
    }
}

module.exports = {
    CreateUpdateScriptIfNotExist: createUpdateScriptIfNotExist,
    CreateSecretFileTemplateIfNotExist: createSecretFileTemplateIfNotExist
}