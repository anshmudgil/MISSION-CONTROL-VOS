'use client';

import React, { useState, useMemo } from 'react';
import { Search, Filter, Mail, MessageSquare, Clock, MapPin, Plus } from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  role: string;
  category: 'Internal Team' | 'Content Team' | 'External Contacts' | 'Clients';
  handle: string;
  timezone: string;
  notes?: string;
  avatar: string;
};

const MOCK_CONTACTS: Contact[] = [
  { id: '1', name: 'Henry', role: 'Chief of Staff', category: 'Internal Team', handle: '@henry_os', timezone: 'PST (UTC-8)', notes: 'Primary orchestrator', avatar: 'H' },
  { id: '2', name: 'Charlie', role: 'Infrastructure Engineer', category: 'Internal Team', handle: '@charlie_infra', timezone: 'EST (UTC-5)', notes: 'Handles local models', avatar: 'C' },
  { id: '3', name: 'Sarah Jenkins', role: 'Video Editor', category: 'Content Team', handle: 'sarah@example.com', timezone: 'GMT (UTC+0)', notes: 'Prefers async communication', avatar: 'S' },
  { id: '4', name: 'David Chen', role: 'Sponsorships', category: 'External Contacts', handle: 'david.c@agency.com', timezone: 'PST (UTC-8)', avatar: 'D' },
  { id: '5', name: 'Acme Corp', role: 'Enterprise Client', category: 'Clients', handle: 'team@acme.com', timezone: 'CST (UTC-6)', notes: 'Monthly retainer', avatar: 'A' },
];

export function ContactsView() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'role'>('name');

  const categories = ['Internal Team', 'Content Team', 'External Contacts', 'Clients'];

  const filteredAndSortedContacts = useMemo(() => {
    let result = MOCK_CONTACTS;

    if (activeCategory) {
      result = result.filter(c => c.category === activeCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) || 
        c.role.toLowerCase().includes(query) ||
        c.notes?.toLowerCase().includes(query)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return a.role.localeCompare(b.role);
    });

    return result;
  }, [searchQuery, activeCategory, sortBy]);

  return (
    <div className="h-full flex flex-col bg-bg-base overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/30">
              <MessageSquare size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-text-base tracking-tight">Contacts & CRM</h1>
              <p className="text-sm text-text-muted mt-1">Manage your network and team directory</p>
            </div>
          </div>
          <button className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors shadow-elevation-card-rest">
            <Plus size={16} /> Add Contact
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input 
              type="text" 
              placeholder="Search contacts by name, role, or notes..." 
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
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedContacts.map(contact => (
            <div key={contact.id} className="bg-bg-panel border border-border-base rounded-xl p-5 flex flex-col shadow-elevation-card-rest hover:shadow-elevation-card-hover hover:border-border-strong transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bg-subtle border border-border-base flex items-center justify-center text-text-base font-medium">
                    {contact.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-base">{contact.name}</h3>
                    <p className="text-xs text-text-muted">{contact.role}</p>
                  </div>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded-md bg-bg-subtle border border-border-base text-text-muted">
                  {contact.category}
                </span>
              </div>
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Mail size={14} className="text-text-muted" />
                  <span>{contact.handle}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-muted">
                  <Clock size={14} className="text-text-muted" />
                  <span>{contact.timezone}</span>
                </div>
                {contact.notes && (
                  <div className="mt-4 pt-4 border-t border-border-base">
                    <p className="text-xs text-text-muted line-clamp-2 italic">"{contact.notes}"</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredAndSortedContacts.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-text-muted">
              <Search size={32} className="mb-4 opacity-20" />
              <p>No contacts found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
