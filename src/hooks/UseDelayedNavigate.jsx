import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export function useDelayedNavigate () {
  const navigate = useNavigate();

  const [isAwaitingNavigation, setIsAwaitingNavigation] = useState(false);

  const NavigateWithDelay = (route, delay) => {
    setIsAwaitingNavigation(true);
    setTimeout(() => navigate(route), delay);
  }

  return [isAwaitingNavigation, NavigateWithDelay];
}