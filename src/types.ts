export type SectionId = 'dashboard' | 'tasks' | 'content-pipeline' | 'ai-team' | 'council' | 'calendar' | 'memory' | 'contacts' | 'settings';

export type Comment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

export type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string;
  assignee: { name: string; initial: string; color: string };
  tag: { label: string; color: string };
  timeAgo: string;
  project?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  comments?: Comment[];
};

export type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  time: string;
  color: string;
  type: 'Velocity OS' | 'Content' | 'Agency' | 'Automations';
  description?: string;
};

export type Project = {
  id: string;
  title: string;
  status: 'Active' | 'Planning';
  description: string;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  assignee: { name: string; initial: string; color: string };
  priority: 'high' | 'medium' | 'low';
  timeAgo: string;
};

export type Doc = {
  id: string;
  title: string;
  date: string;
  tag: string;
  size: string;
  words: number;
  content: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  description: string;
  tags: string[];
  avatar: string;
};
