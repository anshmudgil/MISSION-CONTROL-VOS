'use client';

import dynamic from 'next/dynamic';

const TasksView = dynamic(() => import('@/components/views/TasksView').then(m => ({ default: m.TasksView })), {
  ssr: false,
});

export default function TasksPage() {
  return <TasksView />;
}
