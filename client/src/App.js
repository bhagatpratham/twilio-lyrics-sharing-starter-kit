import { useState } from "react";
import "./App.css";

function App() {
  const [lyrics, setLyrics] = useState(null);
  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [copied, setCopied] = useState(false);
  const [number, setNumber] = useState("");

  const getTrack = (e) => {
    setTrackName(e.target.value);
  };

  const getArtist = (e) => {
    setArtistName(e.target.value);
  };

  const handleClick = async () => {
    if (trackName.trim() === "") {
      console.error("Track name can't be empty!");
    } else {
      const res = await fetch(
        `https://lyrist.vercel.app/api/${trackName}/${artistName}`
      );
      if (res.ok) {
        const data = await res.json();
        setLyrics(data);
      } else {
        res.error("Lyrics not found!");
      }
    }
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(lyrics?.lyrics || "")
      .then(() => {
        setCopied(true);
      })
      .catch(() => {
        console.error("Couldn't Copy!");
      });
  };

  const shareLyrics = async (lyrics, number) => {
    if (lyrics && number.trim() !== "") {
      if (lyrics.length > 1600) {
        console.error("Lyrics exceed 1600 characters!");
        alert("Lyrics exceed 1600 characters!");
        return false;
      }
      try {
        const smsRes = await fetch("http://localhost:3000/send-lyrics", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            lyrics: lyrics,
            toNumber: number,
          }),
        });
        if (smsRes.ok) {
          console.log("Lyrics shared successfully!");
          alert("Lyrics shared successfully!");
          return true;
        } else {
          console.error("Error sharing lyrics!");
          alert("Error sharing lyrics!");
        }
      } catch (err) {
        console.error("Error sharing lyrics:", err);
      }
    }
    return false;
  };

  return (
    <div className="App">
      <section className="logo">
        <h2>Lyrics Sharing App</h2>
        <p className="app-desc">
          a simple and easy to use app to share song lyrics with your friends
        </p>
      </section>
      <section className="main-body">
        <div className="search-lyrics">
          <input placeholder="Enter track name" onChange={getTrack}></input>
          <div className="search-container">
            <input
              placeholder="Enter artist name (optional)"
              onChange={getArtist}
            ></input>
            <button className="search-btn" onClick={handleClick}>
              Search Lyrics
            </button>
          </div>
        </div>
        <div className="lyrics">
          <button className="copy-lyrics" onClick={handleCopy}>
            Copy Lyrics
          </button>
          <p className="display-lyrics">
            {lyrics?.lyrics || "Nothing here yet ..."}
          </p>
        </div>
        <div className="send-lyrics">
          <label htmlFor="to">To:</label>
          <input
            className="phone-number-input"
            type="tel"
            name="to"
            id="to"
            placeholder="Enter phone number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
          />{" "}
          <button
            className="share-lyrics"
            onClick={() => shareLyrics(lyrics?.lyrics, number)}
          >
            Share Lyrics
          </button>
        </div>
        <p>Note: Lyrics should not exceed 1600 characters</p>
      </section>
    </div>
  );
}

export default App;
