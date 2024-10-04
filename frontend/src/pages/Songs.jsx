import { useEffect, useRef, useState } from "react";
import Container from "../components/subcomponents/Container";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentIndex,
  setCurrentPlaylist,
  setCurrentSong,
  setIsPlayerActive,
} from "../store/slices/player.slice";

import { CirclePlay, EllipsisVertical } from "lucide-react";
import { converDuration } from "../utils/durationconvertor";
import { decode } from "html-entities";
import Modal from "../components/subcomponents/Modal"

const Songs = () => {
  const [songInfo, setSongInfo] = useState();

  const [optionsMenu, setOptionsMenu] = useState("");
  const [allPlaylists, setAllPlaylists] = useState("");

  const { id } = useParams();

  const { isplayerActive, currentSong } = useSelector((state) => state.player);
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchsong = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_MUSIC_API}/songs?id=${id}`
      );

      setSongInfo(data.data);
    };

    fetchsong();
  }, [id, dispatch]);

  const contentBoxRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contentBoxRef.current &&
        !contentBoxRef.current.contains(event.target)
      ) {
        setOptionsMenu("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOptionsMenu]);

  const handlePlaySong = (index, item) => {
   
    dispatch(setCurrentSong(item));
    dispatch(setCurrentIndex(index));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentPlaylist({songs:songInfo}));
  };

  const handleCurrentSong = (index, item) => {
    dispatch(setCurrentSong(item));
    !isplayerActive && dispatch(setIsPlayerActive());
    dispatch(setCurrentIndex(index));
    currentSong.id !== id && dispatch(setCurrentPlaylist({songs:songInfo}));
  };

  if (!songInfo) {
    return <h1>Loaing</h1>;
  }


  return (
    <Container>
      <div className=" flex flex-col items-center gap-8 md:flex-row min-w-64">
        <img
          src={songInfo[0]?.image && songInfo[0]?.image[2]?.link}
          alt=""
          className="w-[20rem] h-auto rounded-full"
        />

        <div className="text-center md:text-start">
          <h1 className="text-2xl md:text-4xl font-bold mb-3">
            {decode(songInfo[0]?.name)}
          </h1>
          <p className="text-xl mb-3">Released On: {songInfo[0]?.releaseDate}</p>

          <button
            onClick={() => {
              handlePlaySong(0, songInfo[0]);
            }}
            className="border px-4 py-2 rounded-lg bg-commonbackgroundtwo hover:text-primary hover:border-primary  text-lg flex items-center justify-center gap-3 w-32"
          >
            Play <CirclePlay size={20} />
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl md:text-4xl font-bold ">All Songs</h2>
        <div className="flex flex-col gap-5">
          {songInfo?.map((item, index) => (
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
              {/* {optionsMenu === item.id && (
                <div className="absolute right-8 -top-5  " ref={contentBoxRef}>
                  <div className=" bg-commonbackgroundtwo rounded-lg border border-black text-center">
                    <h3 className="text-lg font-bold border-b-2 border-commonbackground">
                      Options
                    </h3>
                    <div className="flex flex-col ">
                      {item.song && (
                        <Link
                          onClick={() => {}}
                          to={`/song/${item.song.id}`}
                          className="hover:bg-commonbackground  px-4 py-2"
                        >
                          Go to song
                        </Link>
                      )}
                      <button className="hover:bg-commonbackground px-4 py-2 rounded-b-lg">
                        Add to Playlist
                      </button>
                    </div>
                  </div>
                </div>
              )} */}

              <Modal
                song={item}
                optionsMenu={optionsMenu}
                songId={item.id}
                albumId={item.album.id}
                setOptionsMenu={setOptionsMenu}
                allPlaylists={allPlaylists}
                setAllPlaylists={setAllPlaylists}
                user={user}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default Songs;
