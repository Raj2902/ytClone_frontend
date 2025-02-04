import { useEffect, useState } from "react";

function UseApiCall(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const respone = await fetch(url);
        const result = await respone.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);
  return { data, isLoading, error };
}
export default UseApiCall;
