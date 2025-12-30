import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useApiCall = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const execute = async (apiFunction) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setLoading(false);
      return { success: true, data: result };
    } catch (err) {
      // Simple error handling
      let errorMessage = "Something went wrong";

      if (!err.response) {
        errorMessage = "No internet connection";
      } else if (err.response.status === 401) {
        errorMessage = "Please login again";
        navigate("/login");
      } else if (err.response.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
      setLoading(false);
      return { success: false, error: errorMessage };
    }
  };

  return { loading, error, execute };
};
