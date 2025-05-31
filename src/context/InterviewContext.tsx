'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import { ItemType } from '@openai/realtime-api-beta/dist/lib/client.js';
import type { Problem } from '@/components/ProblemDescription';

type InterviewData = {
  items: ItemType[];
  problem: Problem | null;
  code: string;
  focusArea: string;
};

type InterviewContextType = {
  interviewData: InterviewData | null;
  setInterviewData: (data: InterviewData) => void;
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export function InterviewProvider({ children }: { children: ReactNode }) {
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);

  return (
    <InterviewContext.Provider value={{ interviewData, setInterviewData }}>
      {children}
    </InterviewContext.Provider>
  );
}

export function useInterviewContext() {
  const context = useContext(InterviewContext);
  if (context === undefined) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return context;
} 