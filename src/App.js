import React, { useState, useEffect } from 'react';
import axios from 'axios';
import History from './History'; // Import the History component

function App() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBMI] = useState(null);
  const [condition, setCondition] = useState('');
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false); // State to toggle showing history
  const [history, setHistory] = useState([]); // Define setHistory

  useEffect(() => {
    fetchHistory();
  }, [showHistory]); // Fetch history whenever showHistory changes

  const calculateBMI = () => {
    if (height && weight) {
      axios.post('http://127.0.0.1:8000/api/calculate/', { height, weight })
        .then(response => {
          setBMI(response.data.bmi_value);
          setCondition(response.data.condition);
          setHeight('');
          setWeight('');
          setError(null); // Reset error message
          fetchHistory(); // Fetch history again after calculating BMI
        })
        .catch(error => setError('Error calculating BMI'));
    } else {
      setError('Please enter height and weight');
    }
  };

  const clearFields = () => {
    setHeight('');
    setWeight('');
    setBMI(null);
    setCondition('');
    setError(null);
  };

  const fetchHistory = () => {
    axios.get('http://127.0.0.1:8000/api/history/')
      .then(response => {
        setHistory(response.data); // Update history using setHistory
      })
      .catch(error => console.error('Error:', error));
  };

  const deleteHistoryItem = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/history/${id}/`)
      .then(() => {
        fetchHistory();
      })
      .catch(error => console.error('Error:', error));
  };

  return (
    <div>
      <h2>BMI Calculator</h2>
      <div>
        <input type="text" placeholder="Enter height (in meters)" value={height} onChange={(e) => setHeight(e.target.value)} />
        <input type="text" placeholder="Enter weight (in kilograms)" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <button onClick={calculateBMI}>Calculate BMI</button>
        <button onClick={clearFields}>Clear</button>
        <button onClick={() => setShowHistory(!showHistory)}>History</button> {/* Toggle History visibility */}
      </div>
      {error && <div>{error}</div>}
      {bmi && (
        <div>
          <p>BMI: {bmi.toFixed(2)}</p>
          <p>Condition: {condition}</p>
        </div>
      )}
      {showHistory && <History history={history} deleteHistoryItem={deleteHistoryItem} />} {/* Render History component when showHistory is true */}
    </div>
  );
}

export default App;
