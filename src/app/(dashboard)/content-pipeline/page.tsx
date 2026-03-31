'use client';

import dynamic from 'next/dynamic';

const ContentPipelineView = dynamic(
  () => import('@/components/views/ContentPipelineView').then(m => ({ default: m.ContentPipelineView })),
  { ssr: false }
);

export default function ContentPipelinePage() {
  return <ContentPipelineView />;
}
