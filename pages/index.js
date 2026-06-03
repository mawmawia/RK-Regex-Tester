import { useState, useEffect } from 'react';

export default function Home() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('order 123 shipped 456 failed');
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [alertStatus, setAlertStatus] = useState('');

  useEffect(() => {
    testRegex();
  }, [pattern, flags, testString]);

  async function testRegex() {
    try {
      const res = await fetch(`/api/test?pattern=${encodeURIComponent(pattern)}&flags=${flags}&test=${encodeURIComponent(testString)}`);
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: 'Invalid regex' });
    }
  }

  function copyJSON() {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
  }

  async function subscribeAlert() {
    setAlertStatus('Setting up...');
    const res = await fetch('/api/monitor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, pattern, flags, testString })
    });
    setAlertStatus(res.ok ? 'Alert active. Check email.' : 'Failed. Try again.');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <header className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            RK Regex Tester
          </h1>
          <p className="text-gray-400">
            Test patterns. Debug matches. Get alerts when prod data breaks. Part of Rael_Kertia Empire
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pattern</label>
              <div className="flex items-center bg-gray-900 border border-gray-800 rounded-lg overflow-hidden focus-within:border-blue-500">
                <span className="px-3 text-gray-500">/</span>
                <input 
                  value={pattern}
                  onChange={e => setPattern(e.target.value)}
                  className="flex-1 bg-transparent py-3 outline-none font-mono text-cyan-300"
                  placeholder="\d+"
                />
                <span className="px-3 text-gray-500">/</span>
                <input 
                  value={flags}
                  onChange={e => setFlags(e.target.value)}
                  className="w-16 bg-gray-800 py-3 px-2 outline-none font-mono text-yellow-400 text-center"
                  placeholder="g"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Test String</label>
              <textarea
                value={testString}
                onChange={e => setTestString(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-lg p-3 font-mono text-gray-100 focus:border-blue-500 outline-none resize-none"
                rows="4"
                placeholder="order 123 shipped 456"
              />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-gray-300">
                Matches: <span className="text-cyan-400">{result?.count || 0}</span>
              </h3>
              <button 
                onClick={copyJSON}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded border border-gray-700"
              >
                Copy JSON
              </button>
            </div>
            
            <div className="space-y-2 max-h-64 overflow-auto">
              {result?.error && <div className="text-red-400 text-sm">{result.error}</div>}
              {result?.matches?.map((m, i) => (
                <div key={i} className="bg-gray-950 p-2 rounded border border-gray-800 text-sm">
                  <span className="text-green-400 font-mono">"{m.match}"</span>
                  <span className="text-gray-500 ml-2">index: {m.index}</span>
                </div>
              ))}
              {result?.count === 0 && <div className="text-gray-500 text-sm">No matches</div>}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold mb-2">Monitor this regex</h2>
          <p className="text-gray-400 text-sm mb-4">
            Get email alerts when this pattern stops matching your production logs
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
            />
            <button 
              onClick={subscribeAlert}
              className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-medium"
            >
              Get Alerts
            </button>
          </div>
          {alertStatus && <div className="text-sm text-cyan-400 mt-2">{alertStatus}</div>}
          <p className="text-gray-600 text-xs mt-4">
            Free tier: 100k requests/month. API access on $15/mo plan.
          </p>
        </div>

        <footer className="border-t border-gray-800 pt-6 text-sm text-gray-500">
          <div className="flex gap-4 mb-2">
            <a href="https://rk-cron.raels.dev" className="hover:text-blue-400">RK Cron Monitor</a>
            <span>•</span>
            <a href="https://rk-json.raels.dev" className="hover:text-blue-400">RK JSON Tools</a>
            <span>•</span>
            <a href="https://regex.raels.dev" className="hover:text-blue-400">RK Regex Tester</a>
          </div>
          <div>Rael_Kertia Empire © 2026</div>
        </footer>

      </div>
    </div>
  );
              }
