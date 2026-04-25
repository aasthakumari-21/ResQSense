const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'client/src/pages');

// Also update App.jsx
const appPath = path.join(__dirname, 'client/src/App.jsx');

const updateVariables = (content) => {
    return content
        // Colors & Backgrounds
        .replace(/text-white/g, 'text-text')
        .replace(/text-gray-300/g, 'text-slate-700')
        .replace(/text-gray-400/g, 'text-slate-600')
        .replace(/text-gray-500/g, 'text-slate-500')
        .replace(/text-blue-200/g, 'text-blue-700')
        .replace(/bg-black/g, 'bg-background')
        .replace(/bg-surface\/50/g, 'bg-surface border-slate-200')
        
        // Borders
        .replace(/border-white\/10/g, 'border-slate-200/80')
        .replace(/border-white\/5/g, 'border-slate-200/50')
        .replace(/border-white\/20/g, 'border-slate-300')
        .replace(/border-white\/50/g, 'border-slate-400')
        
        // Maps
        .replace(/dark_all/g, 'light_all')
        .replace(/dark_nolabels/g, 'light_nolabels')
        .replace(/text-black/g, 'text-slate-900') // inside popups
};

let appContent = fs.readFileSync(appPath, 'utf8');
appContent = updateVariables(appContent);
// Give text-white replacement explicitly back into app if text-text doesn't work for hover
appContent = appContent.replace(/hover:text-white/g, 'hover:text-text');
fs.writeFileSync(appPath, appContent);

fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    files.forEach(function (file) {
        if(file.endsWith('.jsx')) {
            const filePath = path.join(directoryPath, file);
            let content = fs.readFileSync(filePath, 'utf8');
            content = updateVariables(content);
            
            // Welcome page specific adjustments
            if(file === 'WelcomePage.jsx') {
                content = content.replace(/to-black\/80/g, 'to-slate-100/90');
                content = content.replace(/from-black\/60/g, 'from-slate-100/50');
                content = content.replace(/text-text/g, 'text-slate-900'); // overriding the previous replace
                content = content.replace(/text-gray-300/g, 'text-slate-800');
            }

            fs.writeFileSync(filePath, content);
        }
    });
});

console.log("Light theme updates injected across React components.");
