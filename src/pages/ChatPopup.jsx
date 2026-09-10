import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  User,
  ArrowLeft,
  Send,
  Loader2,
  MessageCircle,
  Trash2,
} from "lucide-react"; // Added Trash2
import {
  getChatByUserOwnerAPI,
  sendMessageAPI,
  deleteChatMessageAPI, // Added Delete API
  getImgURL,
} from "../services/authService";
import { toast } from "react-toastify";

const ChatPopup = ({ show, onClose, listing, isOwner, currentId }) => {
  const chatEndRef = useRef(null);
  const [viewMode, setViewMode] = useState(isOwner ? "list" : "chat");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const ownerId = listing?.ownerId?._id || listing?.ownerId;
  const listingId = listing?._id;

  const fetchChatHistory = useCallback(async () => {
    if (!show || !listing || !currentId) return;
    try {
      let res = await getChatByUserOwnerAPI(currentId, ownerId);
      if (res && res.data) {
        setChatMessages(res.data);
      }
    } catch (err) {
      console.error("Fetch history error:", err);
    }
  }, [show, listing, currentId, ownerId]);

  useEffect(() => {
    let interval;
    if (show) {
      fetchChatHistory();
      interval = setInterval(fetchChatHistory, 4000);
    }
    return () => clearInterval(interval);
  }, [show, fetchChatHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // DELETE MESSAGE LOGIC
  const handleDelete = async (msgId) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;
    try {
      await deleteChatMessageAPI(msgId);
      setChatMessages((prev) => prev.filter((m) => m._id !== msgId));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // const handleSend = async (e) => {
  //   e.preventDefault();
  //   if (!newMessage.trim() || isSending) return;
  //   setIsSending(true);
  //   try {
  //     const payload = {
  //       senderId: currentId,
  //       receiverId: isOwner ? null : ownerId,
  //       listingId: listingId,
  //       message: newMessage.trim(),
  //     };
  //     const res = await sendMessageAPI(payload);
  //     if (res) {
  //       setNewMessage("");
  //       fetchChatHistory();
  //     }
  //   } catch (err) {
  //     toast.error("Message not sent");
  //   } finally {
  //     setIsSending(false);
  //   }
  // };
  // Inside ChatPopup.jsx handleSend function:

const handleSend = async (e) => {
  e.preventDefault();
  if (!newMessage.trim() || isSending) return;
  
  setIsSending(true);
  try {
    const payload = {
      senderId: currentId,
      // If I am NOT the owner, I am sending to the Owner.
      // If I AM the owner (viewing my own chat list), the logic changes.
      receiverId: ownerId, 
      listingId: listingId,
      message: newMessage.trim(),
    };

    const res = await sendMessageAPI(payload);
    if (res) {
      setNewMessage("");
      fetchChatHistory();
    }
  } catch (err) {
    toast.error("Message not sent. Owner's plan might have expired.");
  } finally {
    setIsSending(false);
  }
};

  if (!show) return null;

  return (
    <div
      className="position-fixed bottom-0 end-0 m-3 shadow-lg border-0 rounded-4 overflow-hidden bg-white chat-popup"
      style={{
        width: "350px",
        zIndex: 10000,
        height: "500px",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ddd",
      }}>
      {/* HEADER */}
      <div
        className="p-3 d-flex justify-content-between align-items-center text-white shadow-sm"
        style={{ backgroundColor: "#001f3f" }}>
        <div className="d-flex align-items-center gap-2">
          <div
            className="bg-white rounded-circle overflow-hidden d-flex align-items-center justify-content-center border border-2 border-white"
            style={{ width: "35px", height: "35px" }}>
            <img
              src={getImgURL(listing?.ownerId?.profileImage)}
              className="w-100 h-100 object-fit-cover"
              alt="Avatar"
              onError={(e) =>
                (e.target.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png")
              }
            />
          </div>
          <div className="text-start">
            <p className="m-0 fw-bold small leading-tight">
              {listing?.ownerId?.fullName || "Business Owner"}
            </p>
            <small className="opacity-75" style={{ fontSize: "9px" }}>
              Ask about {listing?.title}
            </small>
          </div>
        </div>
        <X className="cursor-pointer" size={20} onClick={onClose} />
      </div>

      {/* CHAT MESSAGES AREA */}
      <div
        className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2"
        style={{
          backgroundColor: "#f0f2f5",
          backgroundImage: `url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')`,
          backgroundSize: "contain",
        }}>
        <div className="text-center mb-2">
          <span
            className="badge bg-white text-muted border py-1 px-2 fw-normal"
            style={{ fontSize: "10px" }}>
            Start conversation about {listing?.title}
          </span>
        </div>

        {chatMessages.length > 0 ? (
          chatMessages.map((msg, i) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const isMe = senderId?.toString() === currentId?.toString();

            return (
              <div
                key={i}
                className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                <div
                  className={`p-2 px-3 shadow-sm position-relative ${isMe ? "bg-primary text-white" : "bg-white text-dark"}`}
                  style={{
                    maxWidth: "85%",
                    fontSize: "13px",
                    borderRadius: isMe
                      ? "15px 15px 0 15px"
                      : "15px 15px 15px 0",
                  }}>
                  {/* MESSAGE TEXT & DELETE ICON */}
                  <div className="d-flex justify-content-between gap-2">
                    <span>{msg.message}</span>
                    <Trash2
                      size={12}
                      className={`mt-1 cursor-pointer ${isMe ? "text-white-50" : "text-danger opacity-50"}`}
                      onClick={() => handleDelete(msg._id)}
                    />
                  </div>

                  <div
                    className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`}
                    style={{ fontSize: "9px" }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="m-auto text-center p-4">
            <MessageCircle size={40} className="text-muted opacity-25 mb-2" />
            <p className="text-muted small">No messages yet.</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT BAR */}
      <form
        onSubmit={handleSend}
        className="p-2 bg-light border-top d-flex gap-2 align-items-center">
        <input
          type="text"
          className="form-control form-control-sm rounded-pill px-3 border-0 shadow-none"
          placeholder="Type a message..."
          style={{ height: "38px" }}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center shadow-sm"
          style={{
            width: "38px",
            height: "38px",
            backgroundColor: "#001f3f",
            border: "none",
          }}
          disabled={isSending || !newMessage.trim()}>
          {isSending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatPopup;
