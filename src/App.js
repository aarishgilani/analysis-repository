import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import NerdScienceAnalysis from './NerdScienceAnalysis.js';
import CredibleIntervalCalculator from './CredibleIntervalCalculator.js';
import GittinsIndexTool from './GittinsIndexTool.js';
import RunPlanner from './RunPlanner.js';
import TinyExperiments from './TinyExperiments.js';

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (

    <div className="min-h-screen bg-gray-100">
      <header className="p-8 text-center text-white bg-blue-600">
        <img src={logo} className="w-20 h-20 mx-auto animate-spin" alt="logo" />
        <p className="mt-4">
          <button 
            onClick={() => setCurrentView('NerdScienceAnalysis')}
            className="px-6 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Nerd Science Analysis
          </button>
          <button 
            onClick={() => setCurrentView('CredibleIntervalCalculator')}
            className="px-6 py-2 ml-5 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Credible Interval Calculator
          </button>
          <button 
            onClick={() => setCurrentView('GittinsIndexTool')}
            className="px-6 py-2 ml-5 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Gittins Index Tool
          </button>
          <button 
            onClick={() => setCurrentView('RunPlanner')}
            className="px-6 py-2 ml-5 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Run Planner
          </button>
          <button 
            onClick={() => setCurrentView('TinyExperiments')}
            className="px-6 py-2 ml-5 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
          >
            Tiny Experiments
          </button>
        </p>
      </header>

      {currentView === 'NerdScienceAnalysis' && <NerdScienceAnalysis />}
      {currentView === 'CredibleIntervalCalculator' && <CredibleIntervalCalculator />}
      {currentView === 'GittinsIndexTool' && <GittinsIndexTool />}
      {currentView === 'RunPlanner' && <RunPlanner />}
      {currentView === 'TinyExperiments' && <TinyExperiments />}

    </div>
  );
}

export default App;
