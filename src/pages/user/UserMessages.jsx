import React, { useEffect, useMemo, useState } from "react";

import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaInbox,
  FaPaperPlane,
  FaBuilding,
  FaSearch,
  FaClock,
} from "react-icons/fa";

import API from "../../api/axios";
import Loader from "../../components/common/Loader";

const UserMessages = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // =====================================================
  // FETCH MESSAGES
  // =====================================================

  const fetchMessages = async () => {
    setLoading(true);

    try {
      const res = await API.get("/user/messages");

      setMessages(res?.data?.messages || []);
    } catch (error) {
      console.error("Failed to fetch user messages:", error);

      alert(
        error?.response?.data?.message ||
          "Failed to fetch messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // =====================================================
  // CURRENT USER ID
  // =====================================================

  const currentUserId = useMemo(() => {
    const user = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    return user?._id || user?.id || null;
  }, []);

  // =====================================================
  // MESSAGE TYPE
  // =====================================================

  const isIncoming = (message) => {
    return (
      currentUserId &&
      String(message.receiver?._id || message.receiver) ===
        String(currentUserId)
    );
  };

  const isOutgoing = (message) => {
    return (
      currentUserId &&
      String(message.sender?._id || message.sender) ===
        String(currentUserId)
    );
  };

  // =====================================================
  // FILTER + SEARCH
  // =====================================================

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages.filter((message) => {
      const incoming = isIncoming(message);
      const outgoing = isOutgoing(message);

      if (filter === "inbox" && !incoming) {
        return false;
      }

      if (filter === "sent" && !outgoing) {
        return false;
      }

      if (filter === "unread" && !incoming) {
        return false;
      }

      if (
        filter === "unread" &&
        message.isRead
      ) {
        return false;
      }

      if (!term) {
        return true;
      }

      const senderName =
        message.sender?.name || "";

      const receiverName =
        message.receiver?.name || "";

      const businessName =
        message.business?.name || "";

      const messageText =
        message.message || "";

      return (
        senderName.toLowerCase().includes(term) ||
        receiverName.toLowerCase().includes(term) ||
        businessName.toLowerCase().includes(term) ||
        messageText.toLowerCase().includes(term)
      );
    });
  }, [
    messages,
    search,
    filter,
    currentUserId,
  ]);

  // =====================================================
  // STATS
  // =====================================================

  const totalMessages = messages.length;

  const inboxMessages = messages.filter(
    (message) => isIncoming(message)
  ).length;

  const sentMessages = messages.filter(
    (message) => isOutgoing(message)
  ).length;

  const unreadMessages = messages.filter(
    (message) =>
      isIncoming(message) &&
      !message.isRead
  ).length;

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(date).toLocaleString(
        "en-IN",
        {
          dateStyle: "medium",
          timeStyle: "short",
        }
      );
    } catch {
      return "";
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-4 md:p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Messages
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            View your conversations and messages
          </p>
        </div>

      </div>

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        {/* TOTAL */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Total Messages
              </p>

              <h3 className="text-2xl font-bold mt-1 text-gray-900">
                {totalMessages}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <FaEnvelope className="text-xl" />
            </div>

          </div>

        </div>

        {/* INBOX */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Inbox
              </p>

              <h3 className="text-2xl font-bold mt-1 text-gray-900">
                {inboxMessages}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-600">
              <FaInbox className="text-xl" />
            </div>

          </div>

        </div>

        {/* SENT */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Sent
              </p>

              <h3 className="text-2xl font-bold mt-1 text-gray-900">
                {sentMessages}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <FaPaperPlane className="text-xl" />
            </div>

          </div>

        </div>

        {/* UNREAD */}

        <div className="bg-white border rounded-2xl p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Unread
              </p>

              <h3 className="text-2xl font-bold mt-1 text-orange-600">
                {unreadMessages}
              </h3>
            </div>

            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
              <FaEnvelopeOpen className="text-xl" />
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="bg-white border rounded-2xl p-4 shadow-sm mb-6">

        <div className="flex flex-col lg:flex-row gap-3">

          {/* SEARCH */}

          <div className="flex items-center gap-3 bg-gray-50 border rounded-xl px-4 py-3 flex-1">

            <FaSearch className="text-gray-400" />

            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full bg-transparent outline-none text-sm"
            />

          </div>

          {/* FILTER */}

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3 text-sm bg-white outline-none"
          >
            <option value="all">
              All Messages
            </option>

            <option value="inbox">
              Inbox
            </option>

            <option value="sent">
              Sent
            </option>

            <option value="unread">
              Unread
            </option>
          </select>

        </div>

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && <Loader />}

      {/* =================================================
          EMPTY
      ================================================= */}

      {!loading &&
        filteredMessages.length === 0 && (

          <div className="bg-white border rounded-2xl p-10 text-center shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-500 mx-auto mb-4">

              <FaEnvelope className="text-2xl" />

            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No Messages Found
            </h3>

            <p className="text-sm text-gray-500">
              You don't have any messages matching
              the current filter.
            </p>

          </div>

        )}

      {/* =================================================
          MESSAGE LIST
      ================================================= */}

      {!loading &&
        filteredMessages.length > 0 && (

          <div className="grid gap-4">

            {filteredMessages.map((message) => {

              const incoming =
                isIncoming(message);

              const senderName =
                message.sender?.name ||
                "Unknown User";

              const receiverName =
                message.receiver?.name ||
                "Unknown User";

              return (

                <div
                  key={message._id}
                  className={`bg-white border rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition ${
                    incoming &&
                    !message.isRead
                      ? "border-blue-300"
                      : ""
                  }`}
                >

                  <div className="flex flex-col lg:flex-row gap-4">

                    {/* ICON */}

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        incoming
                          ? "bg-green-100 text-green-600"
                          : "bg-purple-100 text-purple-600"
                      }`}
                    >

                      {incoming ? (
                        <FaEnvelope className="text-xl" />
                      ) : (
                        <FaPaperPlane className="text-xl" />
                      )}

                    </div>

                    {/* CONTENT */}

                    <div className="flex-1 min-w-0">

                      {/* TOP */}

                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">

                        <div>

                          <div className="flex items-center gap-2 flex-wrap">

                            <h2 className="font-semibold text-gray-900">

                              {incoming
                                ? `From: ${senderName}`
                                : `To: ${receiverName}`}

                            </h2>

                            {incoming &&
                              !message.isRead && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  Unread
                                </span>
                              )}

                          </div>

                          {message.business?.name && (

                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">

                              <FaBuilding />

                              <span>
                                {message.business.name}
                              </span>

                            </div>

                          )}

                        </div>

                        {/* DATE */}

                        <div className="flex items-center gap-2 text-xs text-gray-400">

                          <FaClock />

                          <span>
                            {formatDate(
                              message.createdAt
                            )}
                          </span>

                        </div>

                      </div>

                      {/* MESSAGE */}

                      <div className="mt-4 bg-gray-50 border rounded-xl p-4">

                        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                          {message.message}
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

    </div>
  );
};

export default UserMessages;