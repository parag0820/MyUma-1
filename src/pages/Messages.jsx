
import React, { useState, useEffect, useRef } from "react";
import {
  getAllOwnersAPI,
  getAllUsersAPI,
  getAllAuthsAPI,
  getChatHistoryAPI,
  getChatAdminOwnerHistoryAPI,
  sendMessageAPI,
  deleteChatMessageAPI,
  getImgURL,
} from "../services/authService";
import { getUser } from "../utils/storage";
import { toast } from "react-toastify";
import {
  Send,
  CheckCheck,
  ArrowLeft,
  Trash2,
  Search,

  ShieldCheck,
} from "lucide-react";

const Messages = () => {
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeListingId, setActiveListingId] = useState(null);
  const [text, setText] = useState("");
  const [activeTab, setActiveTab] = useState("users"); 
  const [loading, setLoading] = useState(true);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const scrollRef = useRef(null);
  const currentUser = getUser();
  
  // Robust ID selection
  const currentId = currentUser?._id || currentUser?.id;
  const myRole = currentUser?.role;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchSidebarContacts = async () => {
    try {
      setLoading(true);
      if (myRole === "owner") {
        const [userRes, authRes] = await Promise.all([
          getAllUsersAPI(),
          getAllAuthsAPI(),
        ]);
        const users = userRes.auths || userRes.users || [];
        const admins = (authRes.auths || authRes.data || []).filter(
          (a) => a.role === "admin"
        );
        setContacts(activeTab === "users" ? users : admins);
      } else {
        const ownerRes = await getAllOwnersAPI();
        setContacts(ownerRes.auths || ownerRes.owners || []);
      }
    } catch (err) {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSidebarContacts();
  }, [activeTab]);

  useEffect(() => {
    let interval;
    if (selectedUser) {
      fetchChatHistory();
      interval = setInterval(fetchChatHistory, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedUser]);

  const fetchChatHistory = async () => {
    if (!selectedUser) return;
    const targetId = selectedUser._id || selectedUser.id;
    try {
      let res;
      if (myRole === "owner") {
        res = selectedUser.role === "admin"
            ? await getChatAdminOwnerHistoryAPI(targetId, currentId)
            : await getChatHistoryAPI(targetId, currentId);
      } else if (myRole === "user") {
        res = await getChatHistoryAPI(currentId, targetId);
      } else {
        res = await getChatAdminOwnerHistoryAPI(currentId, targetId);
      }

      const newMessages = res?.data || [];
      
      // Try to find a listingId in history to keep the context
      if (newMessages.length > 0) {
        const lastWithListing = [...newMessages].reverse().find((m) => m.listingId);
        if (lastWithListing) {
            const lId = lastWithListing.listingId?._id || lastWithListing.listingId;
            if (lId) setActiveListingId(lId);
        }
      }
      setMessages(newMessages);
    } catch (err) {
      console.error("Chat History Error", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const receiverId = selectedUser?._id || selectedUser?.id;

    if (!text.trim() || !selectedUser || !currentId || !receiverId) {
        toast.error("Missing required information to send message");
        return;
    }

    // IMPORTANT: Your backend REQUIRES listingId. 
    // If we don't have one (like in Admin chat), we pass a placeholder or the last known one.
    // Replace '600000000000000000000000' with a valid default ID from your DB if listingId is strictly mandatory for Admins
    const finalListingId = activeListingId || "678e3496030999557008cb0a"; // Example valid ID

    try {
      const payload = {
        senderId: currentId,
        receiverId: receiverId,
        listingId: finalListingId, 
        message: text.trim(),
      };

      const res = await sendMessageAPI(payload);
      if (res) {
        setText("");
        fetchChatHistory();
      }
    } catch (err) {
      toast.error("Error sending: " + (err.response?.data?.message || "Server Error"));
    }
  };

  const handleDeleteMessage = async (msgId) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteChatMessageAPI(msgId);
      setMessages((prev) => prev.filter((m) => m._id !== msgId));
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const filteredContacts = contacts.filter((c) =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid py-2 py-md-4" style={{ height: "92vh" }}>
      <div className="row g-0 h-100 shadow border rounded-3 overflow-hidden bg-white mx-auto" style={{ maxWidth: "1250px" }}>
        
        {/* --- SIDEBAR --- */}
        <div className={`col-md-4 col-lg-3 d-flex flex-column border-end bg-white h-100 ${showChatMobile ? "d-none d-md-flex" : "d-flex"}`}>
          <div className="p-3 bg-navy text-white d-flex align-items-center justify-content-between" style={{ height: "75px" }}>
            <div className="d-flex align-items-center gap-2">
              <img src={getImgURL(currentUser?.profileImage)} className="rounded-circle border border-2 border-light" width="45" height="45" style={{ objectFit: "cover" }} alt="me" />
              <div className="overflow-hidden">
                <h6 className="mb-0 small fw-bold text-truncate">{currentUser?.fullName}</h6>
                <small className="opacity-75 text-uppercase" style={{ fontSize: "9px" }}>{myRole}</small>
              </div>
            </div>
          </div>

          {myRole === "owner" && (
            <div className="d-flex bg-light border-bottom p-1">
              <button className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${activeTab === "users" ? "btn-success shadow-sm" : "text-muted"}`} onClick={() => { setActiveTab("users"); setSelectedUser(null); }}>CLIENTS</button>
              <button className={`btn btn-sm flex-grow-1 rounded-pill fw-bold ${activeTab === "admins" ? "btn-success shadow-sm" : "text-muted"}`} onClick={() => { setActiveTab("admins"); setSelectedUser(null); }}>ADMIN</button>
            </div>
          )}

          <div className="p-2 border-bottom">
            <div className="d-flex align-items-center bg-light rounded-pill px-3 py-1">
              <Search size={16} className="text-muted" />
              <input type="text" className="form-control border-0 bg-transparent shadow-none" placeholder="Search chats" style={{ fontSize: "14px" }} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
          </div>

          <div className="flex-grow-1 overflow-auto custom-scroll">
            {filteredContacts.map((u) => (
              <div key={u._id || u.id} onClick={() => { setSelectedUser(u); setShowChatMobile(true); }} className={`d-flex align-items-center p-3 border-bottom cursor-pointer ${selectedUser?._id === u._id ? "bg-light border-start border-4 border-success" : ""}`}>
                <img src={getImgURL(u.profileImage)} className="rounded-circle me-3 border" width="45" height="45" style={{ objectFit: "cover" }} onError={(e) => (e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png")} alt="" />
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between">
                    <h6 className="mb-0 text-truncate fw-bold" style={{ fontSize: "14px" }}>{u.fullName}</h6>
                    <small className="text-muted text-uppercase" style={{ fontSize: "8px" }}>{u.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- CHAT VIEW --- */}
        <div className={`col-md-8 col-lg-9 d-flex flex-column h-100 ${!showChatMobile ? "d-none d-md-flex" : "d-flex"}`} style={{ backgroundColor: "#efeae2" }}>
          {selectedUser ? (
            <>
              {/* Header */}
              <div className="p-2 px-3 bg-light border-bottom d-flex align-items-center justify-content-between shadow-sm" style={{ height: "65px" }}>
                <div className="d-flex align-items-center">
                  <button className="btn d-md-none p-0 me-2" onClick={() => setShowChatMobile(false)}><ArrowLeft size={22} /></button>
                  <img src={getImgURL(selectedUser.profileImage)} className="rounded-circle border" width="40" height="40" style={{ objectFit: "cover" }} alt="" />
                  <div className="ms-3">
                    <h6 className="mb-0 fw-bold" style={{ fontSize: "15px" }}>{selectedUser.fullName}</h6>
                    <small className="text-success fw-bold" style={{ fontSize: "11px" }}>online</small>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div ref={scrollRef} className="flex-grow-1 overflow-auto p-3 d-flex flex-column gap-2" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-90d70fcded21.png')", backgroundSize: "contain" }}>
                {messages.map((msg, i) => {
                  const isMe = (msg.senderId?._id || msg.senderId) === currentId;
                  return (
                    <div key={msg._id || i} className={`d-flex ${isMe ? "justify-content-end" : "justify-content-start"}`}>
                      <div className={`p-2 px-3 rounded-3 shadow-sm ${isMe ? "bg-success text-white" : "bg-white text-dark"}`} style={{ maxWidth: "75%", fontSize: "14px" }}>
                        
                        {/* Only show listing info if NOT chatting with admin */}
                        {selectedUser.role !== 'admin' && msg.listingId?.title && (
                          <div className="mb-1 border-start border-3 border-info ps-2 bg-black bg-opacity-10 rounded small py-1" style={{ fontSize: "10px" }}>
                            <strong>Ref:</strong> {msg.listingId.title}
                          </div>
                        )}

                        <div className="d-flex justify-content-between align-items-start gap-2">
                           <span>{msg.message}</span>
                           <Trash2 size={12} className="cursor-pointer opacity-50 hover-opacity-100" onClick={() => handleDeleteMessage(msg._id)} />
                        </div>

                        <div className={`text-end mt-1 ${isMe ? "text-white-50" : "text-muted"}`} style={{ fontSize: "10px" }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          {isMe && <CheckCheck size={14} className="ms-1" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="p-3 bg-light border-top">
                <form className="d-flex gap-2" onSubmit={handleSendMessage}>
                  <input type="text" className="form-control border-0 rounded-pill px-4 shadow-none" placeholder="Type a message" style={{ height: "45px" }} value={text} onChange={(e) => setText(e.target.value)} />
                  <button type="submit" className="btn btn-success rounded-circle p-0" style={{ width: "45px", height: "45px" }} disabled={!text.trim()}><Send size={20} /></button>
                </form>
              </div>
            </>
          ) : (
            <div className="m-auto text-center px-4">
              <ShieldCheck size={70} className="text-success opacity-25 mb-3" />
              <h3 className="text-secondary fw-light">Select a Chat</h3>
            </div>
          )}
        </div>
      </div>
      <style>{`
        .bg-navy { background-color: #001f3f; }
        .cursor-pointer { cursor: pointer; }
        .hover-opacity-100:hover { opacity: 1 !important; }
        .custom-scroll::-webkit-scrollbar { width: 5px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #ced4da; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default Messages; // ENSURE THIS LINE IS HERE