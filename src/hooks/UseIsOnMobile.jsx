import { useEffect, useState } from 'react';


export function useIsOnMobile () {
  const [isOnMobile, setIsOnMobile] = useState(true);
  
  const setState = () => {
    setIsOnMobile(window.innerWidth < 768);
  }

  useEffect(() => {
    setState();
    window.addEventListener('resize', setState);
    return () => window.removeEventListener('resize', setState);
  }, [])

  return isOnMobile;
}
