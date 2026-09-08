import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Mail, MessageSquareWarning, History, Send, AlertTriangle, CheckCircle2, AlertCircle, ChevronRight, Activity, LogOut } from 'lucide-react';
import LandingPage from './LandingPage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function App() {
  const [showApp, setShowApp] = useState(false);
  const [activeTab, setActiveTab] = useState('spam');
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (showApp) {
      fetchHistory();
    }
  }, [showApp]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/history`);
      setHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    const endpoint = activeTab === 'spam' ? '/predict/spam' : '/predict/toxicity';
    
    try {
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, { text: inputText });
      setResult(response.data);
      fetchHistory(); // Refresh history
    } catch (error) {
      console.error("Error analyzing text:", error);
      setResult({
        label: "Error",
        confidence: 0,
        highlights: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    setShowApp(false);
    setResult(null);
    setInputText('');
    setActiveTab('spam');
  };

  if (!showApp) {
    return <LandingPage onStart={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-sm shadow-indigo-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              TextGuard <span className="text-slate-400 font-normal ml-1">AI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-5">
            <div className="hidden sm:flex items-center space-x-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-slate-500 font-medium">API Online</span>
            </div>
            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-50 border border-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-700 shadow-sm cursor-pointer hover:shadow transition-shadow">
                JS
              </div>
              <button 
                onClick={handleSignOut}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="hidden lg:block lg:col-span-3 space-y-2">
          <div className="mb-6 px-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Detectors</h2>
          </div>
          <button 
            onClick={() => { setActiveTab('spam'); setResult(null); setInputText(''); }}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'spam' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-indigo-700' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${activeTab === 'spam' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <Mail className="w-4 h-4" />
              </div>
              Email Spam
            </div>
            {activeTab === 'spam' && <ChevronRight className="w-4 h-4 text-indigo-400" />}
          </button>
          <button 
            onClick={() => { setActiveTab('toxicity'); setResult(null); setInputText(''); }}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${activeTab === 'toxicity' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-indigo-700' : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'}`}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-lg mr-3 ${activeTab === 'toxicity' ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                <MessageSquareWarning className="w-4 h-4" />
              </div>
              Toxic Comment
            </div>
            {activeTab === 'toxicity' && <ChevronRight className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Mobile Tabs */}
          <div className="lg:hidden flex p-1 bg-slate-200/50 rounded-xl">
            <button
              onClick={() => { setActiveTab('spam'); setResult(null); setInputText(''); }}
              className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-lg transition-all ${
                activeTab === 'spam' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email Spam
            </button>
            <button
              onClick={() => { setActiveTab('toxicity'); setResult(null); setInputText(''); }}
              className={`flex-1 py-2.5 px-4 text-center font-medium text-sm rounded-lg transition-all ${
                activeTab === 'toxicity' 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Toxicity
            </button>
          </div>

          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 overflow-hidden transition-all duration-200 hover:shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-semibold text-slate-800 flex items-center">
                  {activeTab === 'spam' ? 'Email Content Analysis' : 'Comment Toxicity Analysis'}
                </h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                  Max 5,000 chars
                </span>
              </div>
              <div className="relative group">
                <textarea
                  id="text-input"
                  rows={6}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-slate-700 text-sm focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 resize-none transition-all duration-200"
                  placeholder={activeTab === 'spam' ? "Paste raw email content or promotional text here to analyze for spam indicators..." : "Paste the raw text of the comment here to check for toxic, hateful, or abusive language..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>
              
              <div className="mt-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-400">
                  <Activity className="w-4 h-4 text-indigo-400" />
                  <span>Powered by Gemini 2.5 Flash</span>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !inputText.trim()}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-indigo-600 text-white font-medium py-2.5 px-6 rounded-xl text-sm shadow-md shadow-slate-900/10 flex items-center justify-center space-x-2 disabled:opacity-60 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all duration-200 active:scale-95"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  ) : (
                    <>
                      <span>Analyze Text</span>
                      <Send className="w-4 h-4 ml-1" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Result Card */}
          {result && (
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-6 animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
                <div className="flex items-center space-x-4">
                  {result.label === 'Spam' || result.label === 'Toxic' ? (
                    <div className="p-3 bg-red-50 text-red-600 rounded-2xl ring-1 ring-red-100 shadow-sm shadow-red-100/50">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                  ) : result.label === 'Error' || result.label === 'Error analyzing' ? (
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl ring-1 ring-amber-100 shadow-sm shadow-amber-100/50">
                      <AlertCircle className="w-8 h-8" />
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl ring-1 ring-emerald-100 shadow-sm shadow-emerald-100/50">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-slate-500 mb-0.5">Classification</h4>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">{result.label}</div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:items-end">
                  <span className="text-sm font-medium text-slate-500 mb-1">Confidence Score</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">
                      {(result.confidence * 100).toFixed(1)}
                    </span>
                    <span className="text-lg font-bold text-slate-400">%</span>
                  </div>
                </div>
              </div>

              {/* Modern Progress Bar */}
              <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-6 shadow-inner">
                <div 
                  className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${
                    result.label === 'Spam' || result.label === 'Toxic' ? 'bg-gradient-to-r from-red-500 to-red-400' : 
                    result.label === 'Error' || result.label === 'Error analyzing' ? 'bg-gradient-to-r from-amber-500 to-amber-400' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                ></div>
              </div>

              {/* Highlights */}
              {result.highlights && result.highlights.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Indicators Detected</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.highlights.map((h, i) => (
                      <div key={i} className="group flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 ring-1 ring-slate-200/60 hover:ring-indigo-200 hover:bg-indigo-50/50 transition-colors">
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-900">{h.word}</span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className={`text-xs font-bold ${h.weight > 0.8 ? 'text-rose-500' : 'text-slate-500 group-hover:text-indigo-500'}`}>
                          {(h.weight * 100).toFixed(0)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Explanation/Reasoning Section */}
              {result.explanation && (
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Analysis Reasoning</h4>
                  <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {result.explanation}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sidebar - History Panel */}
        <div className="hidden lg:block lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-900/5 p-5 sticky top-24">
            <div className="flex items-center space-x-2 mb-5">
              <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                <History className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Recent Activity</h3>
            </div>
            
            {history.length === 0 ? (
              <div className="text-center text-sm text-slate-400 py-10 flex flex-col items-center">
                <History className="w-8 h-8 text-slate-200 mb-2" />
                <p>No recent logs found.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2 custom-scrollbar">
                {history.map((item) => (
                  <div key={item.id} className="group relative pl-4 pb-4 border-l-2 border-slate-100 last:border-0 last:pb-0 hover:border-indigo-200 transition-colors">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-white ring-2 ring-slate-200 group-hover:ring-indigo-400 transition-colors"></div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        item.result === 'Spam' || item.result === 'Toxic' ? 'bg-red-50 text-red-600 ring-1 ring-red-100' : 
                        item.result === 'Error analyzing' ? 'bg-amber-50 text-amber-600 ring-1 ring-amber-100' : 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100'
                      }`}>
                        {item.result}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1 pr-1 group-hover:text-slate-900 transition-colors">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
