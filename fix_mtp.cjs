const fs = require('fs');
let code = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');

code = code.replace("import { submitMTP, getMTP } from '../lib/api';", 
"import { submitMTP, getMTP } from '../lib/api';\nimport { Modal } from '../components/Modal';");

code = code.replace("const [loading, setLoading] = useState(false);", 
"const [loading, setLoading] = useState(false);\n  const [showConfirm, setShowConfirm] = useState(false);\n  const [message, setMessage] = useState('');");

code = code.replace(`const handleSubmit = async () => {
    if (!window.confirm("Are you sure you want to submit your MTP for approval? Once submitted, it cannot be edited.")) {
      return;
    }
    
    if (!isComplete) {
      alert("Please fill the plan for all working days before submitting.");
      return;
    }
    
    setLoading(true);
    try {
      await submitMTP(monthYear, plans);
      setStatus('submitted');
      alert("MTP Submitted successfully to Manager for approval.");
    } catch (error) {
      console.error("Error submitting MTP:", error);
      alert("Failed to submit MTP.");
    }
    setLoading(false);
  };`, 
`const handleSubmit = () => {
    if (!isComplete) {
      setMessage("Please fill the plan for all working days before submitting.");
      return;
    }
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);
    try {
      await submitMTP(monthYear, plans);
      setStatus('submitted');
      setMessage("MTP Submitted successfully to Manager for approval.");
    } catch (error) {
      console.error("Error submitting MTP:", error);
      setMessage("Failed to submit MTP.");
    }
    setLoading(false);
  };`);

code = code.replace(`return (
    <div className="space-y-6">`, 
`return (
    <div className="space-y-6">
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm MTP Submission">
        <p className="text-gray-600 mb-6">Are you sure you want to submit your MTP for approval? Once submitted, it cannot be edited.</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={confirmSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Submit</button>
        </div>
      </Modal>
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>`);

fs.writeFileSync('src/pages/Mtp.tsx', code);
