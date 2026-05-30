import React, { useState, useEffect, useRef } from 'react';
import { ChatMessageI, FormI } from '../../types/form.types';
import { FormService } from '../../API/FormService';
import styles from './FormComponent.module.css';
import { useUser } from '../../hooks/useUser';

interface FormChatProps {
    form: FormI;
    onMessageSent?: () => void;
}

const FormChat: React.FC<FormChatProps> = ({ form, onMessageSent }) => {
    const [messages, setMessages] = useState<ChatMessageI[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { store } = useUser();
    const adminId = store.user?.id_admin || 0;

    useEffect(() => {
        loadMessages();
        
        const interval = setInterval(loadMessages, 5000);
        return () => clearInterval(interval);
    }, [form.ID_form]);

    useEffect(() => {
        if (messages.length > 0) {
            FormService.markMessagesAsRead(form.ID_form, adminId);
        }
    }, [messages, form.ID_form, adminId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadMessages = async () => {
        try {
            const response = await FormService.getChatMessages(form.ID_form);
            setMessages(response);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            await FormService.sendMessage({
                form_id: form.ID_form,
                admin_id: adminId,
                message: newMessage.trim()
            });
            setNewMessage('');
            await loadMessages();
            onMessageSent?.();
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const groupMessagesByDate = () => {
        const groups: { [key: string]: ChatMessageI[] } = {};
        messages.forEach(message => {
            const date = formatDate(message.created_at);
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(message);
        });
        return groups;
    };

    const messageGroups = groupMessagesByDate();

    return (
        <div className={styles.chatContainer}>
            <div className={styles.chatHeader}>
                <h3>Чат с {form.FIO}</h3>
                <span className={styles.chatStatus}>
                    {form.Status === 'active' ? 'Активный чат' : 'Чат закрыт'}
                </span>
            </div>

            <div className={styles.messagesContainer}>
                {Object.entries(messageGroups).map(([date, dateMessages]) => (
                    <div key={date} className={styles.messageGroup}>
                        <div className={styles.dateDivider}>
                            <span>{date}</span>
                        </div>
                        {dateMessages.map((message) => (
                            <div
                                key={message.id}
                                className={`${styles.message} ${
                                    message.sender_type === 'admin' 
                                        ? styles.myMessage 
                                        : styles.userMessage
                                }`}
                            >
                                <div className={styles.messageBubble}>
                                    <div className={styles.messageText}>{message.message}</div>
                                    <div className={styles.messageTime}>
                                        {formatTime(message.created_at)}
                                        {message.is_read && message.sender_type === 'admin' && (
                                            <span className={styles.readReceipt}>✓✓</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {form.Status === 'active' && (
                <form onSubmit={handleSendMessage} className={styles.chatInputForm}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Введите сообщение..."
                        className={styles.chatInput}
                        disabled={isSending}
                    />
                    <button
                        type="submit"
                        className={styles.sendButton}
                        disabled={!newMessage.trim() || isSending}
                    >отправить
                        {isSending ? '...' : ''}
                    </button>
                </form>
            )}
        </div>
    );
};

export default FormChat;
