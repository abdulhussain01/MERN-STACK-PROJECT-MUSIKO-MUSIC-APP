import axios from "axios";
import { toast } from "react-toastify";

export const addSongsToFavourite = async (item) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/addtofavourite`,
      { song: item },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
    }
  } catch (err) {
    toast.error(err.response.data.message);
  }
};
