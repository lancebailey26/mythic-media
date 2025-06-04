'use client';
import { useState } from 'react';

type Props = {
  onGenerated: (results: { imageBase64: string }[]) => void;
};

export default function ThumbnailForm({ onGenerated }: Props) {
  const [name, setName] = useState('');
  const [realm, setRealm] = useState('');
  const [region, setRegion] = useState('us');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generateThumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, realm, region })
      });
      const data = await res.json();
      if (res.ok) onGenerated(data);
      else setError(data.error || 'Something went wrong.');
    } catch (e) {
      console.error('Error:', e);
      setError('Failed to generate thumbnails.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {loading ? 'Generating...' : 'Generate Thumbnails'}
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
    </section>
  );
}
