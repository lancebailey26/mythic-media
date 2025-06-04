'use client';
import { useEffect, useState } from 'react';
import ThumbnailForm from '@/components/thumbnailForm';

export default function Home() {
  const [results, setResults] = useState<{ imageBase64: string }[]>([]);

  useEffect(() => {
    document.body.className = 'bg-zinc-900 text-white min-h-screen';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-zinc-900 text-white">
      <div className="w-full max-w-5xl space-y-12">
        <header className="text-center space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight">Mythic+ Thumbnail Generator</h1>
          <p className="text-zinc-400 text-lg">Turn your WoW runs into cinematic thumbnails</p>
        </header>

        <ThumbnailForm onGenerated={setResults} />

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
                download="thumbnail.png"
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
