const fs = require('fs');
let code = fs.readFileSync('src/pages/Dashboard.tsx', 'utf8');

code = code.replace("import { PlayCircle, StopCircle, Clock, MapPin, CheckCircle2 } from 'lucide-react';", 
"import { PlayCircle, StopCircle, Clock, MapPin, CheckCircle2 } from 'lucide-react';\nimport { Modal } from '../components/Modal';");

code = code.replace("const [punchTime, setPunchTime] = useState<string | null>(null);", 
"const [punchTime, setPunchTime] = useState<string | null>(null);\n  const [showConfirm, setShowConfirm] = useState(false);\n  const [message, setMessage] = useState('');");

code = code.replace(`const handlePunch = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString());
    } else {
      if (window.confirm("Are you sure you want to Punch Out for today?")) {
        setIsPunchedIn(false);
        setPunchTime(null);
        alert("Punched out successfully!");
      }
    }
  };`, 
`const handlePunch = () => {
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchTime(new Date().toLocaleTimeString());
    } else {
      setShowConfirm(true);
    }
  };

  const confirmPunchOut = () => {
    setIsPunchedIn(false);
    setPunchTime(null);
    setShowConfirm(false);
    setMessage("Punched out successfully!");
    setTimeout(() => setMessage(''), 3000);
  };`);

// Append modals to return
code = code.replace(`return (
    <div className="space-y-6">`, 
`return (
    <div className="space-y-6">
      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirm Punch Out">
        <p className="text-gray-600 mb-6">Are you sure you want to Punch Out for today?</p>
        <div className="flex justify-end space-x-3">
          <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={confirmPunchOut} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Punch Out</button>
        </div>
      </Modal>
      <Modal isOpen={!!message} onClose={() => setMessage('')} title="Notification">
        <p className="text-gray-800 mb-6">{message}</p>
        <div className="flex justify-end">
          <button onClick={() => setMessage('')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">OK</button>
        </div>
      </Modal>`);

fs.writeFileSync('src/pages/Dashboard.tsx', code);
