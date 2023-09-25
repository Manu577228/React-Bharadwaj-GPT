import { useEffect, useState } from "react";
import "./index.css";

function App() {
  const [value, setValue] = useState(null);
  const [message, setMessage] = useState(null);
  const [prevChats, setPrevChats] = useState([]);
  const [currTitle, setCurrentTitle] = useState(null);

  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle);
  };

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      const data = await response.json();
      setMessage(data.choices[0].message);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!currTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currTitle && value && message) {
      setPrevChats((prevChats) => [
        ...prevChats,
        {
          title: currTitle,
          role: "user",
          content: value,
        },
        {
          title: currTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currTitle]);

  const currChat = prevChats.filter(
    (prevChats) => prevChats.title === currTitle
  );

  const uniqueTitles = Array.from(
    new Set(prevChats.map((prevChat) => prevChat.title))
  );
  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>
              {uniqueTitle}
            </li>
          ))}
        </ul>
        <nav>
          <p>Made by Bharadwaj</p>
        </nav>
      </section>
      <section className="main">
        {!currTitle && <h1>BharadwajGPT</h1>}
        <ul className="feed">
          {currChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)} />
            <div id="submit" onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className="info">
            Bharadwaj GPT Mar 14 Version. Free Research Preview. Our goal is to
            make AI systems more natural and safe to interact with. Your
            feedback will help us improve.
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
