import React, { useState } from 'react';
import { Sparkles, Send, Bot, User } from 'lucide-react';
import { Button } from './Button';
import { generateResponse } from '../services/gemini';
import { LoadingState, ChatMessage } from '../types';

export const DemoSection: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<LoadingState>(LoadingState.IDLE);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setStatus(LoadingState.LOADING);

    try {
      const responseText = await generateResponse(userMessage.text);
      const modelMessage: ChatMessage = { role: 'model', text: responseText };
      setMessages(prev => [...prev, modelMessage]);
      setStatus(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = { 
        role: 'model', 
        text: "I apologize, but I encountered an error connecting to the AI service. Please try again." 
      };
      setMessages(prev => [...prev, errorMessage]);
      setStatus(LoadingState.ERROR);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-16 p-1">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-2 bg-slate-900/50 backdrop-blur">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h2 className="font-semibold text-slate-200">Live Demo</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">gemini-2.5-flash</span>
        </div>

        {/* Chat Area */}
        <div className="h-[400px] overflow-y-auto p-6 space-y-6 bg-slate-950/50 scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
              <Bot className="w-12 h-12 opacity-50" />
              <p>Ask something to start the conversation...</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-300" />
                  </div>
                )}
              </div>
            ))
          )}
          {status === LoadingState.LOADING && (
            <div className="flex gap-4 justify-start">
               <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-slate-800 rounded-2xl rounded-tl-none px-5 py-4 border border-slate-700 flex items-center gap-2">
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-800">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about the universe..."
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <Button type="submit" disabled={!input.trim() || status === LoadingState.LOADING}>
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};