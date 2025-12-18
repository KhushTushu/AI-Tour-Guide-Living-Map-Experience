
import React, { useState, useRef, useEffect } from 'react';
import { Destination, Message, Itinerary } from './types';
import { DESTINATIONS } from './constants';
import MapDisplay from './components/MapDisplay';
import PostcardMessage from './components/PostcardMessage';
import { getTourGuideResponse, generateItinerary } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Welcome, fellow traveler! I'm Vagabond, your AI Tour Guide. Where shall we explore today? Click a pin on the map or ask me anything about world wonders!",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const responseText = await getTourGuideResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, assistantMessage]);
    setLoading(false);
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDest(dest);
    setItinerary(null);
    
    // Add a postcard message
    const postcard: Message = {
      id: `postcard-${dest.id}-${Date.now()}`,
      role: 'assistant',
      content: `Exploring ${dest.name}...`,
      timestamp: new Date(),
      isPostcard: true,
      postcardData: dest
    };
    setMessages(prev => [...prev, postcard]);
  };

  const handleGenerateItinerary = async () => {
    if (!selectedDest || loading) return;
    setLoading(true);
    const result = await generateItinerary(selectedDest.name);
    setItinerary(result);
    setLoading(false);
    
    if (result) {
      setMessages(prev => [...prev, {
        id: `itinerary-msg-${Date.now()}`,
        role: 'assistant',
        content: `I've prepared a special 3-day journey for you in ${selectedDest.name}! Check the details on your screen.`,
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#fdf6e3] text-[#2d241e]">
      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#bc6c25] rounded-full flex items-center justify-center text-white shadow-lg">
            <i className="fa-solid fa-compass animate-spin-slow"></i>
          </div>
          <div>
            <h1 className="font-playfair text-2xl font-bold tracking-tight text-[#2d241e]">Vagabond AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#d4a373] font-bold">Living Map Experience</p>
          </div>
        </div>
        
        <div className="hidden md:flex gap-4">
          {['All', 'Adventure', 'Nature', 'Historical', 'Cultural', 'Beach'].map(cat => (
            <button 
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                categoryFilter === cat 
                  ? 'bg-[#d4a373] text-white shadow-md' 
                  : 'bg-white text-[#bc6c25] border border-[#d4a373]/30 hover:bg-[#faedcd]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
           <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <i className="fa-solid fa-bookmark text-xs text-gray-400"></i>
           </button>
           <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <i className="fa-solid fa-share-nodes text-xs text-gray-400"></i>
           </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden p-4 gap-4">
        {/* Map Section */}
        <section className="flex-[1.5] relative rounded-3xl overflow-hidden shadow-2xl bg-white min-h-[400px]">
          <MapDisplay onSelectDestination={handleSelectDestination} selectedCategory={categoryFilter} />
          
          {/* Parallax Info Card (Floating Overlay) */}
          {selectedDest && (
            <div className="absolute bottom-6 left-6 right-6 lg:left-10 lg:right-auto lg:w-96 bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-6 transform transition-all animate-fade-in border-t-4 border-[#bc6c25]">
              <button 
                onClick={() => setSelectedDest(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="flex gap-4 mb-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                  <img src={selectedDest.image} alt={selectedDest.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#bc6c25] uppercase tracking-widest">{selectedDest.category}</span>
                  <h2 className="font-playfair text-2xl font-bold leading-tight">{selectedDest.name}</h2>
                  <p className="text-sm text-gray-500">{selectedDest.country}</p>
                </div>
              </div>
              
              <p className="text-sm leading-relaxed text-gray-700 mb-6 italic">
                {selectedDest.description}
              </p>

              <div className="flex gap-2">
                <button 
                  onClick={handleGenerateItinerary}
                  disabled={loading}
                  className="flex-1 bg-[#2c5e50] text-white py-2 px-4 rounded-xl text-sm font-semibold hover:bg-[#1e3f36] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <i className="fa-solid fa-spinner animate-spin"></i>
                  ) : (
                    <>
                      <i className="fa-solid fa-map-location-dot"></i>
                      Get Itinerary
                    </>
                  )}
                </button>
                <button className="p-2 bg-[#faedcd] text-[#bc6c25] rounded-xl hover:bg-[#fefae0] transition-colors">
                  <i className="fa-solid fa-headphones"></i>
                </button>
              </div>
            </div>
          )}

          {/* Itinerary Detailed View Overlay */}
          {itinerary && (
            <div className="absolute inset-0 bg-white/95 z-20 overflow-y-auto p-10 animate-slide-up">
              <button 
                onClick={() => setItinerary(null)}
                className="fixed top-8 right-8 w-10 h-10 bg-[#bc6c25] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              
              <div className="max-w-2xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-[#d4a373] font-bold tracking-[0.2em] uppercase text-xs">A curated journey to</span>
                  <h2 className="font-playfair text-5xl font-bold mt-2">{itinerary.destination}</h2>
                  <div className="h-1 w-20 bg-[#d4a373] mx-auto mt-4"></div>
                </div>

                <div className="space-y-12">
                  {itinerary.days.map((day) => (
                    <div key={day.day} className="relative pl-12 border-l-2 border-dotted border-[#d4a373]">
                      <div className="absolute -left-5 top-0 w-10 h-10 bg-[#d4a373] text-white rounded-full flex items-center justify-center font-playfair text-xl shadow-lg">
                        {day.day}
                      </div>
                      <h3 className="font-playfair text-2xl mb-4">{day.title}</h3>
                      <ul className="space-y-3">
                        {day.activities.map((activity, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-gray-700">
                            <i className="fa-solid fa-circle-check text-[#bc6c25] mt-1.5 text-[10px]"></i>
                            <span className="text-sm leading-relaxed">{activity}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 p-6 bg-[#faedcd]/30 rounded-2xl border border-[#d4a373]/20 flex flex-col items-center">
                   <p className="text-sm text-center italic text-[#bc6c25] mb-4">"The world is a book and those who do not travel read only one page." — Saint Augustine</p>
                   <button className="px-8 py-3 bg-[#bc6c25] text-white rounded-full font-bold shadow-lg hover:bg-[#a05b1e] transition-all">
                     Save Trip Journal
                   </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Chat Section */}
        <section className="flex-1 flex flex-col bg-white rounded-3xl shadow-xl overflow-hidden border border-[#d4a373]/10">
          <div className="p-4 bg-[#fdfaf0] border-b border-[#d4a373]/10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e9edc9] flex items-center justify-center">
              <img src="https://picsum.photos/seed/guide/100/100" alt="Guide" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Vagabond</h3>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Guide Active</span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
            {messages.map((msg) => (
              <PostcardMessage key={msg.id} message={msg} />
            ))}
            {loading && !itinerary && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Vagabond about places..."
                className="flex-1 bg-gray-100 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-[#bc6c25]/50 transition-all outline-none"
              />
              <button 
                type="submit"
                disabled={loading}
                className="w-12 h-12 bg-[#bc6c25] text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-[#a05b1e] transition-all disabled:opacity-50"
              >
                <i className="fa-solid fa-paper-plane text-sm"></i>
              </button>
            </div>
          </form>
        </section>
      </main>

      {/* Decorative footer element */}
      <footer className="h-8 bg-[#2c5e50] flex items-center justify-center">
         <div className="flex gap-8">
            <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">
               <i className="fa-solid fa-cloud"></i>
               <span>Weather Tracking: ON</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium tracking-[0.2em] uppercase">
               <i className="fa-solid fa-wifi"></i>
               <span>Real-time Satellite: ACTIVE</span>
            </div>
         </div>
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default App;
