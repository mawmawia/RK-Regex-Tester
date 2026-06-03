import { useState } from 'react'

export default function Regex() {
  const [pattern, setPattern] = useState('\\d+')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('order 123 shipped 456 failed')
  const [email, setEmail] = useState('')

  let matches = []
  let error = null
  try {
    const re = new RegExp(pattern, flags)
    matches = [...testString.matchAll(re)]
  } catch (e) {
    error = e.message
  }

  const saveRegex = async () => {
    if (!email) return alert('Add email for break alerts')
    await fetch('/api/regex-save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pattern, flags, testString, email })
    })
    alert('Saved. You will get alerts if this regex stops matching prod data.')
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold">RK Regex Tester</h1>
        <p className="text-gray-400 mb-6">Test. Debug. Get alerts when patterns break. Part of Rael_Kertia Empire.</p>

        <div className="flex gap-2 my-4 items-center">
          <span className="text-gray-500 text-2xl">/</span>
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            className="bg-gray-900 text-xl p-3 flex-1 rounded font-mono border border-gray-800 focus:border-blue-500 outline-none"
            placeholder="your-regex"
          />
          <span className="text-gray-500 text-2xl">/</span>
          <input
            value={flags}
            onChange={e => setFlags(e.target.value)}
            className="bg-gray-900 text-xl p-3 w-20 rounded font-mono border border-gray-800 focus:border-blue-500 outline-none"
            placeholder="gi"
          />
        </div>

        <textarea
          value={testString}
          onChange={e => setTestString(e.target.value)}
          className="bg-gray-900 p-4 w-full h-40 my-2 rounded font-mono border border-gray-800 focus:border-blue-500 outline-none"
          placeholder="Test string here..."
        />

        <div className="bg-gray-900 p-4 rounded my-4 border border-gray-800">
          {error? (
            <p className="text-red-400">Error: {error}</p>
          ) : (
            <>
              <p className="text-green-400 mb-3">{matches.length} matches found</p>
              <div className="space-y-1 max-h-60 overflow-y-auto">
                {matches.map((m, i) => (
                  <div key={i} className="text-sm text-gray-300 font-mono">
                    <span className="text-white">{m[0]}</span> 
                    <span className="text-gray-500"> at index {m.index}</span>
                    {m.length > 1 && <span className="text-blue-400"> groups: {m.slice(1).join(', ')}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="border border-gray-800 p-4 rounded bg-gray-950">
          <h2 className="text-xl mb-2">Monitor this regex for free</h2>
          <p className="text-sm text-gray-400 mb-3">Get email when this pattern stops matching your production logs or data.</p>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="bg-gray-900 p-3 w-full rounded mb-3 border border-gray-800 focus:border-blue-500 outline-none"
          />
          <button
            onClick={saveRegex}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded w-full font-semibold"
          >
            Get Break Alerts
          </button>
          <p className="text-xs text-gray-500 mt-3">
            API access + CI integration on $15/mo plan. Free tier: 100k requests monthly.
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <a href="https://cron.raels.dev" className="hover:text-gray-400">RK Cron Monitor</a> • 
          <a href="https://json.raels.dev" className="hover:text-gray-400 ml-2">RK JSON Tools</a> • 
          <span className="ml-2">Rael_Kertia Empire</span>
        </div>
      </div>
    </div>
  )
}
