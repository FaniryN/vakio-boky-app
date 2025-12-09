import React, { useState, useRef } from "react";
import {
  FiVideo,
  FiVideoOff,
  FiMic,
  FiMicOff,
  FiMonitor,
  FiMessageSquare,
  FiUsers,
  FiPlay,
  FiSquare,
} from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import Button from "../ui/Button";

const LiveSessionManager = () => {
  const { user } = useAuth();
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState([
    {
      id: 1,
      name: "Alice Dupont",
      role: "host",
      isMuted: false,
      isCameraOn: true,
    },
    {
      id: 2,
      name: "Jean Martin",
      role: "participant",
      isMuted: true,
      isCameraOn: false,
    },
    {
      id: 3,
      name: "Marie Claire",
      role: "participant",
      isMuted: false,
      isCameraOn: true,
    },
  ]);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "Alice Dupont",
      message: "Bienvenue à tous !",
      timestamp: new Date(),
    },
    {
      id: 2,
      user: "Jean Martin",
      message: "Merci pour cette session !",
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const screenShareRef = useRef(null);

  const startLiveSession = () => {
    setIsLive(true);
    console.log("Starting live session...");
  };
  const stopLiveSession = () => {
    setIsLive(false);
    setIsScreenSharing(false);
    console.log("Stopping live session...");
  };
  const toggleMute = () => setIsMuted(!isMuted);
  const toggleCamera = () => setIsCameraOff(!isCameraOff);
  const toggleScreenShare = () => setIsScreenSharing(!isScreenSharing);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setChatMessages([
      ...chatMessages,
      {
        id: chatMessages.length + 1,
        user: user?.name || user?.nom || "Vous",
        message: newMessage,
        timestamp: new Date(),
      },
    ]);
    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FiVideo /> Session Live Interactive
          </h2>
          <p className="mt-1 opacity-90">
            {isLive ? "Session en cours" : "Session inactive - Interface de démonstration"}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FiUsers className="text-green-300" />{" "}
            <span className="font-semibold">
              {participants.length} participants
            </span>
          </div>
        </div>
      </div>

      {/* Video & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Local Video */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                <div className="text-center">
                  <FiVideo className="text-4xl mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Votre caméra</p>
                  <p className="text-xs opacity-70 mt-1">
                    {isCameraOff ? "Caméra éteinte" : "Caméra activée"}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                Vous {isMuted && "(muet)"}
              </div>
            </div>
            {/* Remote / ScreenShare */}
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
              <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                <div className="text-center">
                  <FiVideo className="text-4xl mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {isScreenSharing ? "Partage d'écran" : "Participant principal"}
                  </p>
                  <p className="text-xs opacity-70 mt-1">
                    {isLive ? "Session active" : "En attente de session"}
                  </p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                {isScreenSharing ? "Partage d'écran" : "Participant principal"}
              </div>
            </div>
          </div>

          {/* Control Panel */}
          <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center gap-4">
            <Button
              onClick={toggleMute}
              variant={isMuted ? "danger" : "secondary"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {isMuted ? <FiMicOff /> : <FiMic />}
            </Button>
            <Button
              onClick={toggleCamera}
              variant={isCameraOff ? "danger" : "secondary"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              {isCameraOff ? <FiVideoOff /> : <FiVideo />}
            </Button>
            <Button
              onClick={toggleScreenShare}
              variant={isScreenSharing ? "primary" : "secondary"}
              size="lg"
              className="rounded-full w-12 h-12 p-0"
            >
              <FiMonitor />
            </Button>
            <div className="w-px h-8 bg-gray-300"></div>
            {!isLive ? (
              <Button
                onClick={startLiveSession}
                variant="success"
                size="lg"
                className="flex items-center gap-2 px-6"
              >
                <FiPlay /> Démarrer la session
              </Button>
            ) : (
              <Button
                onClick={stopLiveSession}
                variant="danger"
                size="lg"
                className="flex items-center gap-2 px-6"
              >
                <FiSquare /> Arrêter la session
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Participants + Chat */}
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiUsers /> Participants ({participants.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {participants.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {p.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-2">
                      {p.isMuted && (
                        <FiMicOff className="text-red-500 text-xs" />
                      )}{" "}
                      {!p.isCameraOn && (
                        <FiVideoOff className="text-red-500 text-xs" />
                      )}
                      <span className="text-xs text-gray-500 capitalize">
                        {p.role}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 flex flex-col h-80">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <FiMessageSquare /> Chat
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="text-sm">
                  <span className="font-medium text-blue-600">{msg.user}:</span>
                  <span className="text-gray-700 ml-1">{msg.message}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <Button
                onClick={sendMessage}
                size="sm"
                disabled={!newMessage.trim()}
              >
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-blue-50 border-t border-blue-200 p-4">
        <div className="text-center text-blue-700 text-sm">
          <p>
            <strong>Interface de démonstration :</strong> Cette interface est statique en attendant l'intégration des véritables sessions live.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionManager;