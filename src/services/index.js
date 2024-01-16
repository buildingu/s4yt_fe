import { store } from "@root/store";

const headers = (token) => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  return headers;
};

const sendRequest = async (method, url, params, body) => {
  const apiUrl = params
      ? `${process.env.REACT_APP_API_BASE_URL}${url}?${new URLSearchParams(
          params
        ).toString()}`
      : `${process.env.REACT_APP_API_BASE_URL}${url}`,
    token = store.getState().user.token;

  const response = await fetch(apiUrl, {
    method,
    headers: headers(token),
    ...(body && { body: JSON.stringify(body) }),
  });

  return await response.json();
};

export const Api = {
  get: (url, params) => sendRequest("GET", url, params),
  post: (url, body) => sendRequest("POST", url, null, body),
};
