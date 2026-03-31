'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MoreHorizontal, X, Tag, AlignLeft } from 'lucide-react';
import { CALENDAR_EVENTS } from '@/data/initial';
import { CalendarEvent } from '@/types';

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDay = (day: number) => {
    const today = new Date().getDate();
    const relativeDay = day - today;
    
    return CALENDAR_EVENTS.filter(event => {
      if (relativeDay === 0 && event.day === 0) return true;
      if (relativeDay === 1 && event.day === 1) return true;
      if (relativeDay === 2 && event.day === 2) return true;
      
      // Distribute some events randomly for visual effect
      if (day % 7 === event.day) return true;
      
      return false;
    }).slice(0, 3); // Max 3 events per day for UI
  };

  return (
    <div className="h-full flex flex-col bg-bg-base overflow-hidden relative">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-base bg-bg-panel/50 backdrop-blur-sm shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-text-base tracking-tight">Calendar</h1>
            <p className="text-sm text-text-muted mt-1">Scheduled tasks and OpenClaw jobs</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-bg-subtle border border-border-base rounded-lg p-1 shadow-elevation-card-rest">
            <button onClick={prevMonth} className="p-1.5 hover:bg-bg-panel rounded-md text-text-muted hover:text-text-base transition-colors">
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-text-base min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={nextMonth} className="p-1.5 hover:bg-bg-panel rounded-md text-text-muted hover:text-text-base transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
          <button onClick={goToToday} className="bg-bg-panel border border-border-base hover:border-border-strong text-text-base px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-elevation-card-rest">
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="bg-bg-panel border border-border-base rounded-xl shadow-elevation-card-rest overflow-hidden">
          {/* Days of week */}
          <div className="grid grid-cols-7 border-b border-border-base bg-bg-subtle">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-center text-xs font-semibold text-text-muted uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 auto-rows-[120px]">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="border-r border-b border-border-base bg-bg-base/50 p-2" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              const dayEvents = getEventsForDay(day);

              return (
                <div key={day} className={`border-r border-b border-border-base p-2 flex flex-col gap-1 transition-colors hover:bg-bg-subtle/50 ${isToday ? 'bg-accent/5' : ''}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-accent text-white' : 'text-text-muted'}`}>
                      {day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-medium text-text-muted bg-bg-subtle px-1.5 py-0.5 rounded border border-border-base">
                        {dayEvents.length} jobs
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 pr-1">
                    {dayEvents.map(event => (
                      <div 
                        key={event.id} 
                        onClick={() => setSelectedEvent(event)}
                        className={`text-[10px] px-2 py-1.5 rounded border bg-bg-base truncate flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity ${event.color}`}
                        title={event.title}
                      >
                        <Clock size={10} className="shrink-0 opacity-70" />
                        <span className="truncate font-medium">{event.time} - {event.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Empty cells after last day */}
            {Array.from({ length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7 }).map((_, i) => (
              <div key={`empty-end-${i}`} className="border-r border-b border-border-base bg-bg-base/50 p-2" />
            ))}
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-bg-base/80 backdrop-blur-sm p-4">
          <div className="bg-bg-panel border border-border-strong rounded-xl shadow-elevation-dialog w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border-base">
              <h2 className="text-lg font-semibold text-text-base">Event Details</h2>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="text-text-muted hover:text-text-base transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-text-base mb-2">{selectedEvent.title}</h3>
                <div className="flex items-center gap-2 text-sm text-text-muted">
                  <Clock size={16} />
                  <span>{selectedEvent.time}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Tag size={16} className="text-text-muted" />
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${selectedEvent.color}`}>
                  {selectedEvent.type}
                </span>
              </div>

              {selectedEvent.description && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-text-base">
                    <AlignLeft size={16} className="text-text-muted" />
                    Description
                  </div>
                  <p className="text-sm text-text-muted leading-relaxed pl-6">
                    {selectedEvent.description}
                  </p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-border-base bg-bg-subtle flex justify-end">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 bg-bg-base border border-border-base rounded-md text-sm font-medium text-text-base hover:bg-bg-panel transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
