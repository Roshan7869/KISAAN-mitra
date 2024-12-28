import { useState, useRef } from 'react';
import { Image, Send } from 'lucide-react';
import clsx from 'clsx';

interface ChatInputProps {
  onSend: (message: string, image?: File) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || image) {
      onSend(message, image || undefined);
      setMessage('');
      setImage(null);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageSelect}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        className={clsx(
          "flex items-center justify-center rounded-full p-2",
          image ? "bg-green-100 text-green-600" : "bg-gray-100 hover:bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Image size={20} />
      </button>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask your farming question..."
        disabled={disabled}
        className={clsx(
          "flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      />

      <button
        type="submit"
        disabled={(!message.trim() && !image) || disabled}
        className={clsx(
          "flex items-center justify-center rounded-full bg-green-500 p-2 text-white hover:bg-green-600",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        <Send size={20} />
      </button>
    </form>
  );
}