const fs = require('fs');
let code = fs.readFileSync('src/pages/Approvals.tsx', 'utf8');

code = code.replace("import { getPendingMTPs, approveMTP } from '../lib/api';", 
"import { getPendingMTPs, approveMTP } from '../lib/api';\nimport { Modal } from '../components/Modal';");

code = code.replace("const [loading, setLoading] = useState(true);", 
"const [loading, setLoading] = useState(true);\n  const [message, setMessage] = useState('');");

code = code.replace(`alert("MTP Approved successfully!");`, `setMessage("MTP Approved successfully!");`);
code = code.replace(`alert("Failed to approve MTP");`, `setMessage("Failed to approve MTP");`);

code = code.replace(`return (
    <div className="space-y-6">`, 
`return (
    <div className="space-y-6">
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>`);

fs.writeFileSync('src/pages/Approvals.tsx', code);
