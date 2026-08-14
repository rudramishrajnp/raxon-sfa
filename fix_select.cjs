const fs = require('fs');
let code = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');

// Ensure disabled state doesn't trap mobile users without explanation
code = code.replace(`disabled={status !== 'draft'}`, 
`onClick={() => { if(status !== 'draft') setMessage("Cannot edit. MTP is already " + status); }}`);

fs.writeFileSync('src/pages/Mtp.tsx', code);
