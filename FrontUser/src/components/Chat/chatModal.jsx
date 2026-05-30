// src/components/Chat/ChatModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { chatAPI } from '../../API/ChatService';
import styles from './chatModal.module.css';
import showAlert from '../UI/Alert/Alert.jsx';
const ChatModal = ({ isOpen, onClose, formId, formType, applicationStatus }) => { //
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isChatClosed, setIsChatClosed] = useState(false);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  const checkChatStatus = async () => {
    if (!formId) return;
    
    if (applicationStatus === 'completed') {
      setIsChatClosed(true);
      return;
    }
    
    try {
      const response = await chatAPI.getApplication?.(formId);
      if (response && response.status === 'completed') {
        setIsChatClosed(true);
      }
    } catch (error) {
      console.error('Failed to check chat status:', error);
    }
  };

  const loadMessages = async () => {
    if (!formId) return;
    try {
      const data = await chatAPI.getMessages(formId);
      
      if (data && data.application_status === 'completed') {
        setIsChatClosed(true);
      }
      
      if (Array.isArray(data)) {
        setMessages(data);
      } else if (data && typeof data === 'object') {
        if (Array.isArray(data.data)) {
          setMessages(data.data);
          if (data.application_status === 'completed') {
            setIsChatClosed(true);
          }
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
      setMessages([]);
    }
  };

  useEffect(() => {
    if (isOpen && formId) {
      setLoading(true);
      setIsChatClosed(false); 
      
      Promise.all([
        loadMessages(),
        checkChatStatus()
      ]).finally(() => setLoading(false));
      
      intervalRef.current = setInterval(() => {
        if (isOpen && formId) {
          loadMessages();
          checkChatStatus();
        }
      }, 3000);
      
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isOpen, formId, applicationStatus]); 

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (isChatClosed) {
      showAlert('Чат закрыт. Отправка сообщений невозможна.', 'error', 6000);
      return;
    }
    
    if (!newMessage.trim()) return;
    
    setSending(true);
    try {
      const message = await chatAPI.sendMessage(formId, newMessage);
      if (message && message.message) {
        setMessages(prev => [...prev, message]);
      } else {
        await loadMessages();
      }
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      
      if (error.response?.status === 403 || 
          error.response?.data?.error === 'chat closed' ||
          error.response?.data?.message?.includes('closed')) {
        setIsChatClosed(true);
        showAlert('Чат закрыт. Отправка сообщений невозможна.', 'error', 6000);
      } else {
        showAlert('Ошибка при отправке сообщения', 'error', 6000);
      }
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  const getFormTypeName = () => {
    const types = {
      'emergency': 'Аварийная заявка',
      'no-heating': 'Нет отопления',
      'no-hot-water': 'Нет горячей воды'
    };
    return types[formType] || 'Заявка';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.Overlay} onClick={onClose}>
      <div className={styles.Modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.Header}>
          <div className={styles.HeaderInfo}>
            <h3>Чат с оператором</h3>
            <p className={styles.FormInfo}>
              {getFormTypeName()} №{formId}
            </p>
            {isChatClosed && (
              <span className={styles.ClosedBadge}>Чат закрыт</span>
            )}
          </div>
          <button className={styles.CloseButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.MessagesContainer}>
          {loading && messages.length === 0 ? (
            <div className={styles.Loading}>Загрузка сообщений...</div>
          ) : messages.length === 0 ? (
            <div className={styles.EmptyState}>
              <span>💬</span>
              <p>Нет сообщений</p>
              <small>
                {isChatClosed 
                  ? 'Чат закрыт' 
                  : 'Напишите первое сообщение оператору'}
              </small>
            </div>
          ) : (
            <>
              {messages.map((msg, index) => (
                <div
                  key={msg.id || index}
                  className={`${styles.Message} ${msg.sender_type === 'user' ? styles.UserMessage : styles.OperatorMessage}`}
                >
                  <div className={styles.MessageContent}>
                    <div className={styles.MessageText}>{msg.message || msg.message_text}</div>
                    <div className={styles.MessageTime}>
                      {formatTime(msg.created_at)}
                      {msg.is_read && <span className={styles.ReadMark}>✓✓</span>}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {isChatClosed ? (
          <div className={styles.ClosedChatContainer}>
            <div className={styles.ClosedChatMessage}>Чат закрыт</div>
            <div className={styles.ClosedChatSubtext}>
              Заявка выполнена, отправка сообщений недоступна
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendMessage} className={styles.InputForm}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Введите сообщение..."
              className={styles.MessageInput}
              disabled={sending}
            />
            <button 
              type="submit" 
              className={styles.SendButton}
              disabled={sending || !newMessage.trim()}
            >
              {sending ? '...' : 'Отправить'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatModal;
