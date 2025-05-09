import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
     try {
       const result = await axios(url);
       setData(result.data);
     } catch (err) {
       setError(err);
     } finally {
       setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};