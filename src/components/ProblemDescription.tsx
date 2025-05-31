'use client';

import React, { useState, useEffect, useRef } from 'react';

export type Problem = {
  id: number;
  title: string;
  difficulty: string;
  description: string;
  hints: string[];
};

interface ProblemDescriptionProps {
  focusArea: string;
  onSelect?: (problem: Problem) => void;
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ focusArea, onSelect }) => {
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showHints, setShowHints] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const randomId = Math.floor(Math.random() * 3500) + 1;
        const res = await fetch(`/api/problem/${randomId}`);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        const problem: Problem = {
          id: randomId,
          title: data.title,
          description: data.content,
          hints: data.hints || [],
          difficulty: data.difficulty
        };
        setSelectedProblem(problem);
        onSelect?.(problem);
      } catch (error) {
        console.error('Error fetching problem:', error);
      }
    };
    fetchProblem();
  }, [onSelect]);

  if (!selectedProblem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500">Loading problem...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg shadow-md h-full flex flex-col"
    >
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{selectedProblem.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm ${
            selectedProblem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            selectedProblem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {selectedProblem.difficulty}
          </span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div
            className="text-gray-700 leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: selectedProblem.description }}
          />
        </div>
        <div className="mt-6">
          <button
            onClick={() => setShowHints(!showHints)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
          >
            {showHints ? 'Hide Hints' : 'Show Hints'}
          </button>
          {showHints && (
            <div className="mt-3 space-y-2">
              {selectedProblem.hints.map((hint, index) => (
                <div key={index} className="bg-indigo-50 p-3 rounded-md text-sm text-gray-700">
                  <span className="font-medium text-indigo-700">Hint {index + 1}: </span>
                  {hint}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription; 