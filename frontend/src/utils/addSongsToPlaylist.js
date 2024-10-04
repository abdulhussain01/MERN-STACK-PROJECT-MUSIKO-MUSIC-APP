import axios from "axios";
import { toast } from "react-toastify";

export const addSongToPlaylist = async (playlistId, songs) => {
  try {
    const { data } = await axios.post(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v1/playlist/addsinglesongtoplaylist`,
      {
        playlistId,
        songs,
      },
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
export const deleteSongFromPlaylist = async (playlistId, songId) => {
  try {
    const { data } = await axios.put(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/v1/playlist/deletesong`,
      {
        playlistId,
        songId,
      },
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
