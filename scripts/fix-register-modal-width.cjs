/* eslint-disable no-console */
const fs = require('fs');

function patch(path){
  let s = fs.readFileSync(path,'utf8');
  const before = s;
  s = s.replace(/\.registerModel-content \.modal-content \{\s*\n\s*width: 110%;\s*\n\}/m, '.registerModel-content .modal-content {\n  width: 100%;\n  max-width: 100%;\n}');
  if (s === before) {
    console.log('no change:', path);
    return;
  }
  fs.writeFileSync(path,s,'utf8');
  console.log('updated:', path);
}
patch('resources/pos/src/assets/css/frontend.css');
patch('resources/pos/src/assets/css/frontend.rtl.css');
