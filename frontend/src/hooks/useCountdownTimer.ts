import { useEffect, useState } from "react";

export default function useCountdownTimer(targetDate: Date) {

  const [seconds, setSeconds] = useState<number>(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
      setSeconds(diffInSeconds);
    }, 100);
    return () => {
      clearInterval(intervalId);
    } 

  }, [targetDate]) 
  
  return seconds;
}