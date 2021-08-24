import { useState, useCallback, useRef, useEffect } from "react";

export const useHttpClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequest = useRef([]);

  const sendRequest = useCallback(async (url, method = "GET", body = null, headers = {}) => {
    setLoading(true);
    const httpAbortCtrl = new AbortController();
    activeHttpRequest.current.push(httpAbortCtrl);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body,
        signal: httpAbortCtrl.signal,
      });

      const responseData = await response.json();

      activeHttpRequest.current = activeHttpRequest.current.filter(
        (reqCtrl) => reqCtrl !== httpAbortCtrl
      );

      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setLoading(false);
      return responseData;
    } catch (error) {
      setError(error.message);
      setLoading(false);
      throw error;
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequest.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  return { loading, error, sendRequest, clearError };
};
