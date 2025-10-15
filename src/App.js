import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import NerdScienceAnalysis from './NerdScienceAnalysis.js';
import CredibleIntervalCalculator from './CredibleIntervalCalculator.js';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (

    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-8 text-center">
        <img src={logo} className="mx-auto h-20 w-20 animate-spin" alt="logo" />
        <p className="mt-4">
          <button 
            onClick={() => setCurrentView('NerdScienceAnalysis')}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Nerd Science Analysis
          </button>
          <button 
            onClick={() => setCurrentView('CredibleIntervalCalculator')}
            className="bg-white ml-5 text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Credible Interval Calculator
          </button>
        </p>
      </header>

      {currentView === 'NerdScienceAnalysis' && <NerdScienceAnalysis />}
      {currentView === 'CredibleIntervalCalculator' && <CredibleIntervalCalculator />}
    </div>
  );
}

export default App;
