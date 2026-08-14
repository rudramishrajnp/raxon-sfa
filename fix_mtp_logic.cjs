const fs = require('fs');
let code = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');

// 1. Give feedback if trying to edit non-draft
code = code.replace(`const handleAreaSelect = (dateStr: string, area: string) => {
    if (status !== 'draft') return;
    setPlans(prev => ({ ...prev, [dateStr]: area }));
  };`,
`const handleAreaSelect = (dateStr: string, area: string) => {
    if (status !== 'draft') {
      setMessage("Cannot edit MTP. Current status is: " + status);
      return;
    }
    setPlans(prev => ({ ...prev, [dateStr]: area }));
  };`);

// 2. Add a Reset button for demo purposes
code = code.replace(`<h1 className="text-2xl font-bold text-gray-900">Monthly Tour Plan (MTP)</h1>`,
`<div className="flex items-center space-x-4"><h1 className="text-2xl font-bold text-gray-900">Monthly Tour Plan (MTP)</h1>
{status !== 'draft' && (
  <button onClick={() => { setStatus('draft'); setPlans({}); setMessage("Reset to draft for testing!"); }} className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded border border-red-200">
    Reset (Demo)
  </button>
)}</div>`);

fs.writeFileSync('src/pages/Mtp.tsx', code);
