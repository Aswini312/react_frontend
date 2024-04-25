import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = () => {
    axios.get('http://127.0.0.1:8000/api/history/')
      .then(response => {
        setHistory(response.data);
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
      <h2>History</h2>
      <ul>
        {history.map(item => (
          <li key={item.id}>
            BMI: {item.bmi_value.toFixed(2)} | Condition: {item.condition} | Height: {item.height}m | Weight: {item.weight}kg | Date: {item.date}
            <button onClick={() => deleteHistoryItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
