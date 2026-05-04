import React, { useContext, useState, useRef, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { LocationContext } from "../App";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function ChatBox() {
  const { location, token } = useContext(LocationContext);
  const { state, dispatch } = useContext(AppContext);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null); 

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load chat history from state
    if (state.chatHistory.length > 0) {
      setMessages(state.chatHistory);
    }
    scrollToBottom();
  }, [state.chatHistory]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); 

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);

    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, location }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
              text: data.summary || data.response || JSON.stringify(data) || "No response from server",
          buttons: data.interaction_buttons || [],
          citations: data.citations || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Server error. Please try again.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <h2 style={styles.title}>AI Election Assistant</h2>

      {/* Messages */}
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.msgRow,
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.msg,
                background:
                  msg.role === "user" ? "#4f46e5" : "#ffffff",
                color: msg.role === "user" ? "white" : "#111",
              }}
            >
{typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text)}

              {/* Buttons */}
              {msg.buttons?.length > 0 && (
                <div style={styles.btnRow}>
                  {msg.buttons.map((b, idx) => (
                    <button
                      key={idx}
                      style={styles.smallBtn}
                      onClick={() => setInput(b.label)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Citations */}
              {msg.citations?.length > 0 && (
                <div style={styles.citeBox}>
                  {msg.citations.map((c, idx) => (
                    <a
                      key={idx}
                      href={c}
                      target="_blank"
                      rel="noreferrer"
                      style={styles.link}
                    >
                      {c.slice(0, 35)}...
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Loader */}
      {loading && (
        <div style={styles.loader}>
          <div style={styles.dot}></div>
          <div style={styles.dot}></div>
          <div style={styles.dot}></div>
        </div>
      )}

      {/* Input */}
      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
          placeholder="Ask about elections..."
          style={styles.input}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={styles.sendBtn}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatBox;

/* ================= INLINE CSS ================= */

const styles = {
  wrapper: {
    height: "70vh",
    maxWidth: "900px",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    background: "#f9fafb",
    borderRadius: "20px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "10px",
    color: "#4f46e5",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "10px",
    background: "#fff",
    borderRadius: "15px",
  },

  msgRow: {
    display: "flex",
    marginBottom: "10px",
  },

  msg: {
    maxWidth: "70%",
    padding: "12px",
    borderRadius: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    whiteSpace: "pre-wrap",
  },

  inputBox: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
  },

  sendBtn: {
    padding: "12px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  btnRow: {
    marginTop: "8px",
    display: "flex",
    gap: "5px",
    flexWrap: "wrap",
  },

  smallBtn: {
    fontSize: "12px",
    padding: "5px 10px",
    background: "#e5e7eb",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  citeBox: {
    marginTop: "5px",
    fontSize: "12px",
  },

  link: {
    display: "block",
    color: "#4f46e5",
    textDecoration: "underline",
  },

  loader: {
    display: "flex",
    gap: "5px",
    marginTop: "10px",
  },

  dot: {
    width: "8px",
    height: "8px",
    background: "#4f46e5",
    borderRadius: "50%",
    animation: "bounce 1s infinite",
  },
};