import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setLogout } from "./store/AuthSlice";

export function useIdleLogout(
  idleMinutes = 20,
  warningSeconds = 30,
  enabled = true
) {
  const dispatch = useDispatch();
  const [showWarning, setShowWarning] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);
  const warningTimer = useRef<NodeJS.Timeout | null>(null);

  const resetTimers = () => {
    if (!enabled) return;

    if (showWarning) return;

    if (idleTimer.current) clearTimeout(idleTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    setShowWarning(false);

    idleTimer.current = setTimeout(() => {
      setShowWarning(true);

      warningTimer.current = setTimeout(() => {
        dispatch(setLogout());
        setShowWarning(false);
      }, warningSeconds * 1000);
    }, idleMinutes * 60 * 1000);
  };

  const stayLoggedIn = () => {
    if (warningTimer.current) clearTimeout(warningTimer.current);

    setShowWarning(false);

    resetTimers();
  };

  useEffect(() => {
    if (!enabled) return;

    const events = ["keydown", "click"];
    events.forEach((e) => window.addEventListener(e, resetTimers));

    resetTimers();

    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimers));
      if (idleTimer.current) clearTimeout(idleTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [enabled]);

  return { showWarning, stayLoggedIn };
}
