import { useState, useEffect } from 'react';
import { Sprout, Settings } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { ApiKeyModal } from './components/ApiKeyModal';
import { Message } from './types';
import { generateResponse } from './services/ai';
import { saveApiKey, getApiKey, removeApiKey } from './services/storage';

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'नमस्ते! मैं किसान मित्र AI हूं। आप कृषि संबंधी कोई भी प्रश्न पूछ सकते हैं या फसल की तस्वीर अपलोड कर सकते हैं।',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiModal, setShowApiModal] = useState(false);

  useEffect(() => {
    const apiKey = getApiKey();
    if (!apiKey) {
      setShowApiModal(true);
    }
  }, []);

  const handleApiKeySubmit = (apiKey: string) => {
    saveApiKey(apiKey);
    setShowApiModal(false);
  };

  const handleResetApiKey = () => {
    removeApiKey();
    setShowApiModal(true);
  };

  const handleSend = async (content: string, image?: File) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userMessage: Message = {
        id: Date.now().toString(),
        content,
        sender: 'user',
        timestamp: new Date(),
        image: image ? URL.createObjectURL(image) : undefined
      };
      
      setMessages(prev => [...prev, userMessage]);

      const response = await generateResponse(content, image);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in conversation:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      if (errorMessage.includes('API key not found')) {
        setShowApiModal(true);
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-translucent shadow-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Kisaan Mitra AI</h1>
          </div>
          <button
            onClick={handleResetApiKey}
            className="flex items-center gap-1 rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
          >
            <Settings size={16} />
            Change API Key
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col p-4">
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-800">
            {error}
          </div>
        )}
        <div className="flex-1 space-y-4 overflow-y-auto rounded-lg bg-translucent p-4 shadow-lg">
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
            />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-gray-500">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0.2s' }}></div>
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <ChatInput 
            onSend={handleSend} 
            disabled={isLoading}
          />
        </div>
      </main>

      <footer className="bg-translucent py-4 text-center text-sm text-gray-600 shadow-lg">
        Kisaan Mitra AI - Your Farming Assistant
      </footer>

      <ApiKeyModal 
        isOpen={showApiModal} 
        onSubmit={handleApiKeySubmit} 
      />
    </div>
  );
}

export default App;