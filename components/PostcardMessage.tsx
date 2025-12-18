
import React from 'react';
import { Message } from '../types';

interface PostcardMessageProps {
  message: Message;
}

const PostcardMessage: React.FC<PostcardMessageProps> = ({ message }) => {
  const isAssistant = message.role === 'assistant';
  
  if (message.isPostcard && message.postcardData) {
    const { postcardData } = message;
    return (
      <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} mb-6`}>
        <div className="max-w-[85%] bg-[#fffdf0] p-4 shadow-xl border-t-8 border-[#d4a373] transform transition-transform hover:rotate-1 rotate-[-1deg]">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3 h-32 md:h-40 overflow-hidden rounded shadow-inner">
              <img src={postcardData.image} alt={postcardData.name} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-between border-l-0 md:border-l-2 border-dotted border-[#d4a373]/50 md:pl-4">
              <div>
                <h3 className="font-playfair text-xl text-[#2d241e]">{postcardData.name}</h3>
                <p className="text-xs text-[#d4a373] font-bold uppercase tracking-widest mb-2">{postcardData.country}</p>
                <p className="font-handwriting text-lg text-[#5c4a3a] leading-tight">
                  "{postcardData.funFact}"
                </p>
              </div>
              <div className="mt-4 flex justify-between items-end">
                <div className="w-10 h-10 border-2 border-[#d4a373] flex items-center justify-center opacity-40">
                  <i className="fa-solid fa-stamp text-[#d4a373]"></i>
                </div>
                <span className="text-[10px] text-[#bc6c25] italic">{message.timestamp.toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full ${isAssistant ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[75%] p-3 rounded-2xl shadow-sm ${
        isAssistant 
          ? 'bg-white text-[#2d241e] rounded-bl-none border border-[#d4a373]/20' 
          : 'bg-[#d4a373] text-white rounded-br-none'
      }`}>
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span className={`text-[10px] block mt-1 ${isAssistant ? 'text-gray-400' : 'text-white/70'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
};

export default PostcardMessage;
