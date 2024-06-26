import React, { useState, useRef, useEffect } from "react";

const MediaPlayer = () => {
  const baseUrl = "https://playground.4geeks.com";
  const [tracks, setTracks] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durations, setDurations] = useState([]);
  const audioElement = useRef(null);

  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    try {
      const response = await fetch("https://playground.4geeks.com/sound/songs");
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      setTracks(data.songs);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    const fetchDurations = async () => {
      const durationPromises = tracks.map((track) => {
        return new Promise((resolve) => {
          const audio = new Audio(`${baseUrl}${track.url}`);
          audio.onloadedmetadata = () => {
            resolve(audio.duration);
          };
        });
      });

      const durations = await Promise.all(durationPromises);
      setDurations(durations);
    };

    if (tracks.length > 0) {
      fetchDurations();
    }
  }, [tracks]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioElement.current.pause();
    } else {
      audioElement.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    setTimeout(() => {
      audioElement.current.play();
      setIsPlaying(true);
    }, 0);
  };

  const handlePrevious = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    setCurrentTrackIndex(prevIndex);
    setTimeout(() => {
      audioElement.current.play();
      setIsPlaying(true);
    }, 0);
  };

  const formatDuration = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="player-container">
      <ul className="track-list">
        {tracks.map((track, index) => (
          <li
            key={track.id}
            className={index === currentTrackIndex ? "current" : ""}
            onClick={() => {
              setCurrentTrackIndex(index);
              audioElement.current.play();
              setIsPlaying(true);
            }}
            onMouseEnter={(e) => e.currentTarget.classList.add('hover')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hover')}
          >
            {index + 1}. {track.name}{" "}
            <span className="duration">
              {durations[index] ? formatDuration(durations[index]) : "Loading..."}
            </span>
          </li>
        ))}
      </ul>
      <div className="controls">
        <button onClick={handlePrevious}>&#9664;</button>
        <button onClick={handlePlayPause}>{isPlaying ? "Pause" : "Play"}</button>
        <button onClick={handleNext}>&#9654;</button>
      </div>
      {tracks.length > 0 && (
        <audio
          ref={audioElement}
          src={`${baseUrl}${tracks[currentTrackIndex].url}`}
          onEnded={handleNext}
        ></audio>
      )}
    </div>
  );
};

export default MediaPlayer;