import { Message } from '../types';
import { Bot, User } from 'lucide-react';
import { formatTime } from '../utils/dateUtils';
import clsx from 'clsx';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isBot = message.sender === 'bot';
  
  const formatContent = (content: string) => {
    const lines = content.split('\n');
    const hasPoints = lines.some(line => line.match(/^\d+\./));
    
    if (hasPoints) {
      return (
        <ul className="space-y-2">
          {lines.map((line, index) => {
            const trimmedLine = line.trim();
            if (!trimmedLine) return null;
            
            const isPoint = trimmedLine.match(/^\d+\./);
            
            return isPoint ? (
              <li key={index} className="ml-4">
                {trimmedLine}
              </li>
            ) : (
              <p key={index}>{trimmedLine}</p>
            );
          })}
        </ul>
      );
    }
    
    return <p className="text-sm">{content}</p>;
  };
  
  return (
    <div className={`flex gap-3 ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={clsx(
        'flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full',
        isBot ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600',
        message.isError && 'bg-red-100 text-red-600'
      )}>
        {isBot ? <Bot size={18} /> : <User size={18} />}
      </div>
      
      <div className={`flex max-w-[80%] flex-col ${isBot ? 'items-start' : 'items-end'}`}>
        <div className={clsx(
          'rounded-lg px-6 py-4',
          isBot ? 'bg-white bg-opacity-90 shadow-sm' : 'bg-blue-500 text-white',
          message.isError && 'bg-red-50 text-red-800'
        )}>
          <div className="prose prose-sm">
            {formatContent(message.content)}
          </div>
          
          {message.image && (
            <img 
              src={message.image} 
              alt="Uploaded crop" 
              className="mt-4 rounded-lg max-w-xs shadow-md"
            />
          )}
        </div>
        
        <span className="mt-2 text-xs text-gray-500 px-2">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
}