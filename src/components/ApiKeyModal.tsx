import { useState } from 'react';
import { Key } from 'lucide-react';
import clsx from 'clsx';

interface ApiKeyModalProps {
  onSubmit: (apiKey: string) => void;
  isOpen: boolean;
}

export function ApiKeyModal({ onSubmit, isOpen }: ApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter a valid API key');
      return;
    }
    if (!apiKey.startsWith('AI')) {
      setError('Invalid API key format. Key should start with "AI"');
      return;
    }
    onSubmit(apiKey);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <Key className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold">Enter Your Gemini API Key</h2>
        </div>
        
        <p className="mb-4 text-sm text-gray-600">
          To use Kisaan Mitra AI, you need to provide your Google Gemini API key. 
          Get your key from{' '}
          <a 
            href="https://makersuite.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            Google AI Studio
          </a>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              className={clsx(
                "w-full rounded-lg border px-4 py-2 focus:border-green-500 focus:outline-none",
                error ? "border-red-500" : "border-gray-300"
              )}
            />
            {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Save API Key
          </button>
        </form>
      </div>
    </div>
  );
}