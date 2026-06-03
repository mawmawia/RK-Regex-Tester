import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [pattern, setPattern] = useState('\\d+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('order 123 shipped 456 failed');
  const [result, setResult] = useState(null);
  const [email, setEmail] = useState('');
  const [alertStatus, setAlertStatus] = useState('');

  useEffect(() => { testRegex(); }, [pattern, flags, testString]);

  async function testRegex() {
    try {
      const res = await fetch(`/api/test?pattern=${encodeURIComponent(pattern)}&flags=${flags}&test=${encodeURIComponent(testString)}`);
      setResult(await res.json());
    } catch (e) {
      setResult({ error: 'Invalid regex' });
    }
  }

  const styles = {
    page: { minHeight: '100vh', background: '#0a0a0a', color: '#e5e5e5', fontFamily: 'system-ui, sans-serif' },
    container: { maxWidth: '900px', margin: '0 auto', padding: '48px 16px' },
    h1: { fontSize: '36px', fontWeight: '700', background: 'linear-gradient(to right, #60a5fa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' },
    sub: { color: '#9ca3af', marginBottom: '48px' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' },
    label: { display: 'block', fontSize: '14px', color: '#d1d5db', marginBottom: '8px' },
    inputWrap: { display: 'flex', alignItems: 'center', background: '#171717', border: '1px solid #262626', borderRadius: '8px', overflow: 'hidden' },
    input: { flex: 1, background: 'transparent', border: 'none', padding: '12px', color: '#22d3ee', fontFamily: 'monospace', outline: 'none' },
    flag: { width: '64px', background: '#262626', border: 'none', padding: '12px 8px', color: '#facc15', fontFamily: 'monospace', textAlign: 'center', outline: 'none' },
    textarea: { width: '100%', background: '#171717', border: '1px solid #262626', borderRadius: '8px', padding: '12px', color: '#e5e5e5', fontFamily: 'monospace', outline: 'none', resize: 'vertical' },
    card: { background: '#171717', border: '1px solid #262626', borderRadius: '8px', padding: '16px' },
    btn: { background: '#2563eb', border: 'none', color: 'white', padding: '8px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' },
    btnSmall: { fontSize: '12px', background: '#262626', border: '1px solid #404040', color: '#e5e5e5', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer' },
    match: { background: '#0a0a0a', padding: '8px', borderRadius: '4px', border: '1px solid #262626', fontSize: '14px', marginBottom: '8px' },
    alertBox: { background: 'linear-gradient(to bottom right, #171717, #0a0a0a)', border: '1px solid #262626', borderRadius: '12px', padding: '24px', marginBottom: '32px' },
    footer: { borderTop: '1px solid #262626', paddingTop: '24px', fontSize: '14px', color: '#6b7280' },
    link: { color: '#60a5fa', textDecoration: 'none' }
  };

  return (
    <>
      <Head><title>RK Regex Tester</title></Head>
      <div style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.h1}>RK Regex Tester</h1>
          <p style={styles.sub}>Test patterns. Debug matches. Get alerts when prod data breaks. Part of Rael_Kertia Empire</p>

          <div style={styles.grid}>
            <div>
              <label style={styles.label}>Pattern</label>
              <div style={styles.inputWrap}>
                <span style={{padding: '0 12px', color: '#6b7280'}}>/</span>
                <input style={styles.input} value={pattern} onChange={e => setPattern(e.target.value)} placeholder="\d+" />
                <span style={{padding: '0 12px', color: '#6b7280'}}>/</span>
                <input style={styles.flag} value={flags} onChange={e => setFlags(e.target.value)} placeholder="g" />
              </div>
              <br/>
              <label style={styles.label}>Test String</label>
              <textarea style={styles.textarea} rows="4" value={testString} onChange={e => setTestString(e.target.value)} />
            </div>

            <div style={styles.card}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <h3 style={{margin: 0}}>Matches: <span style={{color: '#22d3ee'}}>{result?.count || 0}</span></h3>
                <button style={styles.btnSmall} onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}>Copy JSON</button>
              </div>
              <div style={{maxHeight: '250px', overflow: 'auto'}}>
                {result?.error && <div style={{color: '#f87171'}}>{result.error}</div>}
                {result?.matches?.map((m, i) => (
                  <div key={i} style={styles.match}>
                    <span style={{color: '#4ade80', fontFamily: 'monospace'}}>"{m.match}"</span>
                    <span style={{color: '#6b7280', marginLeft: '8px'}}>index: {m.index}</span>
                  </div>
                ))}
                {result?.count === 0 && <div style={{color: '#6b7280'}}>No matches</div>}
              </div>
            </div>
          </div>

          <div style={styles.alertBox}>
            <h2 style={{fontSize: '20px', marginTop: 0}}>Monitor this regex</h2>
            <p style={{color: '#9ca3af', fontSize: '14px'}}>Get email alerts when this pattern stops matching your production logs</p>
            <div style={{display: 'flex', gap: '8px', marginTop: '16px'}}>
              <input style={{...styles.textarea, flex: 1}} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" />
              <button style={styles.btn} onClick={async () => {
                setAlertStatus('Setting up...');
                const res = await fetch('/api/monitor', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ email, pattern, flags, testString })});
                setAlertStatus(res.ok ? 'Alert active. Check email.' : 'Failed. Try again.');
              }}>Get Alerts</button>
            </div>
            {alertStatus && <div style={{color: '#22d3ee', fontSize: '14px', marginTop: '8px'}}>{alertStatus}</div>}
            <p style={{color: '#4b5563', fontSize: '12px', marginTop: '16px'}}>Free tier: 100k requests/month. API access on $15/mo plan.</p>
          </div>

          <footer style={styles.footer}>
            <div style={{display: 'flex', gap: '16px', marginBottom: '8px'}}>
              <a href="https://rk-cron.raels.dev" style={styles.link}>RK Cron Monitor</a>
              <span>•</span>
              <a href="https://rk-json.raels.dev" style={styles.link}>RK JSON Tools</a>
              <span>•</span>
              <a href="https://regex.raels.dev" style={styles.link}>RK Regex Tester</a>
            </div>
            <div>Rael_Kertia Empire © 2026</div>
          </footer>
        </div>
      </div>
    </>
  );
  }
