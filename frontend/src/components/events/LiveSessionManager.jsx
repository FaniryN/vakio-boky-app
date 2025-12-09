import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FiVideo, FiVideoOff, FiMic, FiMicOff, FiMonitor, FiUsers, FiShare, FiMessageSquare } from 'react-icons/fi';

const LiveSessionManager = ({ eventId, isHost = false }) => {
  const [isLive, setIsLive] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peerConnectionsRef = useRef(new Map());

  const { user } = useAuth();

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      initializeWebRTC();
    }
    return () => {
      cleanup();
    };
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/events/${eventId}`, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {},
      });

      const data = await response.json();
      if (data.success) {
        setEvent(data.event);
      }
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeWebRTC = async () => {
    try {
      // Request camera and microphone permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize WebRTC peer connections for participants
      // This is a simplified version - in production, you'd use a signaling server
      setupPeerConnections();

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
    }
  };

  const setupPeerConnections = () => {
    // Simplified peer connection setup
    // In production, this would connect to other participants via signaling server
    setParticipants([
      { id: '1', name: 'Alice Dupont', isHost: true, isMuted: false, isVideoOn: true },
      { id: '2', name: 'Bob Martin', isHost: false, isMuted: true, isVideoOn: true },
      { id: '3', name: 'Claire Bernard', isHost: false, isMuted: false, isVideoOn: false },
    ]);
  };

  const toggleMic = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !isMicOn;
      });
      setIsMicOn(!isMicOn);
    }
  };

  const toggleCamera = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });

        // Replace video track with screen share
        const videoTrack = screenStream.getVideoTracks()[0];
        const sender = streamRef.current.getVideoTracks()[0];

        // In production, you'd update all peer connections
        setIsScreenSharing(true);
      } else {
        // Stop screen sharing and restore camera
        const tracks = streamRef.current.getVideoTracks();
        tracks.forEach(track => track.stop());

        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
        }

        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const startLiveSession = () => {
    setIsLive(true);
    // Notify other participants that session has started
    addSystemMessage('La session live a commencé');
  };

  const endLiveSession = () => {
    setIsLive(false);
    cleanup();
    addSystemMessage('La session live s\'est terminée');
  };

  const addSystemMessage = (message) => {
    const systemMessage = {
      id: Date.now(),
      type: 'system',
      content: message,
      timestamp: new Date(),
    };
    setChatMessages(prev => [...prev, systemMessage]);
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        type: 'user',
        content: newMessage,
        author: user?.nom || 'Anonyme',
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const cleanup = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    peerConnectionsRef.current.forEach(pc => pc.close());
    peerConnectionsRef.current.clear();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FiVideo className="text-2xl" />
            <div>
              <h2 className="text-xl font-bold">{event?.title}</h2>
              <p className="text-red-100">Session Live</p>
            </div>
          </div>

          {isHost && (
            <div className="flex gap-2">
              {!isLive ? (
                <button
                  onClick={startLiveSession}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Commencer la session
                </button>
              ) : (
                <button
                  onClick={endLiveSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Terminer la session
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
        {/* Main Video Area */}
        <div className="lg:col-span-3 space-y-4">
          {/* Host Video */}
          <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />

            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <FiVideoOff className="text-6xl mx-auto mb-2" />
                  <p>Caméra éteinte</p>
                </div>
              </div>
            )}

            {isLive && (
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                EN DIRECT
              </div>
            )}

            {/* Control Buttons */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
              <button
                onClick={toggleMic}
                className={`p-3 rounded-full transition-colors ${
                  isMicOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isMicOn ? <FiMic className="text-xl" /> : <FiMicOff className="text-xl" />}
              </button>

              <button
                onClick={toggleCamera}
                className={`p-3 rounded-full transition-colors ${
                  isCameraOn
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                {isCameraOn ? <FiVideo className="text-xl" /> : <FiVideoOff className="text-xl" />}
              </button>

              {isHost && (
                <button
                  onClick={toggleScreenShare}
                  className={`p-3 rounded-full transition-colors ${
                    isScreenSharing
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <FiMonitor className="text-xl" />
                </button>
              )}
            </div>
          </div>

          {/* Participant Videos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {participants.slice(1, 5).map((participant) => (
              <div key={participant.id} className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl font-bold">
                        {participant.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    {!participant.isVideoOn && (
                      <p className="text-xs text-gray-400">Caméra éteinte</p>
                    )}
                  </div>
                </div>

                {participant.isHost && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                    HOST
                  </div>
                )}

                {!participant.isMuted && (
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white p-1 rounded-full">
                    <FiMic className="text-xs" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Participants List */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FiUsers className="text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Participants ({participants.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {participants.map((participant) => (
                <div key={participant.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {participant.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {participant.name}
                    </p>
                    {participant.isHost && (
                      <p className="text-xs text-yellow-600 font-medium">Animateur</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {!participant.isMuted && <FiMic className="text-green-500 text-sm" />}
                    {participant.isVideoOn && <FiVideo className="text-green-500 text-sm" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat */}
          <div className="bg-gray-50 rounded-xl p-4 flex flex-col h-96">
            <div className="flex items-center gap-2 mb-3">
              <FiMessageSquare className="text-green-600" />
              <h3 className="font-semibold text-gray-900">Chat</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 mb-3">
              {chatMessages.map((message) => (
                <div key={message.id} className="text-sm">
                  {message.type === 'system' ? (
                    <div className="text-center text-gray-500 italic">
                      {message.content}
                    </div>
                  ) : (
                    <div>
                      <span className="font-medium text-blue-600">{message.author}: </span>
                      <span className="text-gray-700">{message.content}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveSessionManager;