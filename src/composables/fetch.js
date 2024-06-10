import axios from "axios";

export const useFetch = async ({ ruta, method = "get", data, params }) => {
  let message = null,  result = null, error = null;
  let url = `http://${window.location.hostname}:${process.env.PORT}/api/${ruta}`;

  try {
    const response = await axios({ method, data, url, params });

    if (!response.data.success) throw response.data.message;
    message = response.data.message;
    result = response.data.data;
  } catch (error) {
    error = error;
  }

  return { result, error, message };
};