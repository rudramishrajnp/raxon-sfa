const fs = require('fs');

// 1. Dashboard.tsx
let db = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');
db = db.replace('setIsPunchedIn(false);\n      setPunchTime(null);', 
`if (window.confirm("Are you sure you want to Punch Out for today?")) {
        setIsPunchedIn(false);
        setPunchTime(null);
        alert("Punched out successfully!");
      }`);
fs.writeFileSync('src/pages/Dashboard.tsx', db);

// 2. Mtp.tsx
let mtp = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');
mtp = mtp.replace('setLoading(true);\n    try {', 
`if (!window.confirm("Are you sure you want to submit your MTP for approval? Once submitted, it cannot be edited.")) {
      return;
    }
    
    setLoading(true);
    try {`);
fs.writeFileSync('src/pages/Mtp.tsx', mtp);

// 3. Dcr.tsx
let dcr = fs.readFileSync('src/pages/Dcr.tsx', 'utf8');
dcr = dcr.replace('<button className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors">\n                End Day (Final Submit)\n              </button>',
`<button 
                onClick={() => {
                  if(window.confirm("Are you sure you want to end your day and submit the final Daily Call Report (DCR)?")) {
                    alert("DCR Submitted successfully!");
                  }
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors"
              >
                End Day (Final Submit)
              </button>`);
fs.writeFileSync('src/pages/Dcr.tsx', dcr);

// 4. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('Tracking')) {
  app = app.replace("import Approvals from './pages/Approvals';", "import Approvals from './pages/Approvals';\nimport Tracking from './pages/Tracking';");
  app = app.replace('<Route path="/approvals" element={<Approvals />} />', '<Route path="/approvals" element={<Approvals />} />\n          <Route path="/tracking" element={<Tracking />} />');
  fs.writeFileSync('src/App.tsx', app);
}
