const fs = require('fs');
let code = fs.readFileSync('src/pages/Dcr.tsx', 'utf8');

code = code.replace("import { getMTP, saveDCRCheckIn, getDCR } from '../lib/api';", 
"import { getMTP, saveDCRCheckIn, getDCR } from '../lib/api';\nimport { Modal } from '../components/Modal';");

code = code.replace("const [loading, setLoading] = useState(true);", 
"const [loading, setLoading] = useState(true);\n  const [showConfirm, setShowConfirm] = useState(false);\n  const [message, setMessage] = useState('');");

code = code.replace(`alert("Could not get location. Please enable GPS permissions and try again.");`, `setMessage("Could not get location. Please enable GPS permissions and try again.");`);
code = code.replace(`alert("Failed to save visit to database. Please check connection.");`, `setMessage("Failed to save visit to database. Please check connection.");`);

code = code.replace(`<button 
                onClick={() => {
                  if(window.confirm("Are you sure you want to end your day and submit the final Daily Call Report (DCR)?")) {
                    alert("DCR Submitted successfully!");
                  }
                }}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors"
              >
                End Day (Final Submit)
              </button>`,
`<button 
                onClick={() => setShowConfirm(true)}
                className="w-full py-3 bg-gray-900 text-white rounded-lg font-semibold shadow-md hover:bg-gray-800 transition-colors"
              >
                End Day (Final Submit)
              </button>`);

code = code.replace(`return (
    <div className="space-y-6">`, 
`return (
    <div className="space-y-6">
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm DCR Submission">
        <p className="text-gray-600 mb-6">Are you sure you want to end your day and submit the final Daily Call Report (DCR)?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={() => { setShowConfirm(false); setMessage("DCR Submitted successfully!"); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit DCR</button>
        </div>
      </Modal>
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>`);

fs.writeFileSync('src/pages/Dcr.tsx', code);
