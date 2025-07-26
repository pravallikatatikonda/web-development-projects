// client/src/AdminPanel.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [unanswered, setUnanswered] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/unanswered')
      .then(res => {
        setUnanswered(res.data);
      })
      .catch(err => {
        console.error('Error fetching unanswered questions:', err);
      });
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Unanswered Questions</h2>
      {unanswered.length === 0 ? (
        <p className="text-gray-500">No unanswered questions logged.</p>
      ) : (
       <ul>
  {unanswered.map((item, index) => {
    if (typeof item === 'object' && item.question && item.timestamp) {
      return (
        <li key={index} className="mb-2 text-gray-800">
          {item.question}
          <br />
          <span className="text-sm text-gray-500">({item.timestamp})</span>
        </li>
      );
    } else {
      return null; // if it's not a valid question, skip it
    }
  })}
</ul>

      )}
    </div>
  );
};

export default AdminPanel;
