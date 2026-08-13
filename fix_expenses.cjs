const fs = require('fs');
let appContent = fs.readFileSync('src/App.tsx', 'utf8');

appContent = appContent.replace(
  "id: 'EXP-8801',",
  "id: 'EXP-8801', workType: 'OUTSTATION',"
).replace(
  "id: 'EXP-8802',",
  "id: 'EXP-8802', workType: 'EX-HQ',"
).replace(
  "id: 'EXP-8803',",
  "id: 'EXP-8803', workType: 'HQ',"
);

fs.writeFileSync('src/App.tsx', appContent);
