import { useEffect } from "react";
import delay from "@utils/delay";

/**
 *  For deleting the user's persisted redux state when we update the state later on in development or if the user was gone for a long time,
 *  like since last year's game, so they can have the new state. This is just in case.
 */
export const useRefreshReduxPersister = () => {
  useEffect(() => {
    if (
      localStorage.getItem("persist:root") &&
      !localStorage.getItem("refreshed")
    ) {
      localStorage.removeItem("persist:root");
      localStorage.setItem("refreshed", "true");
      delay(850, () => window.location.reload());
    }
  }, []);

  return null;
}

export default useRefreshReduxPersister;