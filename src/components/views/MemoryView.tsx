import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Filter, SortDesc, FileText, Database, BrainCircuit, Hash, Clock, X, Save, Bold, Italic, List, CheckCircle2 } from 'lucide-react';
import { DOCS } from '../../data/initial';
import { Doc } from '../../types';

export function MemoryView() {
  const [docs, setDocs] = useState<Doc[]>(DOCS);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'size'>('date');
  const [activeTimeframe, setActiveTimeframe] = useState<string>('30D');

  const [hoveredDoc, setHoveredDoc] = useState<Doc | null>(null);
  const [editingDoc, setEditingDoc] = useState<Doc | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const categories = Array.from(new Set(docs.map(doc => doc.tag)));
  const timeframes = ['1D', '7D', '30D', '90D', '360D', 'All Time'];

  const filteredAndSortedDocs = useMemo(() => {
    let result = docs;

    // Filter by category
    if (activeCategory) {
      result = result.filter(doc => doc.tag === activeCategory);
    }

    // Full-text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(doc => 
        doc.title.toLowerCase().includes(query) || 
        doc.content.toLowerCase().includes(query) ||
        doc.tag.toLowerCase().includes(query)
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'size') {
        return parseInt(b.size) - parseInt(a.size); // Basic sort for size
      } else {
        return b.date.localeCompare(a.date);
      }
    });

    return result;
  }, [docs, searchQuery, activeCategory, sortBy, activeTimeframe]);

  // Handle auto-save
  const saveDocument = () => {
    if (!editingDoc) return;
    setIsSaving(true);
    setDocs(prevDocs => prevDocs.map(doc => 
      doc.id === editingDoc.id 
        ? { ...doc, title: editTitle, content: editContent, words: editContent.split(/\s+/).filter(w => w.length > 0).length } 
        : doc
    ));
    setLastSaved(new Date());
    setTimeout(() => setIsSaving(false), 500);
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!editingDoc) return;
    const timer = setInterval(() => {
      saveDocument();
    }, 30000);
    return () => clearInterval(timer);
  }, [editingDoc, editContent, editTitle]);

  const handleOpenEditor = (doc: Doc) => {
    setEditingDoc(doc);
    setEditTitle(doc.title);
    setEditContent(doc.content);
    setLastSaved(null);
    setHoveredDoc(null);
  };

  const handleCloseEditor = () => {
    saveDocument();
    setEditingDoc(null);
  };

  return (
    <div className="h-full flex flex-col bg-bg-base overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-500 flex items-center justify-center border border-purple-500/30">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-base tracking-tight">Memory Bank</h1>
            <p className="text-sm text-text-muted mt-1">Global knowledge base and context storage</p>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input 
                type="text" 
                placeholder="Search across all documents, transcripts, and context..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-bg-subtle border border-border-base rounded-lg pl-10 pr-4 py-2 text-sm text-text-base placeholder:text-text-muted focus:outline-none focus:border-border-strong focus:ring-1 focus:ring-border-strong transition-all shadow-inner"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <select 
                value={activeCategory || ''} 
                onChange={(e) => setActiveCategory(e.target.value || null)}
                className="bg-bg-panel border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-border-strong shadow-elevation-card-rest cursor-pointer"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-bg-panel border border-border-base rounded-lg px-3 py-2 text-sm text-text-base focus:outline-none focus:border-border-strong shadow-elevation-card-rest cursor-pointer"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="size">Sort by Size</option>
              </select>
            </div>
          </div>

          {/* Timeframe Filters */}
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-text-muted mr-2" />
            <span className="text-xs font-medium text-text-muted uppercase tracking-wider mr-2">Evolving Memory:</span>
            {timeframes.map(tf => (
              <button
                key={tf}
                onClick={() => setActiveTimeframe(tf)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                  activeTimeframe === tf 
                    ? 'bg-text-base text-bg-base border-text-base shadow-elevation-card-rest' 
                    : 'bg-bg-panel text-text-muted hover:text-text-base border-border-base hover:border-border-strong'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Results */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedDocs.map(doc => (
              <div 
                key={doc.id} 
                onClick={() => handleOpenEditor(doc)}
                onMouseEnter={() => setHoveredDoc(doc)}
                onMouseLeave={() => setHoveredDoc(null)}
                className="bg-bg-panel border border-border-base rounded-xl p-5 flex flex-col gap-4 shadow-elevation-card-rest hover:shadow-elevation-card-hover hover:border-border-strong transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-subtle border border-border-base flex items-center justify-center text-text-muted group-hover:text-accent transition-colors shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-text-base line-clamp-1">{doc.title}</h3>
                      <p className="text-xs text-text-muted mt-0.5">{doc.date}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <p className="text-xs text-text-muted line-clamp-3 leading-relaxed">
                    {doc.content.replace(/#/g, '').trim()}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border-base mt-auto">
                  <div className="flex items-center gap-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Database size={12} /> {doc.size}</span>
                    <span className="flex items-center gap-1"><Hash size={12} /> {doc.words} words</span>
                  </div>
                  <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-bg-subtle border border-border-base text-text-muted">
                    {doc.tag}
                  </span>
                </div>
              </div>
            ))}

            {filteredAndSortedDocs.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-muted">
                <Search size={32} className="mb-4 opacity-20" />
                <p>No documents found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Hover Preview Side Panel */}
        {hoveredDoc && !editingDoc && (
          <div className="w-80 border-l border-border-base bg-bg-panel flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 shrink-0">
            <div className="p-6 border-b border-border-base bg-bg-subtle/50">
              <div className="flex items-center gap-2 mb-2">
                <FileText size={16} className="text-text-muted" />
                <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Quick Preview</span>
              </div>
              <h3 className="text-lg font-semibold text-text-base leading-tight">{hoveredDoc.title}</h3>
              <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                <span className="flex items-center gap-1"><Clock size={12} /> {hoveredDoc.date}</span>
                <span className="flex items-center gap-1"><Hash size={12} /> {hoveredDoc.words} words</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="prose prose-sm prose-invert max-w-none">
                <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                  {hoveredDoc.content}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-border-base bg-bg-subtle text-center">
              <p className="text-xs text-text-muted">Click card to open editor</p>
            </div>
          </div>
        )}
      </div>

      {/* Rich Text Editor Modal */}
      {editingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm p-8">
          <div className="bg-bg-panel border border-border-strong rounded-xl shadow-elevation-modal w-full max-w-5xl h-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Editor Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-base bg-bg-subtle">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-lg bg-bg-base border border-border-base flex items-center justify-center text-text-muted shrink-0">
                  <FileText size={20} />
                </div>
                <input 
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-transparent border-none text-xl font-semibold text-text-base focus:outline-none focus:ring-0 flex-1"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  {isSaving ? (
                    <span className="flex items-center gap-1 text-amber-500"><Clock size={14} className="animate-spin" /> Saving...</span>
                  ) : lastSaved ? (
                    <span className="flex items-center gap-1 text-emerald-500"><CheckCircle2 size={14} /> Saved {lastSaved.toLocaleTimeString()}</span>
                  ) : null}
                </div>
                <button 
                  onClick={saveDocument}
                  className="flex items-center gap-2 px-3 py-1.5 bg-bg-base border border-border-base rounded-md text-sm font-medium hover:bg-bg-panel transition-colors"
                >
                  <Save size={16} /> Save
                </button>
                <div className="w-px h-6 bg-border-base mx-1"></div>
                <button 
                  onClick={handleCloseEditor}
                  className="p-2 text-text-muted hover:text-text-base hover:bg-bg-base rounded-md transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="px-6 py-2 border-b border-border-base flex items-center gap-2 bg-bg-base">
              <button className="p-2 text-text-muted hover:text-text-base hover:bg-bg-subtle rounded-md transition-colors" title="Bold">
                <Bold size={16} />
              </button>
              <button className="p-2 text-text-muted hover:text-text-base hover:bg-bg-subtle rounded-md transition-colors" title="Italic">
                <Italic size={16} />
              </button>
              <div className="w-px h-4 bg-border-base mx-1"></div>
              <button className="p-2 text-text-muted hover:text-text-base hover:bg-bg-subtle rounded-md transition-colors" title="List">
                <List size={16} />
              </button>
              <div className="flex-1"></div>
              <span className="text-xs text-text-muted">
                {editContent.split(/\s+/).filter(w => w.length > 0).length} words
              </span>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-hidden relative bg-bg-base">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-full p-8 bg-transparent border-none text-text-base text-base leading-relaxed resize-none focus:outline-none focus:ring-0 custom-scrollbar"
                placeholder="Start typing..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
