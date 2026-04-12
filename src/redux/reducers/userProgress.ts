const COMPLETE_PAGE = "COMPLETE_PAGE";

interface UserProgressState {
  completedPages: string[];
}

const initialState: UserProgressState = {
  completedPages: [],
};

export default function userProgressReducer(
  state = initialState,
  action: { type: string; payload?: string }
): UserProgressState {
  switch (action.type) {
    case COMPLETE_PAGE:
      if (state.completedPages.includes(action.payload!)) return state;
      return {
        ...state,
        completedPages: [...state.completedPages, action.payload!],
      };
    default:
      return state;
  }
}