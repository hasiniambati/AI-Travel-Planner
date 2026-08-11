import { useState } from "react";
import "./Assistant.css";

function Assistant() {

  const [open, setOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hi! I am your AI Travel Assistant 🤖. How can I help you plan your trip?"
    }
  ]);


  const sendMessage = () => {

    if (message.trim() === "") return;


    const userMessage = {
      sender: "user",
      text: message
    };


    setMessages(prev => [
      ...prev,
      userMessage
    ]);


    setMessage("");


    // Show typing animation
    setMessages(prev => [
      ...prev,
      {
        sender: "ai",
        text: "typing"
      }
    ]);


    // Temporary AI response
    setTimeout(() => {


      setMessages(prev =>
        prev.filter(msg => msg.text !== "typing")
      );


      const aiMessage = {

        sender: "ai",

        text: "I can help you with destinations, hotels, itineraries, weather updates, and travel suggestions 🌍"

      };


      setMessages(prev => [
        ...prev,
        aiMessage
      ]);


    }, 1500);

  };


  return (

    <div className="assistant-container">


      {open && (

        <div className="chat-box">


          <div className="chat-header">

            <h3>
              AI Travel Assistant 🤖
            </h3>


            <button 
              onClick={() => setOpen(false)}
            >
              ✕
            </button>

          </div>



          <div className="chat-body">


            {messages.map((msg, index) => (

              <div

                key={index}

                className={
                  msg.text === "typing"
                    ? "ai-message typing"
                    : msg.sender === "ai"
                    ? "ai-message"
                    : "user-message"
                }

              >

                {
                  msg.text === "typing"

                  ?

                  <>
                    <span></span>
                    <span></span>
                    <span></span>
                  </>

                  :

                  msg.text
                }


              </div>

            ))}


          </div>




          <div className="chat-input">


            <input

              type="text"

              placeholder="Ask about your trip..."

              value={message}

              onChange={(e) => setMessage(e.target.value)}

              onKeyDown={(e) => {

                if(e.key === "Enter") {

                  sendMessage();

                }

              }}

            />



            <button onClick={sendMessage}>
              ➤
            </button>


          </div>



        </div>

      )}





      <button

        className="assistant-button"

        onClick={() => setOpen(!open)}

      >

        🤖

      </button>


    </div>

  );

}


export default Assistant;