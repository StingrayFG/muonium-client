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
    if (messageData.isShowing) {
      setMessageData({
        ...messageData, 
        isShowing: false
      })
      setTimeout(() => {
        setMessageData({
          message: message,
          type: type,
          isShowing: true,
          lastShown: Date.now()
        });
        if (duration !== 0) {
          setLastUsedPeriod(duration ? duration : defaultDuration);
          setTimeout(() => setShallHideMessage(true), duration ? duration : defaultDuration);
        }
      }, 300)
    } else {
      setMessageData({
        message: message,
        type: type,
        isShowing: true,
        lastShown: Date.now()
      });
      if (duration !== 0) {
        setLastUsedPeriod(duration ? duration : defaultDuration);
        setTimeout(() => setShallHideMessage(true), duration ? duration : defaultDuration);
      }
    } 
  }

  const hideMessage = () => {
    setMessageData({
      ...messageData, 
      isShowing: false
    })
  }

  useEffect(() => {
    if (shallHideMessage) {
      setShallHideMessage(false);
      if ((Date.now() - messageData.lastShown) > (lastUsedPeriod - 100)) {
        setMessageData({ ...messageData, isShowing: false });
      } 
    } 
  }, [shallHideMessage])


  return [messageData, showMessage, hideMessage];
}