const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// 1. Add imports for Recharts and Geolocation
if (!appContent.includes('Recharts')) {
  const imports = `
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Geolocation } from '@capacitor/geolocation';
`;
  appContent = appContent.replace("import React,", imports + "import React,");
}

// 2. Add GPS State to DCR Modal
if (!appContent.includes('const [currentGps, setCurrentGps]')) {
  const gpsState = `
  const [currentGps, setCurrentGps] = useState<{lat: number, lng: number} | null>(null);
  const [fetchingGps, setFetchingGps] = useState(false);

  const fetchGpsLocation = async () => {
    setFetchingGps(true);
    try {
      const position = await Geolocation.getCurrentPosition();
      setCurrentGps({ lat: position.coords.latitude, lng: position.coords.longitude });
    } catch (e) {
      console.error("GPS Error", e);
    } finally {
      setFetchingGps(false);
    }
  };
  `;
  appContent = appContent.replace("const [newFeedback, setNewFeedback] = useState('');", "const [newFeedback, setNewFeedback] = useState('');\n" + gpsState);
}

// 3. Auto calculate DA/TA
if (!appContent.includes('// Auto generate expense logic')) {
  const expenseLogic = `
    // Auto generate expense logic
    if (calls.length === 0) {
      // First call of the day - Generate DA
      const newExp: ExpenseRecord = {
        id: \`EXP-\${Math.floor(Math.random() * 9000)}\`,
        date: new Date().toLocaleDateString(),
        taAmount: 150,
        daAmount: 300,
        miscAmount: 0,
        total: 450,
        status: 'Draft',
        billUploaded: false,
        workType: 'EX-HQ'
      };
      setExpenses([newExp, ...expenses]);
    }
  `;
  appContent = appContent.replace("setCalls([newCallItem, ...calls]);", expenseLogic + "\n    setCalls([newCallItem, ...calls]);");
}

// 4. Admin Dashboard - Recharts
if (!appContent.includes('BarChart data=')) {
  const adminDashboard = `
              {/* Added Realtime Performance Chart */}
              <div className="bg-[#0f172a] border border-slate-800/80 rounded-xl p-5 shadow-sm space-y-4 col-span-1 lg:col-span-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    Company Wide Performance (Targets vs Achievement)
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'Delhi HQ', target: 500000, achieved: 350000 },
                        { name: 'Mumbai HQ', target: 600000, achieved: 420000 },
                        { name: 'Bangalore HQ', target: 450000, achieved: 460000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Legend />
                        <Bar dataKey="target" fill="#3b82f6" name="Target (₹)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="achieved" fill="#10b981" name="Achieved (₹)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
              </div>
  `;
  appContent = appContent.replace("Global System Flags\n                  </h3>", "Global System Flags\n                  </h3>").replace('<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">', '<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">\n' + adminDashboard);
}

// 5. Enhance GPS UI in Modal
const oldGpsUI = `<div className="flex items-center space-x-2 text-[11px] text-emerald-400 pt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>GPS Location geofenced at current coordinates.</span>
              </div>`;
const newGpsUI = `
              <div className="flex items-center space-x-2 text-[11px] pt-1">
                <button type="button" onClick={fetchGpsLocation} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold">
                  {fetchingGps ? 'Fetching GPS...' : '📍 Capture Current Location'}
                </button>
                {currentGps && (
                  <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified ({currentGps.lat.toFixed(4)}, {currentGps.lng.toFixed(4)})
                  </span>
                )}
              </div>
`;
appContent = appContent.replace(oldGpsUI, newGpsUI);

fs.writeFileSync('src/App.tsx', appContent);
console.log('Update Complete');
