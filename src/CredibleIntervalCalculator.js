import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart, ReferenceLine } from 'recharts';

const CredibleIntervalCalculator = () => {
  const [successes, setSuccesses] = useState(3);
  const [failures, setFailures] = useState(2);
  const [credibleLevel, setCredibleLevel] = useState(95);
  const [posteriorData, setPosteriorData] = useState([]);
  const [credibleInterval, setCredibleInterval] = useState({ lower: 0, upper: 0 });
  const [posteriorMean, setPosteriorMean] = useState(0);
  const [includesFairness, setIncludesFairness] = useState(true);

  // Beta distribution PDF
  const betaPDF = (x, alpha, beta) => {
    if (x <= 0 || x >= 1) return 0;
    const numerator = Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1);
    // Beta function approximation using gamma functions
    const logBeta = logGamma(alpha) + logGamma(beta) - logGamma(alpha + beta);
    return numerator / Math.exp(logBeta);
  };

  // Log gamma function approximation
  const logGamma = (z) => {
    const g = 7;
    const C = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    if (z < 0.5) {
      return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    }
    
    z -= 1;
    let x = C[0];
    for (let i = 1; i < g + 2; i++) {
      x += C[i] / (z + i);
    }
    
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  };

  // Calculate cumulative distribution using numerical integration
  const betaCDF = (x, alpha, beta, steps = 1000) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    
    const dx = x / steps;
    let sum = 0;
    for (let i = 1; i <= steps; i++) {
      const xi = i * dx;
      sum += betaPDF(xi, alpha, beta) * dx;
    }
    return sum;
  };

  // Find quantile using binary search
  const findQuantile = (q, alpha, beta) => {
    let low = 0.001;
    let high = 0.999;
    const tolerance = 0.0001;
    
    while (high - low > tolerance) {
      const mid = (low + high) / 2;
      const cdf = betaCDF(mid, alpha, beta);
      
      if (cdf < q) {
        low = mid;
      } else {
        high = mid;
      }
    }
    
    return (low + high) / 2;
  };

  useEffect(() => {
    // Beta posterior: Beta(successes + 1, failures + 1)
    const alpha = successes + 1;
    const beta = failures + 1;
    
    // Calculate posterior mean
    const mean = alpha / (alpha + beta);
    setPosteriorMean(mean);
    
    // Generate posterior distribution data
    const data = [];
    for (let i = 0; i <= 100; i++) {
      const p = i / 100;
      const density = betaPDF(p, alpha, beta);
      data.push({
        p: p,
        density: density,
        pFormatted: p.toFixed(2)
      });
    }
    setPosteriorData(data);
    
    // Calculate credible interval
    const lowerTail = (100 - credibleLevel) / 200;
    const upperTail = 1 - lowerTail;
    
    const lower = findQuantile(lowerTail, alpha, beta);
    const upper = findQuantile(upperTail, alpha, beta);
    
    setCredibleInterval({ lower, upper });
    setIncludesFairness(lower <= 0.5 && upper >= 0.5);
    
  }, [successes, failures, credibleLevel]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Bayesian Credible Interval Calculator</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Input Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Successes (Heads)
            </label>
            <input
              type="number"
              min="0"
              value={successes}
              onChange={(e) => setSuccesses(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Failures (Tails)
            </label>
            <input
              type="number"
              min="0"
              value={failures}
              onChange={(e) => setFailures(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credible Level (%)
            </label>
            <input
              type="number"
              min="50"
              max="99"
              value={credibleLevel}
              onChange={(e) => setCredibleLevel(Math.min(99, Math.max(50, parseInt(e.target.value) || 95)))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          Total observations: {successes + failures} | Sample proportion: {((successes / (successes + failures)) || 0).toFixed(4)}
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h3 className="text-lg font-semibold mb-4">Results</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
            <span className="font-medium">Posterior Mean:</span>
            <span className="text-lg font-bold text-blue-700">{posteriorMean.toFixed(4)}</span>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-green-50 rounded">
            <span className="font-medium">{credibleLevel}% Credible Interval:</span>
            <span className="text-lg font-bold text-green-700">
              [{credibleInterval.lower.toFixed(4)}, {credibleInterval.upper.toFixed(4)}]
            </span>
          </div>
          
          <div className={`flex justify-between items-center p-3 rounded ${includesFairness ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <span className="font-medium">Includes p = 0.5?</span>
            <span className={`text-lg font-bold ${includesFairness ? 'text-yellow-700' : 'text-red-700'}`}>
              {includesFairness ? 'Yes - Cannot reject fair coin' : 'No - Evidence of bias'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Posterior Distribution</h3>
        <AreaChart width={700} height={400} data={posteriorData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="p" 
            label={{ value: 'Probability (p)', position: 'insideBottom', offset: -5 }}
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis label={{ value: 'Density', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => value.toFixed(4)}
            labelFormatter={(label) => `p = ${parseFloat(label).toFixed(2)}`}
          />
          <Area 
            type="monotone" 
            dataKey="density" 
            stroke="#3b82f6" 
            fill="#93c5fd" 
            fillOpacity={0.6}
          />
          <ReferenceLine x={0.5} stroke="red" strokeDasharray="5 5" label="Fair coin (0.5)" />
          <ReferenceLine x={credibleInterval.lower} stroke="green" strokeDasharray="3 3" />
          <ReferenceLine x={credibleInterval.upper} stroke="green" strokeDasharray="3 3" />
        </AreaChart>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>Interpretation:</strong></p>
          <ul className="list-disc ml-6 mt-2 space-y-1">
            <li>The shaded area shows the posterior probability distribution for p</li>
            <li>Red dashed line: fair coin hypothesis (p = 0.5)</li>
            <li>Green dashed lines: {credibleLevel}% credible interval bounds</li>
            <li>There is a {credibleLevel}% probability that the true p lies between {credibleInterval.lower.toFixed(3)} and {credibleInterval.upper.toFixed(3)}</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg mt-6">
        <h4 className="font-semibold text-blue-900 mb-2">Decision Guide:</h4>
        <ul className="text-sm text-blue-800 space-y-1 ml-4">
          <li>• If credible interval includes 0.5: <strong>Insufficient evidence to claim bias</strong></li>
          <li>• If credible interval excludes 0.5: <strong>Evidence suggests the coin is biased</strong></li>
          <li>• More data (larger n) leads to narrower intervals and more confident conclusions</li>
          <li>• With small samples, wide intervals are expected and bias claims are premature</li>
        </ul>
      </div>
    </div>
  );
};

export default CredibleIntervalCalculator;