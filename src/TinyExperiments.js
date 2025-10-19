import React, { useState } from 'react';
import { Plus, TrendingUp, X, Edit2, Save } from 'lucide-react';

export default function TinyExperiments() {
  const [experiments, setExperiments] = useState([]);
  const [showNewExperiment, setShowNewExperiment] = useState(false);
  const [editingDay, setEditingDay] = useState(null);
  
  // ====== TESTING ONLY - REMOVE IN PRODUCTION ======
  const [testDate, setTestDate] = useState('');
  const getCurrentDate = () => {
    if (testDate) return new Date(testDate);
    return new Date();
  };
  // ====== END TESTING SECTION ======

  const createExperiment = (experimentData) => {
    const newExperiment = {
      id: Date.now(),
      ...experimentData,
      createdAt: new Date().toISOString(),
      entries: []
    };
    setExperiments([...experiments, newExperiment]);
    setShowNewExperiment(false);
  };

  const addEntry = (experimentId, entryData) => {
    setExperiments(experiments.map(exp => {
      if (exp.id === experimentId) {
        const dateStr = getCurrentDate().toISOString().split('T')[0];
        const phase = getPhaseForDate(exp, dateStr);
        const newEntry = {
          id: Date.now(),
          date: dateStr,
          phase: phase,
          ...entryData
        };
        return { ...exp, entries: [...exp.entries, newEntry] };
      }
      return exp;
    }));
  };

  const updateEntry = (experimentId, entryId, entryData) => {
    setExperiments(experiments.map(exp => {
      if (exp.id === experimentId) {
        return {
          ...exp,
          entries: exp.entries.map(entry => 
            entry.id === entryId ? { ...entry, ...entryData } : entry
          )
        };
      }
      return exp;
    }));
    setEditingDay(null);
  };

  const deleteExperiment = (experimentId) => {
    if (window.confirm('Delete this experiment? All data will be lost.')) {
      setExperiments(experiments.filter(exp => exp.id !== experimentId));
    }
  };

  const getProgress = (exp) => {
    const totalDays = parseInt(exp.baselineDays || 0) + parseInt(exp.interventionDays || 0) + parseInt(exp.washoutDays || 0);
    const startDate = new Date(exp.createdAt);
    const today = getCurrentDate();
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    return Math.min(100, (daysSinceStart / totalDays) * 100);
  };

  const getDataCompleteness = (exp) => {
    const startDate = new Date(exp.createdAt);
    const today = getCurrentDate();
    const daysSinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // Get unique dates from entries
    const uniqueDates = new Set(exp.entries.map(e => e.date));
    const daysLogged = uniqueDates.size;
    
    // Only count days that have actually passed
    const daysPassed = Math.min(daysSinceStart, 
      parseInt(exp.baselineDays || 0) + parseInt(exp.interventionDays || 0) + parseInt(exp.washoutDays || 0));
    
    if (daysPassed === 0) return 100;
    return Math.min(100, (daysLogged / daysPassed) * 100);
  };

  const getPhaseForDate = (exp, dateStr) => {
    const startDate = new Date(exp.createdAt);
    const entryDate = new Date(dateStr);
    const daysSinceStart = Math.floor((entryDate - startDate) / (1000 * 60 * 60 * 24));
    
    const baselineDays = parseInt(exp.baselineDays || 0);
    const interventionDays = parseInt(exp.interventionDays || 0);
    
    if (daysSinceStart < baselineDays) {
      return 'baseline';
    } else if (daysSinceStart < baselineDays + interventionDays) {
      return 'intervention';
    } else {
      return 'washout';
    }
  };

  const getCurrentPhase = (exp) => {
    const today = getCurrentDate().toISOString().split('T')[0];
    return getPhaseForDate(exp, today);
  };

  const getAverageMetric = (exp) => {
    if (exp.entries.length === 0) return 0;
    const sum = exp.entries.reduce((acc, entry) => acc + (parseInt(entry.metric) || 0), 0);
    return (sum / exp.entries.length).toFixed(1);
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Habit Experiments</h1>
          <p className="text-gray-600">Track personal experiments and validate what works for you</p>
        </div>

        {/* ====== TESTING ONLY - REMOVE IN PRODUCTION ====== */}
        <div className="p-4 mb-6 border-2 border-yellow-300 rounded-lg bg-yellow-50">
          <div className="flex items-center gap-4">
            <span className="text-sm font-semibold text-yellow-800">🧪 TEST MODE:</span>
            <label className="text-sm text-yellow-700">
              Override Current Date:
            </label>
            <input
              type="date"
              value={testDate}
              onChange={(e) => setTestDate(e.target.value)}
              className="px-3 py-1 text-sm border border-yellow-300 rounded-lg"
            />
            {testDate && (
              <button
                onClick={() => setTestDate('')}
                className="px-3 py-1 text-sm text-yellow-800 bg-yellow-200 rounded hover:bg-yellow-300"
              >
                Reset to Today
              </button>
            )}
            <span className="ml-auto text-xs text-yellow-600">
              Current: {getCurrentDate().toLocaleDateString()}
            </span>
          </div>
        </div>
        {/* ====== END TESTING SECTION ====== */}

        {!showNewExperiment && (
          <button
            onClick={() => setShowNewExperiment(true)}
            className="flex items-center gap-2 px-4 py-2 mb-6 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            <Plus size={20} />
            New Experiment
          </button>
        )}

        {showNewExperiment && (
          <NewExperimentForm 
            onSubmit={createExperiment}
            onCancel={() => setShowNewExperiment(false)}
          />
        )}

        <div className="space-y-6">
          {experiments.length === 0 && !showNewExperiment && (
            <div className="py-12 text-center bg-white border-2 border-gray-300 border-dashed rounded-lg">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No experiments yet. Create one to get started!</p>
            </div>
          )}

          {experiments.map(exp => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              onAddEntry={addEntry}
              onUpdateEntry={updateEntry}
              onDelete={deleteExperiment}
              getProgress={getProgress}
              getDataCompleteness={getDataCompleteness}
              getAverageMetric={getAverageMetric}
              getCurrentPhase={getCurrentPhase}
              editingDay={editingDay}
              setEditingDay={setEditingDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function NewExperimentForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    metric: '',
    metricScale: '10',
    baselineDays: '7',
    interventionDays: '14',
    washoutDays: '7',
    notes: ''
  });

  const handleSubmit = () => {
    if (formData.name && formData.metric) {
      onSubmit(formData);
    }
  };

  return (
    <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Create New Experiment</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Habit Name *
          </label>
          <input
            type="text"
            placeholder="e.g., 60sec morning cold shower"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            What are you measuring? *
          </label>
          <input
            type="text"
            placeholder="e.g., Energy level at 2pm, Mood, Focus"
            value={formData.metric}
            onChange={(e) => setFormData({...formData, metric: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Scale (1 to...)
            </label>
            <input
              type="number"
              value={formData.metricScale}
              onChange={(e) => setFormData({...formData, metricScale: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              min="5"
              max="100"
            />
          </div>
        </div>

        <div className="pt-4 mt-2 border-t">
          <h3 className="mb-3 text-sm font-semibold text-gray-900">Experiment Phases</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Baseline (days)
              </label>
              <input
                type="number"
                value={formData.baselineDays}
                onChange={(e) => setFormData({...formData, baselineDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="30"
              />
              <p className="mt-1 text-xs text-gray-500">Track without habit</p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Intervention (days)
              </label>
              <input
                type="number"
                value={formData.interventionDays}
                onChange={(e) => setFormData({...formData, interventionDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="60"
              />
              <p className="mt-1 text-xs text-gray-500">Do the habit</p>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Washout (days)
              </label>
              <input
                type="number"
                value={formData.washoutDays}
                onChange={(e) => setFormData({...formData, washoutDays: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                min="1"
                max="30"
              />
              <p className="mt-1 text-xs text-gray-500">Stop habit again</p>
            </div>
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Notes (optional)
          </label>
          <textarea
            placeholder="Any specific conditions or things to track..."
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            rows="2"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
        >
          Create Experiment
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function ExperimentCard({ experiment, onAddEntry, onUpdateEntry, onDelete, getProgress, getDataCompleteness, getAverageMetric, getCurrentPhase, editingDay, setEditingDay }) {
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [entryData, setEntryData] = useState({ metric: '', completed: true, notes: '' });

  const handleAddEntry = () => {
    if (entryData.metric) {
      onAddEntry(experiment.id, entryData);
      setEntryData({ metric: '', completed: true, notes: '' });
      setShowEntryForm(false);
    }
  };

  const handleUpdateEntry = (entry) => {
    onUpdateEntry(experiment.id, entry.id, entryData);
  };

  const startEditing = (entry) => {
    setEditingDay(entry.id);
    setEntryData({ metric: entry.metric, completed: entry.completed, notes: entry.notes || '' });
  };

  const progress = getProgress(experiment);
  const dataCompleteness = getDataCompleteness(experiment);
  const avgMetric = getAverageMetric(experiment);
  const currentPhase = getCurrentPhase(experiment);

  const getCompletenessColor = (completeness) => {
    if (completeness >= 80) return 'text-green-600';
    if (completeness >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPhaseColor = (phase) => {
    switch(phase) {
      case 'baseline': return 'bg-gray-100 text-gray-700';
      case 'intervention': return 'bg-blue-100 text-blue-700';
      case 'washout': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPhaseLabel = (phase) => {
    switch(phase) {
      case 'baseline': return 'Baseline';
      case 'intervention': return 'Intervention';
      case 'washout': return 'Washout';
      default: return 'Unknown';
    }
  };

  const getPhaseStats = () => {
    const baselineEntries = experiment.entries.filter(e => e.phase === 'baseline');
    const interventionEntries = experiment.entries.filter(e => e.phase === 'intervention');
    const washoutEntries = experiment.entries.filter(e => e.phase === 'washout');

    const calcAvg = (entries) => {
      if (entries.length === 0) return 0;
      const sum = entries.reduce((acc, e) => acc + (parseInt(e.metric) || 0), 0);
      return (sum / entries.length).toFixed(1);
    };

    return {
      baseline: { count: baselineEntries.length, avg: calcAvg(baselineEntries) },
      intervention: { count: interventionEntries.length, avg: calcAvg(interventionEntries) },
      washout: { count: washoutEntries.length, avg: calcAvg(washoutEntries) }
    };
  };

  const phaseStats = getPhaseStats();

  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{experiment.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPhaseColor(currentPhase)}`}>
                {getPhaseLabel(currentPhase)} Phase
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">Measuring: {experiment.metric}</p>
            {experiment.notes && (
              <p className="mt-1 text-sm italic text-gray-500">{experiment.notes}</p>
            )}
          </div>
          <button
            onClick={() => onDelete(experiment.id)}
            className="p-2 text-red-500 hover:text-red-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 border-l-4 border-gray-400 rounded-lg bg-gray-50">
            <div className="text-lg font-bold text-gray-700">{phaseStats.baseline.avg}</div>
            <div className="text-xs text-gray-600">Baseline Avg</div>
            <div className="text-xs text-gray-500">{phaseStats.baseline.count} days</div>
          </div>
          <div className="p-3 border-l-4 border-blue-400 rounded-lg bg-blue-50">
            <div className="text-lg font-bold text-blue-700">{phaseStats.intervention.avg}</div>
            <div className="text-xs text-gray-600">Intervention Avg</div>
            <div className="text-xs text-gray-500">{phaseStats.intervention.count} days</div>
          </div>
          <div className="p-3 border-l-4 rounded-lg bg-amber-50 border-amber-400">
            <div className="text-lg font-bold text-amber-700">{phaseStats.washout.avg}</div>
            <div className="text-xs text-gray-600">Washout Avg</div>
            <div className="text-xs text-gray-500">{phaseStats.washout.count} days</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-50">
            <div className={`text-lg font-bold ${getCompletenessColor(dataCompleteness)}`}>
              {dataCompleteness.toFixed(0)}%
            </div>
            <div className="text-xs text-gray-600">Data Complete</div>
            <div className="text-xs text-gray-500">
              {dataCompleteness >= 80 ? 'High confidence' : dataCompleteness >= 60 ? 'Medium confidence' : 'Low confidence'}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between mb-1 text-xs text-gray-600">
            <span>Time Progress</span>
            <span>{progress.toFixed(0)}% complete</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 transition-all duration-300 bg-indigo-600 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Daily Entries</h4>
          <button
            onClick={() => setShowEntryForm(!showEntryForm)}
            className="px-3 py-1 text-sm text-indigo-600 transition bg-indigo-100 rounded hover:bg-indigo-200"
          >
            {showEntryForm ? 'Cancel' : '+ Log Today'}
          </button>
        </div>

        {showEntryForm && (
          <div className="p-4 mb-4 rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Score (1-{experiment.metricScale})
                </label>
                <input
                  type="number"
                  value={entryData.metric}
                  onChange={(e) => setEntryData({...entryData, metric: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  min="1"
                  max={experiment.metricScale}
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Completed?
                </label>
                <select
                  value={entryData.completed}
                  onChange={(e) => setEntryData({...entryData, completed: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <input
              type="text"
              placeholder="Notes (optional)"
              value={entryData.notes}
              onChange={(e) => setEntryData({...entryData, notes: e.target.value})}
              className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 text-sm text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Save Entry
            </button>
          </div>
        )}

        <div className="space-y-2 overflow-y-auto max-h-64">
          {experiment.entries.length === 0 ? (
            <p className="py-4 text-sm text-center text-gray-500">No entries yet. Log your first day!</p>
          ) : (
            experiment.entries.slice().reverse().map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                {editingDay === entry.id ? (
                  <div className="flex flex-1 gap-2">
                    <input
                      type="number"
                      value={entryData.metric}
                      onChange={(e) => setEntryData({...entryData, metric: e.target.value})}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 rounded"
                      min="1"
                      max={experiment.metricScale}
                    />
                    <input
                      type="text"
                      value={entryData.notes}
                      onChange={(e) => setEntryData({...entryData, notes: e.target.value})}
                      className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
                      placeholder="Notes"
                    />
                    <button
                      onClick={() => handleUpdateEntry(entry)}
                      className="p-1 text-green-600 hover:text-green-700"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">
                          {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(entry.phase)}`}>
                          {getPhaseLabel(entry.phase)}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${
                          entry.completed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {entry.metric}/{experiment.metricScale}
                        </span>
                        {entry.notes && (
                          <span className="text-sm italic text-gray-600">{entry.notes}</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startEditing(entry)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 size={16} />
                    </button>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}