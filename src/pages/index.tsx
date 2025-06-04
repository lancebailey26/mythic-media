// src/pages/index.tsx
import { useState } from 'react';

export default function Home() {
  const [name, setName] = useState('');
  const [realm, setRealm] = useState('');
  const [region, setRegion] = useState('us');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

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
      setError('Failed to generate thumbnails.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Mythic+ Thumbnail Generator</h1>

      <div className="space-y-4 mb-6">
        <input
          className="border p-2 w-full"
          placeholder="Character Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-full"
          placeholder="Realm (e.g., area-52)"
          value={realm}
          onChange={(e) => setRealm(e.target.value)}
        />
        <select className="border p-2 w-full" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="us">US</option>
          <option value="eu">EU</option>
          <option value="kr">KR</option>
          <option value="tw">TW</option>
        </select>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate Thumbnails'}
        </button>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {results.map((r, i) => (
          <div key={i} className="border p-4">
            <img
              src={`data:image/png;base64,${r.imageBase64}`}
              alt={`Thumbnail ${i + 1}`}
              className="w-full"
            />
            <p className="text-sm mt-2 text-gray-600">{r.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
