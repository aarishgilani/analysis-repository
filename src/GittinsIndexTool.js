import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const GittinsIndexTool = () => {
  const [arms, setArms] = useState([
    { id: 1, name: 'Arm A', trueProbability: 0.6, pulls: 0, successes: 0, color: '#667eea' },
    { id: 2, name: 'Arm B', trueProbability: 0.4, pulls: 0, successes: 0, color: '#f093fb' },
    { id: 3, name: 'Arm C', trueProbability: 0.7, pulls: 0, successes: 0, color: '#4facfe' },
  ]);
  
  const [strategy, setStrategy] = useState('gittins');
  const [discountFactor, setDiscountFactor] = useState(0.95);
  const [autoPlaySpeed, setAutoPlaySpeed] = useState(500);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [totalReward, setTotalReward] = useState(0);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [epsilon, setEpsilon] = useState(0.1);
  const [ucbC, setUcbC] = useState(2);
  const [showProbabilities, setShowProbabilities] = useState(false);
  
  // Beta distribution functions
  const logGamma = (z) => {
    if (z < 0.5) {
      return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    }
    const g = 7;
    const C = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    z -= 1;
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
      x += C[i] / (z + i);
    }
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  };
  
  const calculateGittinsIndex = (successes, failures, gamma) => {
    const alpha = successes + 1;
    const beta = failures + 1;
    
    // Simplified Gittins index approximation
    // For Bernoulli bandits with Beta prior
    const mean = alpha / (alpha + beta);
    const n = alpha + beta;
    
    // Use a calibration approximation
    // Higher uncertainty and higher mean both increase the index
    const uncertainty = Math.sqrt((alpha * beta) / (n * n * (n + 1)));
    const explorationBonus = uncertainty * Math.sqrt(1 / (1 - gamma));
    
    return Math.min(0.99, mean + explorationBonus);
  };
  
  const calculateUCB = (arm, totalPulls) => {
    if (arm.pulls === 0) return Infinity;
    const mean = arm.successes / arm.pulls;
    const exploration = Math.sqrt((ucbC * Math.log(totalPulls)) / arm.pulls);
    return mean + exploration;
  };
  
  const selectArmByStrategy = () => {
    const totalPulls = arms.reduce((sum, arm) => sum + arm.pulls, 0);
    
    switch (strategy) {
      case 'gittins':
        const gittinsIndices = arms.map(arm => ({
          ...arm,
          index: calculateGittinsIndex(arm.successes, arm.pulls - arm.successes, discountFactor)
        }));
        return gittinsIndices.reduce((best, current) => 
          current.index > best.index ? current : best
        );
        
      case 'epsilon-greedy':
        if (Math.random() < epsilon) {
          return arms[Math.floor(Math.random() * arms.length)];
        } else {
          return arms.reduce((best, current) => {
            const bestRate = best.pulls === 0 ? 0 : best.successes / best.pulls;
            const currentRate = current.pulls === 0 ? 0 : current.successes / current.pulls;
            return currentRate > bestRate ? current : best;
          });
        }
        
      case 'ucb':
        const ucbScores = arms.map(arm => ({
          ...arm,
          ucb: calculateUCB(arm, totalPulls + 1)
        }));
        return ucbScores.reduce((best, current) => 
          current.ucb > best.ucb ? current : best
        );
        
      case 'thompson':
        const samples = arms.map(arm => {
          const alpha = arm.successes + 1;
          const beta = arm.pulls - arm.successes + 1;
          // Beta distribution sampling approximation
          const u1 = Math.random();
          const u2 = Math.random();
          const sample = (Math.pow(u1, 1/alpha) * Math.pow(u2, 1/beta)) / 
                        (Math.pow(u1, 1/alpha) * Math.pow(u2, 1/beta) + Math.pow(1-u1, 1/alpha) * Math.pow(1-u2, 1/beta));
          return { ...arm, sample };
        });
        return samples.reduce((best, current) => 
          current.sample > best.sample ? current : best
        );
        
      case 'greedy':
        return arms.reduce((best, current) => {
          const bestRate = best.pulls === 0 ? 0 : best.successes / best.pulls;
          const currentRate = current.pulls === 0 ? 0.5 : current.successes / current.pulls;
          return currentRate > bestRate ? current : best;
        });
        
      default:
        return arms[0];
    }
  };
  
  const pullArm = (armId) => {
    const arm = arms.find(a => a.id === armId);
    const isSuccess = Math.random() < arm.trueProbability;
    const reward = isSuccess ? 1 : 0;
    
    setArms(prevArms => 
      prevArms.map(a => 
        a.id === armId 
          ? { ...a, pulls: a.pulls + 1, successes: a.successes + (isSuccess ? 1 : 0) }
          : a
      )
    );
    
    const discountedReward = reward * Math.pow(discountFactor, arms.reduce((sum, a) => sum + a.pulls, 0));
    setTotalReward(prev => prev + discountedReward);
    
    const totalPulls = arms.reduce((sum, a) => sum + a.pulls, 0) + 1;
    setRewardHistory(prev => [...prev, { 
      pull: totalPulls, 
      cumulativeReward: totalReward + discountedReward,
      arm: arm.name
    }]);
  };
  
  const autoPull = () => {
    const selectedArm = selectArmByStrategy();
    pullArm(selectedArm.id);
  };
  
  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(autoPull, autoPlaySpeed);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, arms, strategy, autoPlaySpeed, discountFactor, epsilon, ucbC]);
  
  const resetSimulation = () => {
    setArms(prevArms => prevArms.map(arm => ({ ...arm, pulls: 0, successes: 0 })));
    setTotalReward(0);
    setRewardHistory([]);
    setIsAutoPlaying(false);
  };
  
  const addArm = () => {
    const newId = Math.max(...arms.map(a => a.id)) + 1;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    setArms([...arms, {
      id: newId,
      name: `Arm ${String.fromCharCode(64 + newId)}`,
      trueProbability: Math.random() * 0.8 + 0.1,
      pulls: 0,
      successes: 0,
      color: colors[newId % colors.length]
    }]);
  };
  
  const removeArm = (armId) => {
    if (arms.length > 2) {
      setArms(arms.filter(a => a.id !== armId));
    }
  };
  
  const updateArmProbability = (armId, probability) => {
    setArms(arms.map(a => 
      a.id === armId ? { ...a, trueProbability: probability } : a
    ));
  };
  
  const totalPulls = arms.reduce((sum, arm) => sum + arm.pulls, 0);
  
  const armStats = arms.map(arm => {
    const failures = arm.pulls - arm.successes;
    return {
      ...arm,
      observedRate: arm.pulls > 0 ? (arm.successes / arm.pulls).toFixed(3) : '-',
      gittinsIndex: calculateGittinsIndex(arm.successes, failures, discountFactor).toFixed(4),
      ucbScore: arm.pulls > 0 ? calculateUCB(arm, totalPulls).toFixed(4) : '∞'
    };
  });
  
  return (
    <div className="w-full p-6 mx-auto max-w-7xl bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl">
      <div className="p-8 bg-white rounded-lg shadow-2xl">
        <h1 className="mb-2 text-4xl font-bold text-center text-transparent bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text">
          🎰 Multi-Armed Bandit Simulator
        </h1>
        <p className="mb-8 text-center text-gray-600">
          Interactive exploration of Gittins Index and other strategies
        </p>
        
        {/* Strategy Selection */}
        <div className="p-6 mb-6 rounded-lg bg-gradient-to-r from-purple-100 to-blue-100">
          <h2 className="mb-4 text-xl font-bold text-purple-800">Strategy Settings</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Strategy
              </label>
              <select 
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="w-full px-4 py-2 border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="gittins">Gittins Index (Optimal)</option>
                <option value="epsilon-greedy">ε-Greedy</option>
                <option value="ucb">Upper Confidence Bound (UCB)</option>
                <option value="thompson">Thompson Sampling</option>
                <option value="greedy">Pure Greedy</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Discount Factor (γ): {discountFactor}
              </label>
              <input
                type="range"
                min="0.5"
                max="0.99"
                step="0.01"
                value={discountFactor}
                onChange={(e) => setDiscountFactor(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="mt-1 text-xs text-gray-500">Higher = value future rewards more</p>
            </div>
            
            {strategy === 'epsilon-greedy' && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Exploration Rate (ε): {epsilon}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.5"
                  step="0.01"
                  value={epsilon}
                  onChange={(e) => setEpsilon(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
            
            {strategy === 'ucb' && (
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Exploration Constant (C): {ucbC}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={ucbC}
                  onChange={(e) => setUcbC(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            )}
            
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Auto-play Speed: {autoPlaySpeed}ms
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={autoPlaySpeed}
                onChange={(e) => setAutoPlaySpeed(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                isAutoPlaying 
                  ? 'bg-red-500 hover:bg-red-600' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isAutoPlaying ? '⏸ Pause' : '▶ Auto-Play'}
            </button>
            
            <button
              onClick={autoPull}
              disabled={isAutoPlaying}
              className="px-6 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Pull Once
            </button>
            
            <button
              onClick={resetSimulation}
              className="px-6 py-3 font-semibold text-white bg-gray-500 rounded-lg hover:bg-gray-600"
            >
              🔄 Reset
            </button>
            
            <button
              onClick={addArm}
              className="px-6 py-3 font-semibold text-white bg-purple-500 rounded-lg hover:bg-purple-600"
            >
              ➕ Add Arm
            </button>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showProbabilities}
                onChange={(e) => setShowProbabilities(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-semibold">Show True Probabilities</span>
            </label>
          </div>
        </div>
        
        {/* Performance Stats */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          <div className="p-4 rounded-lg bg-gradient-to-br from-green-100 to-green-200">
            <div className="text-sm font-semibold text-green-800">Total Pulls</div>
            <div className="text-3xl font-bold text-green-900">{totalPulls}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="text-sm font-semibold text-blue-800">Cumulative Reward</div>
            <div className="text-3xl font-bold text-blue-900">{totalReward.toFixed(2)}</div>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200">
            <div className="text-sm font-semibold text-purple-800">Average Reward</div>
            <div className="text-3xl font-bold text-purple-900">
              {totalPulls > 0 ? (totalReward / totalPulls).toFixed(3) : '-'}
            </div>
          </div>
        </div>
        
        {/* Arms Display */}
        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
          {armStats.map((arm) => (
            <div 
              key={arm.id}
              className="p-4 transition-all bg-white border-2 rounded-lg shadow-lg hover:shadow-xl"
              style={{ borderColor: arm.color }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-bold" style={{ color: arm.color }}>
                  {arm.name}
                </h3>
                {arms.length > 2 && (
                  <button
                    onClick={() => removeArm(arm.id)}
                    className="font-bold text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
              
              {showProbabilities && (
                <div className="mb-2">
                  <label className="block mb-1 text-xs font-semibold text-gray-600">
                    True Probability: {arm.trueProbability.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={arm.trueProbability}
                    onChange={(e) => updateArmProbability(arm.id, parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="font-semibold">Pulls:</span>
                  <span className="font-mono">{arm.pulls}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Successes:</span>
                  <span className="font-mono">{arm.successes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Observed Rate:</span>
                  <span className="font-mono">{arm.observedRate}</span>
                </div>
                <div className="flex justify-between p-2 rounded bg-yellow-50">
                  <span className="font-semibold">Gittins Index:</span>
                  <span className="font-mono font-bold text-yellow-800">{arm.gittinsIndex}</span>
                </div>
                {strategy === 'ucb' && (
                  <div className="flex justify-between p-2 rounded bg-blue-50">
                    <span className="font-semibold">UCB Score:</span>
                    <span className="font-mono font-bold text-blue-800">{arm.ucbScore}</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => pullArm(arm.id)}
                disabled={isAutoPlaying}
                className="w-full py-2 mt-3 font-semibold text-white transition-all rounded-lg disabled:opacity-50"
                style={{ backgroundColor: arm.color }}
              >
                Pull This Arm
              </button>
            </div>
          ))}
        </div>
        
        {/* Cumulative Reward Chart */}
        {rewardHistory.length > 0 && (
          <div className="p-6 mb-6 bg-white rounded-lg shadow-lg">
            <h3 className="mb-4 text-xl font-bold text-gray-800">Cumulative Reward Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={rewardHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="pull" 
                  label={{ value: 'Pull Number', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  label={{ value: 'Cumulative Reward', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeReward" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* Pull Distribution Chart */}
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h3 className="mb-4 text-xl font-bold text-gray-800">Pull Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={armStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pulls" fill="#8884d8" name="Total Pulls" />
              <Bar dataKey="successes" fill="#82ca9d" name="Successes" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Strategy Explanation */}
        <div className="p-6 mt-6 border-2 border-yellow-300 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
          <h3 className="mb-2 text-lg font-bold text-yellow-900">
            Current Strategy: {strategy === 'gittins' ? 'Gittins Index' : strategy === 'epsilon-greedy' ? 'ε-Greedy' : strategy === 'ucb' ? 'UCB' : strategy === 'thompson' ? 'Thompson Sampling' : 'Greedy'}
          </h3>
          <p className="text-sm text-gray-700">
            {strategy === 'gittins' && '✓ Optimal strategy! Always pulls the arm with highest Gittins Index. Perfectly balances exploration and exploitation.'}
            {strategy === 'epsilon-greedy' && `Explores randomly with probability ${epsilon}, otherwise exploits the best-known arm. Simple but suboptimal.`}
            {strategy === 'ucb' && `Pulls the arm with highest upper confidence bound. Good performance but not optimal for Bayesian bandits.`}
            {strategy === 'thompson' && 'Samples from posterior distributions and pulls the highest sample. Performs well in practice.'}
            {strategy === 'greedy' && 'Always pulls the arm with highest observed success rate. No exploration - often gets stuck on suboptimal arms.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GittinsIndexTool;