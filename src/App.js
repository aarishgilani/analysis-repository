import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

const TOOLS = [
  {
    name: 'Nerd Science Analysis',
    component: React.lazy(() => import('./NerdScienceAnalysis.js'))
  },
  {
    name: 'Credible Interval Calculator',
    component: React.lazy(() => import('./CredibleIntervalCalculator.js'))
  },
  {
    name: 'Gittins Index Tool',
    component: React.lazy(() => import('./GittinsIndexTool.js'))
  },
  {
    name: 'Run Planner',
    component: React.lazy(() => import('./RunPlanner.js'))
  },
  {
    name: 'Tiny Experiments',
    component: React.lazy(() => import('./TinyExperiments.js'))
  },
  {
    name: 'Irrationality Proof System',
    component: React.lazy(() => import('./IrrationalityProofSystem.js'))
  },
  {
    name: "Euclid's Proof of Infinite Primes",
    component: React.lazy(() => import('./InfinitePrimesProof.js'))
  },
  {
    name: "Bézout's Lemma Tool",
    component: React.lazy(() => import('./BezoutLemma.js'))
  }
]

function App() {
  const [currentView, setCurrentView] = useState('home');

  return (

    <div className="min-h-screen bg-gray-100">
      <header className="p-8 text-center text-white bg-blue-600">
        <img src={logo} className="w-20 h-20 mx-auto animate-spin" alt="logo" />
        <p className="mt-4">
          <select
            onChange={(e) => setCurrentView(e.target.value)}
            className="px-4 py-2 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-gray-100"
            value={currentView}
          >
            <option value="home" disabled>Select a Tool</option>
            {TOOLS.map((tool) => (
              <option key={tool.name} value={tool.name.replace(/\s+/g, '')}>
                {tool.name}
              </option>
            ))}
          </select>
        </p>
        <button className="px-4 py-2 mt-4 font-semibold text-gray-800 transition-colors bg-yellow-400 rounded-lg hover:bg-yellow-300"
          onClick={() => setCurrentView(TOOLS[Math.floor(Math.random() * TOOLS.length)].name.replace(/\s+/g, ''))}
        >Surprise Me!</button>
      </header>

      {TOOLS.map((tool) => (
        currentView === tool.name.replace(/\s+/g, '') && <tool.component key={tool.name} />
      ))}
    </div>
  );
}

export default App;
