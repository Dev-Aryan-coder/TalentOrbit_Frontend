import React, { useState, useEffect, useRef } from 'react';
import { chatbotAPI } from '../../services/api';
import {
  Bot,
  X,
  Send,
  Image as ImageIcon,
  Plus,
  History,
  Sparkles,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  Maximize2,
  Minimize2,
  Paperclip,
} from 'lucide-react';
import './TalentOrbitAIChatbot.css';

export default function TalentOrbitAIChatbot({ currentUser }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState(null); // base64 string
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [showSessionsDrawer, setShowSessionsDrawer] = useState(false);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);

  const userId = currentUser?.id || currentUser?.userId || 1;
  const userRole = currentUser?.role || 'STUDENT';
  const userName = currentUser?.fullName || currentUser?.name || 'User';

  // Auto-scroll to bottom of message list
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen]);

  // Fetch past sessions when chatbot opens
  useEffect(() => {
    if (!isOpen || !userId) return;

    chatbotAPI.getUserSessions(userId)
      .then((res) => {
        if (Array.isArray(res)) {
          setSessions(res);
          if (res.length > 0 && !currentSessionId) {
            // Load most recent session
            const latest = res[0];
            setCurrentSessionId(latest.id);
            loadSessionMessages(latest.id);
          } else if (res.length === 0 && messages.length === 0) {
            initWelcomeMessage();
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load chat sessions from backend:', err.message);
        if (messages.length === 0) initWelcomeMessage();
      });
  }, [isOpen, userId]);

  const initWelcomeMessage = () => {
    setMessages([
      {
        id: 'welcome',
        sender: 'ASSISTANT',
        content: `Welcome back, ${userName}. I am your TalentOrbit AI Assistant powered by Qwen 3.8-27B.\n\nI can analyze your verified skills, explain corporate match percentages, review architecture diagrams or code screenshots, and guide your internship journey.\n\nHow can I assist you today?`,
        imageUrl: null,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const loadSessionMessages = (sessionId) => {
    chatbotAPI.getSessionMessages(sessionId)
      .then((res) => {
        if (Array.isArray(res) && res.length > 0) {
          setMessages(res);
        } else {
          initWelcomeMessage();
        }
      })
      .catch((err) => {
        console.warn('Could not load session messages:', err.message);
        initWelcomeMessage();
      });
  };

  const handleStartNewChat = () => {
    setCurrentSessionId(null);
    setSelectedImage(null);
    setImagePreview(null);
    setInputMessage('');
    setShowSessionsDrawer(false);
    initWelcomeMessage();
  };

  const handleSelectSession = (sessionId) => {
    setCurrentSessionId(sessionId);
    setShowSessionsDrawer(false);
    loadSessionMessages(sessionId);
  };

  // Process Image File (from file picker, clipboard paste, or drag & drop)
  const processImageFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload or paste a valid image file (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size exceeds 5MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Image Selection Handler from File Input
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  // Clipboard Paste Handler (Supports direct Ctrl + V screenshot/image pasting in textbox)
  const handlePaste = (e) => {
    // 1. Check clipboardData.files (e.g. copied image files from file explorer or screenshot tools)
    const files = e.clipboardData?.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        if (files[i].type && files[i].type.startsWith('image/')) {
          e.preventDefault();
          processImageFile(files[i]);
          return;
        }
      }
    }

    // 2. Check clipboardData.items (e.g. screenshots from PrintScreen / Snipping Tool / Browser copy)
    const items = e.clipboardData?.items;
    if (items && items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type && item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            processImageFile(file);
            return;
          }
        }
      }
    }
  };

  // Drag & Drop Image Handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type && file.type.startsWith('image/')) {
        processImageFile(file);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Send Message to Real Spring Boot Backend
  const handleSendMessage = async (customPrompt) => {
    const textToSend = typeof customPrompt === 'string' ? customPrompt : inputMessage;
    if ((!textToSend.trim() && !selectedImage) || isLoading) return;

    const userText = textToSend.trim();
    const imagePayload = selectedImage;

    // Optimistic UI message
    const tempUserMsg = {
      id: `temp_${Date.now()}`,
      sender: 'USER',
      content: userText,
      imageUrl: imagePayload,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setInputMessage('');
    setSelectedImage(null);
    setImagePreview(null);
    setIsLoading(true);

    try {
      const payload = {
        userId: userId,
        sessionId: currentSessionId,
        message: userText,
        imageUrl: imagePayload,
      };

      const res = await chatbotAPI.sendMessage(payload);

      if (res) {
        if (!currentSessionId && res.sessionId) {
          setCurrentSessionId(res.sessionId);
        }

        const assistantMsg = {
          id: `asst_${Date.now()}`,
          sender: 'ASSISTANT',
          content: res.reply || res.message || 'I have analyzed your request based on your verified platform profile.',
          imageUrl: null,
          createdAt: res.createdAt || new Date().toISOString(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error('Chatbot API communication error:', err);
      const errorMsg = {
        id: `err_${Date.now()}`,
        sender: 'ASSISTANT',
        content: `Backend connectivity notice: Could not reach Spring Boot server at port 8080. Please ensure the backend is running. Details: ${err.message}`,
        imageUrl: null,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    'Analyze my verified skills and recommend matched corporate internships',
    'How does the explainable matching algorithm calculate compatibility score?',
    'What are Ayush ABDM Standards for health informatics careers?',
    'How do I bridge my skill gaps to reach 95% employability readiness?',
  ];

  return (
    <>
      {/* 1. Floating Circular Trigger Badge + Toast */}
      {!isOpen && (
        <div className="talentorbit-ai-floating-trigger-container">
          <div className="talentorbit-ai-toast-badge" onClick={() => setIsOpen(true)}>
            <span className="ai-status-pulse" />
            <span className="ai-toast-text">TalentOrbit AI</span>
          </div>

          <button
            type="button"
            className="talentorbit-ai-trigger-circle"
            onClick={() => setIsOpen(true)}
            aria-label="Open TalentOrbit AI Assistant"
            title="Open TalentOrbit AI Assistant"
          >
            <Bot size={24} className="text-white" />
            <span className="trigger-ring-animation" />
          </button>
        </div>
      )}

      {/* 2. shadcn/ui Chat Window (Supports Clipboard Paste & Drag-Drop) */}
      {isOpen && (
        <div
          className={`talentorbit-ai-chat-window ${isExpanded ? 'expanded' : ''}`}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {/* Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-left">
              <div className="ai-bot-avatar">
                <Bot size={18} className="text-indigo-600" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="ai-chat-title">TalentOrbit AI</h3>
                  <span className="ai-badge-model">Qwen 3.8-27B Vision</span>
                </div>
                <p className="ai-chat-subtitle">Verified Career & Skill Intelligence Assistant</p>
              </div>
            </div>

            <div className="ai-chat-header-actions">
              <button
                type="button"
                className="ai-icon-btn"
                title="Conversation History"
                onClick={() => setShowSessionsDrawer(!showSessionsDrawer)}
              >
                <History size={16} />
              </button>

              <button
                type="button"
                className="ai-icon-btn"
                title="New Conversation"
                onClick={handleStartNewChat}
              >
                <Plus size={16} />
              </button>

              <button
                type="button"
                className="ai-icon-btn"
                title={isExpanded ? 'Restore Size' : 'Expand'}
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                type="button"
                className="ai-icon-btn close"
                title="Close Chat"
                onClick={() => setIsOpen(false)}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Past Sessions Drawer */}
          {showSessionsDrawer && (
            <div className="ai-sessions-drawer">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Saved Conversations</span>
                <button
                  type="button"
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                  onClick={handleStartNewChat}
                >
                  <Plus size={12} />
                  <span>Start Fresh</span>
                </button>
              </div>

              <div className="ai-sessions-list">
                {sessions.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No past conversations recorded yet.</p>
                ) : (
                  sessions.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSession(s.id)}
                      className={`ai-session-item ${currentSessionId === s.id ? 'active' : ''}`}
                    >
                      <div className="truncate text-xs font-medium">{s.title || 'Conversation'}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {s.startedAt ? new Date(s.startedAt).toLocaleDateString() : 'Recent'}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="ai-chat-messages-area">
            {messages.map((m) => {
              const isUser = m.sender === 'USER';
              return (
                <div key={m.id} className={`ai-message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
                  {!isUser && (
                    <div className="ai-msg-avatar assistant">
                      <Bot size={14} className="text-indigo-600" />
                    </div>
                  )}

                  <div className={`ai-message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
                    {/* Render Image if attached */}
                    {m.imageUrl && (
                      <div className="ai-message-image-container">
                        <img src={m.imageUrl} alt="Attached screenshot" className="ai-attached-image" />
                      </div>
                    )}

                    <div className="ai-message-text whitespace-pre-wrap">{m.content}</div>

                    <div className="ai-message-time">
                      {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="ai-message-row assistant-row">
                <div className="ai-msg-avatar assistant">
                  <Bot size={14} className="text-indigo-600" />
                </div>
                <div className="ai-message-bubble assistant-bubble typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts (Only shown on new chat) */}
          {messages.length <= 1 && (
            <div className="ai-quick-prompts-row">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(prompt)}
                  className="ai-quick-prompt-chip"
                >
                  <Sparkles size={11} className="text-indigo-500" />
                  <span className="truncate">{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Image Upload Preview Bar */}
          {imagePreview && (
            <div className="ai-image-preview-bar">
              <div className="ai-image-thumbnail-wrap">
                <img src={imagePreview} alt="Upload preview" className="ai-image-thumbnail" />
                <button
                  type="button"
                  className="ai-remove-image-btn"
                  onClick={handleRemoveImage}
                  title="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
              <span className="text-[11px] text-slate-500 truncate">Image attached for Qwen vision analysis</span>
            </div>
          )}

          {/* Input Bar */}
          <div className="ai-chat-input-bar">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={handleImageSelect}
              style={{ display: 'none' }}
            />

            <button
              type="button"
              className={`ai-attach-btn ${imagePreview ? 'active' : ''}`}
              title="Attach code screenshot, error, or architecture diagram (Multimodal Vision)"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon size={18} />
            </button>

            <textarea
              ref={inputRef}
              rows={1}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={imagePreview ? 'Ask Qwen to analyze this image...' : 'Type a message or paste image (Ctrl+V)...'}
              className="ai-chat-textarea"
            />

            <button
              type="button"
              className="ai-send-btn"
              disabled={(!inputMessage.trim() && !selectedImage) || isLoading}
              onClick={() => handleSendMessage()}
              title="Send Message"
            >
              {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
