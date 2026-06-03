import { useState } from 'react'
import Head from 'next/head'

export default function Regex() {
  const [pattern, setPattern] = useState('\\d+')
  const [flags, setFlags] = useState('g')
  const [testString, setTestString] = useState('order 123 shipped 456 failed')
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState(false)

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
    alert('Monitoring active. You will get alerts if this regex stops matching.')
  }

  const copyOutput = () => {
    const output = JSON.stringify(matches.map(m => ({
      match: m[0],
      index: m.index,
      groups: m.slice(1)
    })), null, 2)
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Head>
        <title>RK Regex Tester - Rael_Kertia Empire</title>
        <meta name="description" content="Test regex patterns. Get alerts when production data stops matching." />
      </Head>
      
      <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-mono">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Header - Matches RK JSON */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">RK Regex Tester</h1>
            <p className="text-gray-400 text-sm">
              Test patterns. Debug matches. Get alerts when prod data breaks. 
              <span className="text-blue-400 ml-2">Part of Rael_Kertia Empire</span>
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-4">
            <label className="text-xs text-gray-500 uppercase tracking-wider">Pattern</label>
            <div className="flex gap-2 items-center mt-2 mb-4">
              <span className="text-gray-600 text-lg">/</span>
              <input
                value={pattern}
                onChange={e => setPattern(e.target.value)}
                className="bg-[#0a0a0a] text-green-400 px-3 py-2 flex-1 rounded border border-[#222] focus:border-blue-500 focus:outline-none text-sm"
                placeholder="your-regex-pattern"
                spellCheck="false"
              />
              <span className="text-gray-600 text-lg">/</span>
              <input
                value={flags}
                onChange={e => setFlags(e.target.value)}
                className="bg-[#0a0a0a] text-yellow-400 px-3 py-2 w-16 rounded border border-[#222] focus:border-blue-500 focus:outline-none text-sm text-center"
                placeholder="gi"
                spellCheck="false"
              />
            </div>

            <label className="text-xs text-gray-500 uppercase tracking-wider">Test String</label>
            <textarea
              value={testString}
              onChange={e => setTestString(e.target.value)}
              className="bg-[#0a0a0a] text-gray-300 p-3 w-full h-32 mt-2 rounded border border-[#222] focus:border-blue-500 focus:outline-none text-sm resize-none"
              placeholder="Paste your test data here..."
              spellCheck="false"
            />
          </div>

          {/* Output Section */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-4">
            <div className="flex justify-between items-center mb-3">
              <label className="text-xs text-gray-500 uppercase tracking-wider">
                {error? 'Error' : `Matches: ${matches.length}`}
              </label>
              {!error && matches.length > 0 && (
                <button
                  onClick={copyOutput}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  {copied? 'Copied!' : 'Copy JSON'}
                </button>
              )}
            </div>
            
            <div className="bg-[#0a0a0a] rounded border border-[#222] p-3 min-h-[120px] max-h-[300px] overflow-y-auto">
              {error? (
                <p className="text-red-400 text-sm">{error}</p>
              ) : matches.length === 0? (
                <p className="text-gray-600 text-sm">No matches found</p>
              ) : (
                <div className="space-y-2">
                  {matches.map((m, i) => (
                    <div key={i} className="text-sm">
                      <span className="text-green-400">"{m[0]}"</span>
                      <span className="text-gray-600 ml-3">index: {m.index}</span>
                      {m.length > 1 && (
                        <span className="text-blue-400 ml-3">
                          groups: [{m.slice(1).map(g => `"${g}"`).join(', ')}]
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Monitor Section - Matches RK JSON style */}
          <div className="bg-[#111] border border-[#222] rounded-lg p-5 mb-8">
            <h2 className="text-sm font-semibold text-white mb-1">Monitor this regex</h2>
            <p className="text-xs text-gray-500 mb-4">
              Get email alerts when this pattern stops matching your production logs
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="bg-[#0a0a0a] text-gray-300 px-3 py-2 flex-1 rounded border border-[#222] focus:border-blue-500 focus:outline-none text-sm"
              />
              <button
                onClick={saveRegex}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-medium transition-colors"
              >
                Get Alerts
              </button>
            </div>
            <p className="text-[10px] text-gray-600 mt-3">
              Free tier: 100k requests/month. API access on $15/mo plan.
            </p>
          </div>

          {/* Footer - Empire Links */}
          <div className="border-t border-[#222] pt-6 text-xs text-gray-600">
            <div className="flex gap-4 mb-2">
              <a href="https://cron.raels.dev" className="hover:text-gray-400 transition-colors">
                RK Cron Monitor
              </a>
              <span className="text-gray-700">•</span>
              <a href="https://json.raels.dev" className="hover:text-gray-400 transition-colors">
                RK JSON Tools
              </a>
              <span className="text-gray-700">•</span>
              <span className="text-gray-500">RK Regex Tester</span>
            </div>
            <p>Rael_Kertia Empire © 2026</p>
          </div>

        </div>
      </div>
    </>
  )
            }
