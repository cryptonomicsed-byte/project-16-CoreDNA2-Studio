import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../store';
import { DNAHelix } from '../components/DNAHelix';
import { Dna, ArrowLeft } from 'lucide-react';

const SharedProfilePage = () => {
  const { id } = useParams();
  const { brands } = useStore();
  const brand = brands.find(b => b.id === id);

  if (!brand) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
         <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Profile Not Found</h1>
            <p className="text-zinc-500 mb-6">The brand profile you are looking for does not exist or is private.</p>
            <Link to="/" className="text-brand-500 hover:underline">Return Home</Link>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg text-zinc-100 p-8">
       <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-900/20 rounded-xl flex items-center justify-center border border-brand-500/30">
                   <Dna className="w-6 h-6 text-brand-500" />
                </div>
                <div>
                   <h1 className="text-2xl font-bold text-white">{brand.name}</h1>
                   <p className="text-sm text-zinc-500">Shared Brand Intelligence Profile</p>
                </div>
             </div>
             
             <Link to="/" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-bold flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Console
             </Link>
          </div>

          <div className="bg-dark-surface/50 p-1 rounded-2xl border border-dark-border shadow-2xl">
             <DNAHelix dna={brand} />
          </div>

          <div className="mt-8 text-center text-zinc-600 text-xs">
             Powered by CoreDNA2 Enterprise Intelligence
          </div>
       </div>
    </div>
  );
};

export default SharedProfilePage;