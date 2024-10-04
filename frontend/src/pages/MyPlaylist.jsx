import { useEffect, useState } from "react";
import Container from "../components/subcomponents/Container";
import axios from "axios";
import { decode } from "html-entities";
import { converDuration } from "../utils/durationconvertor";
import { EllipsisVertical } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";
import { toast } from "react-toastify";
import { fetchUser } from "../store/slices/user.slice";
import { deleteSongFromPlaylist } from "../utils/addSongsToPlaylist";

const MyPlaylist = () => {
  const [playlistInfo, setPlaylistInfo] = useState();
  const [optionsMenu, setOptionsMenu] = useState("");
  const navigateTo = useNavigate();

  const { id } = useParams();

  const { isplayerActive, currentSong } = useSelector((state) => state.player);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/playlist/getall`,
        { playlistId: id },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setPlaylistInfo(data?.playlist);
    };

    fetchData();
  }, [id]);

  const handleCurrentSong = (index, item) => {
    dispatch(setCurrentSong(item));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentIndex(index));
    dispatch(setCurrentPlaylist({ songs: playlistInfo?.songs }));
  };

  const handleDeletePlaylist = async () => {
    try {
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/v1/playlist/deleteplaylist/${id}`,
        {
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.success);
        dispatch(fetchUser());
        navigateTo("/");
      }
    } catch (err) {
   
      toast.error(err.response.data.message);
    }
  };

  const handleDeleteSongFromPlaylist = async (songId) => {
    deleteSongFromPlaylist(id, songId);
   
    setPlaylistInfo((prev) => {
      return {
        ...prev,
        songs: prev.songs.filter((song) => song.id !== songId),
      };
    });
  };

  return (
    <Container>
      <div className=" flex flex-col gap-8 border-b">
        {/* <img
      src={playlistInfo?.image[2]?.link}
      alt=""
      className="w-[20rem] h-auto rounded-full"
    /> */}

        <div className="">
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {playlistInfo?.name}
          </h1>

          <div className="flex mb-5 justify-between items-center w-full">
            <p className="text-xl ">
              Total Songs: {playlistInfo?.songs?.length || 0}
            </p>
            <button
              className="border px-4 py-2 rounded-lg bg-commonbackgroundtwo hover:text-red-500 hover:border-red-500  text-lg flex items-center justify-center gap-3 w-32 "
              onClick={handleDeletePlaylist}
            >
              delete
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-4xl font-bold ">All Songs</h2>
        {playlistInfo ? (
          <div className="flex flex-col gap-5">
            {playlistInfo.songs?.map((item, index) => (
              <div
                className={` grid grid-cols-3  content-between border-b-2 py-2 relative ${
                  currentSong.id === item.id ? "text-primary" : ""
                } `}
                key={item.id}
              >
                <button
                  className="col-start-1 col-end-3 flex gap-4 items-center w-full"
                  onClick={() => {
                    handleCurrentSong(index, item);
                  }}
                >
                  <div
                    className="w-[75px] h-[75px] relative"
                    style={{ minWidth: "80px" }}
                  >
                    <img
                      src={item?.image[1]?.link}
                      alt=""
                      className="absolute w-full h-full object-cover left-0 top-0 rounded-lg"
                      style={{ minWidth: "80px" }} // Ensure the image keeps its width
                    />
                  </div>
                  <div className="text-start">
                    <h3 className="sm:text-xl font-bold line-clamp-1 text-wrap ">
                      {decode(item?.name)}
                    </h3>
                    <p className="text-sm line-clamp-1 overflow-x-clip max-w-72 lg:max-w-full">
                      {item?.primaryArtists}
                    </p>
                  </div>
                </button>
                <div className="col-start-3  flex sm:gap-5 justify-end items-center">
                  <div className="">
                    <p>{converDuration(item.duration)}</p>
                  </div>
                  <button
                    className="p-2 "
                    onClick={() => setOptionsMenu(item.id)}
                  >
                    <EllipsisVertical />
                  </button>
                </div>
                {optionsMenu === item.id && (
                  <div
                    className="absolute right-8 -top-5  "
                    // ref={contentBoxRef}
                  >
                    <div className=" bg-commonbackgroundtwo rounded-lg border border-black text-center">
                      <h3 className="text-lg font-bold border-b-2 border-commonbackground">
                        Options
                      </h3>
                      <div className="flex flex-col ">
                        {item.favourite && (
                          <Link
                            onClick={() => {}}
                            to={`/favourite/${item.favourite.id}`}
                            className="hover:bg-commonbackground  px-4 py-2"
                          >
                            Go to favourite
                          </Link>
                        )}
                        <button
                          onClick={() => handleDeleteSongFromPlaylist(item.id)}
                          className="hover:bg-commonbackground px-4 py-2 rounded-b-lg"
                        >
                          Remove This Song
                        </button>
                        <button className="hover:bg-commonbackground px-4 py-2 rounded-b-lg">
                          Add to Playlist
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className=" text-center text-xl">Your Playlist Is Empty </div>
        )}
      </div>
    </Container>
  );
};

export default MyPlaylist;
