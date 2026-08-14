const fs = require('fs');
let code = fs.readFileSync('src/pages/Mtp.tsx', 'utf8');

code = code.replace(`const handleSubmit = async () => {
    if (!isComplete) {
      alert("Please fill the plan for all working days before submitting.");
      return;
    }
    
    if (!window.confirm("Are you sure you want to submit your MTP for approval? Once submitted, it cannot be edited.")) {
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

fs.writeFileSync('src/pages/Mtp.tsx', code);
