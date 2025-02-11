import { useState, useEffect } from 'react';

export function useMessageHandler (defaultDuration = 1500) {

  const [messageData, setMessageData] = useState({
    message: '',
    type: undefined,
    isShowing: false,
    lastShown: 0
  });
  const [shallHideMessage, setShallHideMessage] = useState(false);
  const [lastUsedPeriod, setLastUsedPeriod] = useState(0);

  const showMessage = (message, type, duration) => {
    setMessageData({
      message: message,
      type: type,
      isShowing: true,
      lastShown: Date.now()
    });
    setLastUsedPeriod(duration ? duration : defaultDuration);
    setTimeout(() => setShallHideMessage(true), duration ? duration : defaultDuration);
  }

  useEffect(() => {
    if ((shallHideMessage) && ((Date.now() - messageData.lastShown) > lastUsedPeriod)) {
      setMessageData({ ...messageData, isShowing: false });
      setShallHideMessage(false);
    } 
  }, [shallHideMessage])


  return [messageData, showMessage];
}