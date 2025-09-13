import { useContext } from 'react';
import { TimeTrackerContext } from '../context/TimeTrackerContext';

export const useTimeTracker = () => {
  const context = useContext(TimeTrackerContext);
  if (context === undefined) {
    throw new Error('useTimeTracker must be used within a TimeTrackerProvider');
  }
  return context;
};
