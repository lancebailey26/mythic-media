'use client';
import { useState } from 'react';

export default function UploadPage() {
  const [url, setUrl] = useState('');

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fileInput = form.elements.namedItem('file') as HTMLInputElement;

    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    const res = await fetch('/api/uploadVideo', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setUrl(data.url);
  };

  return (
    <div className="p-8">
      <form onSubmit={handleUpload} encType="multipart/form-data" className="space-y-4">
        <input name="file" type="file" required className="block" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

      {url && (
        <div className="mt-6">
          <p className="text-green-500">Uploaded to:</p>
          <a href={url} target="_blank" className="text-blue-400 underline">{url}</a>
        </div>
      )}
    </div>
  );
}
