'use client';
import { useState, useEffect } from 'react';
type Thumbnail = { imageBase64: string };

export default function Home() {
  const [name, setName] = useState('');
  const [realm, setRealm] = useState('');
  const [region, setRegion] = useState('us');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Thumbnail[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.className = 'bg-zinc-900 text-white min-h-screen';
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generateThumbnails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, realm, region })
      });
      const data = await res.json();
      if (res.ok) setResults(data);
      else setError(data.error || 'Something went wrong.');
    } catch (e) {
      console.error('xError generating thumbnails:', e);
      setError('Failed to generate thumbnails.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-zinc-900 text-white">
      <div className="w-full max-w-5xl space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight">Mythic+ Thumbnail Generator</h1>
          <p className="text-zinc-400 text-lg">Turn your WoW runs into cinematic thumbnails</p>
        </header>

        <section className="bg-zinc-800 rounded-xl shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              className="bg-zinc-900 text-white border border-zinc-700 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Character Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="bg-zinc-900 text-white border border-zinc-700 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Realm (e.g., area-52)"
              value={realm}
              onChange={(e) => setRealm(e.target.value)}
            />
            <select
              className="bg-zinc-900 text-white border border-zinc-700 px-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="us">US</option>
              <option value="eu">EU</option>
              <option value="kr">KR</option>
              <option value="tw">TW</option>
            </select>
          </div>

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold px-6 py-3 rounded-md text-lg disabled:opacity-50"
            onClick={handleSubmit}
            disabled={loading || !name || !realm}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                Generating...
              </span>
            ) : (
              'Generate Thumbnails'
            )}
          </button>

          {error && <p className="text-red-400 text-center">{error}</p>}
        </section>

        {results[0] && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Thumbnail</h2>

            <div className="bg-zinc-800 p-6 rounded-xl shadow-lg flex flex-col items-center max-w-3xl mx-auto">
              <img
                src={`data:image/png;base64,${results[0].imageBase64}`}
                alt="Generated Thumbnail"
                className="rounded w-full border border-zinc-700"
              />
              <a
                href={`data:image/png;base64,${results[0].imageBase64}`}
                download={`thumbnail.png`}
                className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 transition text-white font-medium px-6 py-2 rounded-md"
              >
                Download Thumbnail
              </a>
            </div>
          </section>
        )}

      </div>
    </div>

  );
}
