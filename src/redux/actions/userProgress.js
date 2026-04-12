export const COMPLETE_PAGE = "COMPLETE_PAGE";

export const completePage = (pageId) => ({
  type: COMPLETE_PAGE,
  payload: pageId,
});