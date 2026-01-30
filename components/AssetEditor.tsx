
import React, { useState } from 'react';
import { CampaignAsset } from '../types';
import { X, Sparkles, Save, Copy, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface AssetEditorProps {
  asset: CampaignAsset;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAsset: CampaignAsset) => void;
}

export const AssetEditor: React.FC<AssetEditorProps> = ({ asset, isOpen, onClose, onSave }) => {
  const [content, setContent] = useState(asset.content);
  const [title, setTitle] = useState(asset.title);
  const [isRewriting, setIsRewriting] = useState(false);

  if (!isOpen) return null;

  const handleRewrite = async (tone: 'professional' | 'witty' | 'shorter') => {
    setIsRewriting(true);
    try {
      // Corrected GoogleGenAI initialization with named apiKey parameter
      const client = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Rewrite the following marketing content to be ${tone}:
      
      "${content}"
      
      Return ONLY the rewritten text.`;
      
      const res = await client.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      
      if (res.text) setContent(res.text);
    } catch (e) {
      console.error(e);
    } finally {
      setIsRewriting(false);
    }
  };

  const handleSave = () => {
    onSave({ ...asset, title, content });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-dark-border flex justify-between items-center">
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold uppercase bg-zinc-800 text-zinc-400 px-2 py-1 rounded">{asset.metadata.channel}</span>
             <input 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="bg-transparent text-white font-bold outline-none border-b border-transparent focus:border-brand-500 w-full"
             />
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Toolbar */}
        <div className="p-2 border-b border-dark-border bg-black/20 flex gap-2">
           <button 
             onClick={() => handleRewrite('professional')}
             disabled={isRewriting}
             className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center gap-2"
           >
             <Sparkles className="w-3 h-3" /> Make Professional
           </button>
           <button 
             onClick={() => handleRewrite('witty')}
             disabled={isRewriting}
             className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center gap-2"
           >
             <Sparkles className="w-3 h-3" /> Make Witty
           </button>
           <button 
             onClick={() => handleRewrite('shorter')}
             disabled={isRewriting}
             className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded flex items-center gap-2"
           >
             <Sparkles className="w-3 h-3" /> Shorten
           </button>
        </div>

        {/* Editor */}
        <div className="flex-1 p-4 overflow-y-auto">
           {isRewriting ? (
             <div className="h-40 flex items-center justify-center text-brand-500">
                <RefreshCw className="w-8 h-8 animate-spin" />
             </div>
           ) : (
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               className="w-full h-64 bg-transparent text-zinc-300 resize-none outline-none font-sans leading-relaxed"
             />
           )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border flex justify-between items-center bg-black/20 rounded-b-xl">
           <div className="text-xs text-zinc-500">
              {content.length} characters
           </div>
           <div className="flex gap-3">
              <button onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white text-sm">Cancel</button>
              <button onClick={handleSave} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold text-sm flex items-center gap-2">
                 <Save className="w-4 h-4" /> Save Changes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
