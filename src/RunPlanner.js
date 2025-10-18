import React, { useState, useEffect, useRef } from 'react';
import { Calendar, TrendingUp, Activity, Heart, Clock, Plus, Zap } from 'lucide-react';

const RunningPlanner = () => {
  const [csvData, setCsvData] = useState([]);
  const [nextWeekReadiness, setNextWeekReadiness] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [usingDefaultData, setUsingDefaultData] = useState(false);
  const [showQuickForm, setShowQuickForm] = useState(false);
  const [quickFormData, setQuickFormData] = useState({
    feeling: '',
    weeklyKms: ''
  });
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const Papa = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
      const fileData = await window.fs.readFile('Running Strategy  Running Readiness.csv', { encoding: 'utf8' });
      
      const result = Papa.default.parse(fileData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      const cleanedData = result.data.map(row => ({
        startDate: row['Start Date']?.trim(),
        endDate: row['End Date']?.trim(),
        distance: parseFloat(row['Distance (Km)']),
        time: row['Time (HH:MM:SS)']?.trim(),
        pace: row['Pace (Avg)']?.trim(),
        overdrive: row['Overdrive (%)']?.trim(),
        feeling: row['Feeling']?.trim(),
        recoveryDays: parseFloat(row['Reovery Days (Num)']),
        rhr: parseFloat(row['EOW R.H.R']),
        readiness: parseFloat(row["Next Week's Readiness"])
      })).filter(row => row.startDate);
      
      setCsvData(cleanedData);
      
      const latestEntry = cleanedData[cleanedData.length - 1];
      const weeklyKms = latestEntry?.readiness || 15;
      const latestFeeling = latestEntry?.feeling?.toLowerCase() || 'moderate';
      
      // Map feeling to readiness percentage for display
      let readinessPercent;
      if (latestFeeling.includes('great') || latestFeeling.includes('excellent') || latestFeeling.includes('strong')) {
        readinessPercent = 90;
      } else if (latestFeeling.includes('good') || latestFeeling.includes('fine')) {
        readinessPercent = 75;
      } else if (latestFeeling.includes('okay') || latestFeeling.includes('moderate') || latestFeeling.includes('normal')) {
        readinessPercent = 60;
      } else if (latestFeeling.includes('tired') || latestFeeling.includes('fatigued') || latestFeeling.includes('sore')) {
        readinessPercent = 45;
      } else {
        readinessPercent = 70;
      }
      
      setNextWeekReadiness(readinessPercent);
      
      const newRecommendations = generateRecommendations(readinessPercent, weeklyKms, latestFeeling);
      setRecommendations(newRecommendations);
    } catch (error) {
      console.error('Error loading data:', error);
      setUsingDefaultData(true);
      setNextWeekReadiness(70);
      setRecommendations(generateRecommendations(70, 15, 'moderate'));
    }
  };

  const handleQuickFormSubmit = () => {
    if (!quickFormData.feeling || !quickFormData.weeklyKms) {
      alert('Please fill in both fields');
      return;
    }

    const weeklyKms = parseFloat(quickFormData.weeklyKms);
    const feeling = quickFormData.feeling.toLowerCase();
    
    // Map feeling to readiness percentage
    let readinessPercent;
    if (feeling.includes('great') || feeling.includes('excellent') || feeling.includes('strong')) {
      readinessPercent = 90;
    } else if (feeling.includes('good') || feeling.includes('fine')) {
      readinessPercent = 75;
    } else if (feeling.includes('okay') || feeling.includes('moderate') || feeling.includes('normal')) {
      readinessPercent = 60;
    } else if (feeling.includes('tired') || feeling.includes('fatigued') || feeling.includes('sore')) {
      readinessPercent = 45;
    } else {
      readinessPercent = 70;
    }
    
    setNextWeekReadiness(readinessPercent);
    setRecommendations(generateRecommendations(readinessPercent, weeklyKms, feeling));
    setUsingDefaultData(false);
    setShowQuickForm(false);
    setQuickFormData({ feeling: '', weeklyKms: '' });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('File selected:', file.name);

    try {
      const Papa = await import('https://cdn.jsdelivr.net/npm/papaparse@5.4.1/+esm');
      const text = await file.text();
      
      console.log('File text length:', text.length);
      
      const result = Papa.default.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      
      console.log('Parsed rows:', result.data.length);
      
      const cleanedData = result.data.map(row => ({
        startDate: row['Start Date']?.trim(),
        endDate: row['End Date']?.trim(),
        distance: parseFloat(row['Distance (Km)']),
        time: row['Time (HH:MM:SS)']?.trim(),
        pace: row['Pace (Avg)']?.trim(),
        overdrive: row['Overdrive (%)']?.trim(),
        feeling: row['Feeling']?.trim(),
        recoveryDays: parseFloat(row['Reovery Days (Num)']),
        rhr: parseFloat(row['EOW R.H.R']),
        readiness: parseFloat(row["Next Week's Readiness"])
      })).filter(row => row.startDate);
      
      console.log('Cleaned data length:', cleanedData.length);
      console.log('Sample row:', cleanedData[0]);
      
      setCsvData(cleanedData);
      
      const latestEntry = cleanedData[cleanedData.length - 1];
      const weeklyKms = latestEntry?.readiness || 15;
      const latestFeeling = latestEntry?.feeling?.toLowerCase() || 'moderate';
      
      console.log('Weekly KMs target:', weeklyKms);
      console.log('Latest feeling:', latestFeeling);
      
      // Map feeling to readiness percentage for display
      let readinessPercent;
      if (latestFeeling.includes('great') || latestFeeling.includes('excellent') || latestFeeling.includes('strong')) {
        readinessPercent = 90;
      } else if (latestFeeling.includes('good') || latestFeeling.includes('fine')) {
        readinessPercent = 75;
      } else if (latestFeeling.includes('okay') || latestFeeling.includes('moderate') || latestFeeling.includes('normal')) {
        readinessPercent = 60;
      } else if (latestFeeling.includes('tired') || latestFeeling.includes('fatigued') || latestFeeling.includes('sore')) {
        readinessPercent = 45;
      } else {
        readinessPercent = 70;
      }
      
      setNextWeekReadiness(readinessPercent);
      
      const newRecommendations = generateRecommendations(readinessPercent, weeklyKms, latestFeeling);
      console.log('New recommendations:', newRecommendations);
      setRecommendations(newRecommendations);
      
      setUsingDefaultData(false);
      alert('CSV uploaded successfully! Recommendations updated.');
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please make sure it\'s a valid CSV. Error: ' + error.message);
    }
  };

  const generateRecommendations = (readinessPercent, weeklyKms, feeling) => {
    // Distribution algorithm based on feeling
    let mondayRatio, wednesdayRatio, saturdayRatio;
    
    const feelingLower = (feeling || '').toLowerCase();
    
    if (feelingLower.includes('great') || feelingLower.includes('excellent') || feelingLower.includes('strong')) {
      // High energy: Build toward Saturday long run
      mondayRatio = 0.30;      // 30% - Tempo/Quality
      wednesdayRatio = 0.25;   // 25% - Recovery
      saturdayRatio = 0.45;    // 45% - Long run
    } else if (feelingLower.includes('good') || feelingLower.includes('fine')) {
      // Good energy: Balanced distribution
      mondayRatio = 0.32;
      wednesdayRatio = 0.30;
      saturdayRatio = 0.38;
    } else if (feelingLower.includes('okay') || feelingLower.includes('moderate') || feelingLower.includes('normal')) {
      // Moderate energy: More even distribution
      mondayRatio = 0.33;
      wednesdayRatio = 0.32;
      saturdayRatio = 0.35;
    } else if (feelingLower.includes('tired') || feelingLower.includes('fatigued') || feelingLower.includes('sore')) {
      // Low energy: Conservative, spread evenly
      mondayRatio = 0.30;
      wednesdayRatio = 0.35;   // Easier middle run
      saturdayRatio = 0.35;
    } else {
      // Default balanced
      mondayRatio = 0.32;
      wednesdayRatio = 0.30;
      saturdayRatio = 0.38;
    }
    
    const mondayKm = (weeklyKms * mondayRatio).toFixed(1);
    const wednesdayKm = (weeklyKms * wednesdayRatio).toFixed(1);
    const saturdayKm = (weeklyKms * saturdayRatio).toFixed(1);
    
    // Determine run types and notes based on readiness
    if (readinessPercent >= 85) {
      return {
        level: 'High',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        monday: {
          type: 'Tempo Run',
          distance: mondayKm,
          intensity: 'Moderate-High (75-85% effort)',
          notes: 'You\'re well-recovered. Push the pace today with quality work.'
        },
        wednesday: {
          type: 'Easy Recovery',
          distance: wednesdayKm,
          intensity: 'Easy (60-70% effort)',
          notes: 'Active recovery between harder sessions. Keep it conversational.'
        },
        saturday: {
          type: 'Long Run',
          distance: saturdayKm,
          intensity: 'Moderate (70-80% effort)',
          notes: 'Build endurance with your longest run. Strong finish.'
        }
      };
    } else if (readinessPercent >= 70) {
      return {
        level: 'Moderate',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        monday: {
          type: 'Steady Run',
          distance: mondayKm,
          intensity: 'Moderate (70-75% effort)',
          notes: 'Maintain steady effort. Find your rhythm.'
        },
        wednesday: {
          type: 'Easy Run',
          distance: wednesdayKm,
          intensity: 'Easy (60-70% effort)',
          notes: 'Focus on form and breathing. Stay comfortable.'
        },
        saturday: {
          type: 'Progressive Run',
          distance: saturdayKm,
          intensity: 'Easy to Moderate (65-80% effort)',
          notes: 'Start easy, build gradually. Finish strong in final third.'
        }
      };
    } else if (readinessPercent >= 55) {
      return {
        level: 'Moderate-Low',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        monday: {
          type: 'Easy Run',
          distance: mondayKm,
          intensity: 'Easy (60-70% effort)',
          notes: 'Start the week gently. Listen to your body.'
        },
        wednesday: {
          type: 'Recovery Run',
          distance: wednesdayKm,
          intensity: 'Very Easy (55-65% effort)',
          notes: 'Keep it very comfortable. Active recovery focus.'
        },
        saturday: {
          type: 'Steady Easy',
          distance: saturdayKm,
          intensity: 'Easy (60-70% effort)',
          notes: 'Maintain easy effort throughout. No heroics.'
        }
      };
    } else {
      return {
        level: 'Low',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        monday: {
          type: 'Recovery Run',
          distance: mondayKm,
          intensity: 'Very Easy (50-60% effort)',
          notes: 'Prioritize recovery. Keep it very light and short.'
        },
        wednesday: {
          type: 'Easy Walk/Jog',
          distance: wednesdayKm,
          intensity: 'Very Easy (50-60% effort)',
          notes: 'Consider walk breaks. Listen to fatigue signals.'
        },
        saturday: {
          type: 'Easy Run',
          distance: saturdayKm,
          intensity: 'Easy (55-65% effort)',
          notes: 'Rebuild gradually. Consider rest day if still fatigued.'
        }
      };
    }
  };

  const calculateWeeklyMileage = () => {
    if (!recommendations) return 0;
    const total = parseFloat(recommendations.monday.distance) + 
                  parseFloat(recommendations.wednesday.distance) + 
                  parseFloat(recommendations.saturday.distance);
    return total.toFixed(1);
  };

  const formatReadiness = (score) => {
    if (!score) return 'N/A';
    return `${score}%`;
  };

  const getReadinessEmoji = (score) => {
    if (score >= 85) return '🟢';
    if (score >= 70) return '🟡';
    return '🔴';
  };

  if (!recommendations) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading your running data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl min-h-screen p-6 mx-auto bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="p-8 mb-6 bg-white shadow-lg rounded-xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-800">
            <Activity className="text-blue-600" size={36} />
            Running Strategy Planner
          </h1>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              ref={fileInputRef}
            />
            <button
              onClick={() => setShowQuickForm(!showQuickForm)}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
            >
              <Zap size={20} />
              Quick Plan
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus size={20} />
              Upload CSV
            </button>
          </div>
        </div>
        
        {showQuickForm && (
          <div className="p-6 mb-6 border-2 border-green-300 rounded-lg bg-gradient-to-r from-green-50 to-blue-50">
            <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
              <Zap className="text-green-600" size={24} />
              Quick Strategy Builder
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Enter your current feeling and target weekly distance to generate a personalized running plan.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  How are you feeling today?
                </label>
                <select
                  value={quickFormData.feeling}
                  onChange={(e) => setQuickFormData({...quickFormData, feeling: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                >
                  <option value="">Select your feeling...</option>
                  <option value="Great">Great - Feeling strong and energized</option>
                  <option value="Good">Good - Ready to run</option>
                  <option value="Okay">Okay - Moderate energy</option>
                  <option value="Tired">Tired - Need easier workouts</option>
                  <option value="Fatigued">Fatigued - Very low energy</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-semibold text-gray-700">
                  Target Weekly Distance (KM)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="e.g., 15"
                  value={quickFormData.weeklyKms}
                  onChange={(e) => setQuickFormData({...quickFormData, weeklyKms: e.target.value})}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleQuickFormSubmit}
                  className="flex items-center gap-2 px-6 py-2 font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
                >
                  <Zap size={20} />
                  Generate Plan
                </button>
                <button
                  onClick={() => {
                    setShowQuickForm(false);
                    setQuickFormData({ feeling: '', weeklyKms: '' });
                  }}
                  className="px-6 py-2 text-gray-700 transition-colors bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        {usingDefaultData && (
          <div className="p-4 mb-6 border-2 border-yellow-300 rounded-lg bg-yellow-50">
            <div className="flex items-start gap-3">
              <div className="text-2xl text-yellow-600">⚠️</div>
              <div>
                <h3 className="mb-1 font-semibold text-yellow-800">Using Default Data</h3>
                <p className="text-sm text-yellow-700">
                  No CSV file detected. Showing sample recommendations with default values (75% readiness, 5km average distance). 
                  Please upload your CSV file to see personalized recommendations based on your actual running data.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className={`${recommendations.bgColor} ${recommendations.borderColor} border-2 rounded-lg p-6 mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-lg font-semibold text-gray-700">Next Week's Readiness</h2>
              <div className="flex items-center gap-3">
                <span className="text-5xl font-bold">{getReadinessEmoji(nextWeekReadiness)}</span>
                <div>
                  <p className={`text-4xl font-bold ${recommendations.color}`}>
                    {formatReadiness(nextWeekReadiness)}
                  </p>
                  <p className={`text-sm font-medium ${recommendations.color}`}>
                    {recommendations.level} Readiness
                  </p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <Heart className={recommendations.color} size={48} />
              <p className="mt-2 text-sm text-gray-600">Weekly Total</p>
              <p className="text-3xl font-bold text-gray-800">{calculateWeeklyMileage()} km</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-5 transition-shadow bg-white border-2 border-gray-200 rounded-lg hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Monday</h3>
                  <p className="text-sm text-gray-500">{recommendations.monday.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{recommendations.monday.distance} km</p>
                <p className="text-xs text-gray-500">Distance</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-gray-500" />
                <span className="text-gray-700">{recommendations.monday.intensity}</span>
              </div>
              <p className="text-sm italic text-gray-600">{recommendations.monday.notes}</p>
            </div>
          </div>

          <div className="p-5 transition-shadow bg-white border-2 border-gray-200 rounded-lg hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Wednesday</h3>
                  <p className="text-sm text-gray-500">{recommendations.wednesday.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{recommendations.wednesday.distance} km</p>
                <p className="text-xs text-gray-500">Distance</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-gray-500" />
                <span className="text-gray-700">{recommendations.wednesday.intensity}</span>
              </div>
              <p className="text-sm italic text-gray-600">{recommendations.wednesday.notes}</p>
            </div>
          </div>

          <div className="p-5 transition-shadow bg-white border-2 border-gray-200 rounded-lg hover:shadow-md">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Saturday</h3>
                  <p className="text-sm text-gray-500">{recommendations.saturday.type}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{recommendations.saturday.distance} km</p>
                <p className="text-xs text-gray-500">Distance</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp size={16} className="text-gray-500" />
                <span className="text-gray-700">{recommendations.saturday.intensity}</span>
              </div>
              <p className="text-sm italic text-gray-600">{recommendations.saturday.notes}</p>
            </div>
          </div>
        </div>

        <div className="p-4 mt-6 border border-blue-200 rounded-lg bg-blue-50">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 text-blue-600" size={20} />
            <div>
              <h4 className="mb-1 font-semibold text-gray-800">Weekly Tips</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Listen to your body - adjust distances if needed</li>
                <li>• Stay hydrated and fuel properly before runs</li>
                <li>• Track your resting heart rate to monitor recovery</li>
                <li>• Aim for 2-3 recovery days between harder efforts</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RunningPlanner;