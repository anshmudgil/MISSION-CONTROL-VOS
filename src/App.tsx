import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { SectionId } from './types';
import { DashboardView } from './components/views/DashboardView';
import { TasksView } from './components/views/TasksView';
import { ContentPipelineView } from './components/views/ContentPipelineView';
import { CalendarView } from './components/views/CalendarView';
import { MemoryView } from './components/views/MemoryView';
import { ContactsView } from './components/views/ContactsView';
import { AITeamView } from './components/views/AITeamView';
import { CouncilView } from './components/views/CouncilView';
import { SettingsView } from './components/views/SettingsView';

export default function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TasksView />;
      case 'content-pipeline':
        return <ContentPipelineView />;
      case 'calendar':
        return <CalendarView />;
      case 'memory':
        return <MemoryView />;
      case 'contacts':
        return <ContactsView />;
      case 'ai-team':
        return <AITeamView />;
      case 'council':
        return <CouncilView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className="flex-1 flex items-center justify-center text-text-muted">
            <div className="text-center">
              <h2 className="text-xl font-medium text-text-base mb-2 capitalize">{activeSection}</h2>
              <p>This section is under construction.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-bg-base text-text-base font-sans selection:bg-accent/30 selection:text-accent">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeSection={activeSection} onSelectSection={setActiveSection} />
        <main className="flex-1 overflow-hidden relative">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
