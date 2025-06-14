import React, { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function checkTime(i: number): string {
    if (i < 10) {
      return "0" + i.toString();
    }
    return i.toString();
  }

  const h = time.getHours();
  const m = checkTime(time.getMinutes());
  const s = checkTime(time.getSeconds());

  return (
    <div style={{ fontSize: '2rem', fontFamily: 'monospace', textAlign: 'center' }} className="h-fit bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
      {h}:{m}:{s}
    </div>
  );
}