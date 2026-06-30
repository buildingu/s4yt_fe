import { type NavigateFunction, type NavigateOptions, type Path, useNavigate } from "react-router-dom";

// Allows the use of useNavigate outside react components.
const history: {
  navigate: NavigateFunction | null;
  push: (page: string | Partial<Path> | -1, options?: NavigateOptions) => void;
} = {
  navigate: null,
  push: (page, options = {}) =>
    history.navigate!(page as string, {
      state: { from: window.location.pathname, ...options.state },
      ...options
    })
};
export default history;

export const HistoryProvider = () => {
  history.navigate = useNavigate();

  return null;
};
