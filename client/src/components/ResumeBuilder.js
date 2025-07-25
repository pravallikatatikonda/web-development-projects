import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const ResumeBuilder = () => {
  const [resumeText, setResumeText] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const printRef = useRef();

  const handleSuggest = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
      } else {
        setSuggestions(['No suggestions received.']);
      }
    } catch (error) {
      console.error('❌ Suggestion error:', error);
      setSuggestions(['Error fetching suggestions. Please try again later.']);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Smart Resume',
  });

  return (
    <div className="p-6 font-sans min-h-screen bg-gray-100 flex flex-col gap-6 items-center">
      <h1 className="text-3xl font-bold text-purple-700 text-center">Smart Resume Builder</h1>

      <textarea
        className="w-full max-w-3xl h-40 p-4 border border-gray-300 rounded-lg shadow-sm resize-none"
        placeholder="Paste your resume text here..."
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
      />

      <div className="flex gap-4">
        <button
          onClick={handleSuggest}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Suggest Improvements'}
        </button>

        <button
          onClick={handlePrint}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          Export PDF
        </button>
      </div>

      <div
        ref={printRef}
        className="bg-white p-8 mt-6 border rounded shadow-md w-full max-w-3xl text-center print:shadow-none print:border-none"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Resume Preview</h2>

        <div className="whitespace-pre-wrap text-left text-sm text-gray-800 leading-relaxed">
          {resumeText || 'No resume content added yet.'}
        </div>

        {suggestions.length > 0 && (
          <>
            <h3 className="text-lg font-semibold mt-6 text-purple-600">AI Suggestions:</h3>
            <ul className="list-disc ml-6 mt-2 text-left text-sm text-gray-700">
              {suggestions.map((sug, index) => (
                <li key={index}>{sug}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeBuilder;
