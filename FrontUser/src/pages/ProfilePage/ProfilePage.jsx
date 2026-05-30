// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { profileAPI } from '../../API/ProfileService';
import ChatModal from '../../components/Chat/chatModal';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header';
import Footer from '../../components/UI/Footer/Footer';
import styles from './ProfilePage.module.css';

import padIcon from '../../assets/icon-memo-pad.svg';
import chatIcon from '../../assets/icon-chat.svg';
import settingIcon from '../../assets/icon-settings.svg';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [applications, setApplications] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedFormType, setSelectedFormType] = useState(null);
  const [autoOpenedChat, setAutoOpenedChat] = useState(false);
  


  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (applications.length > 0 && !autoOpenedChat && !selectedChat) {
      const activeApplication = applications.find(app => app.status !== 'completed');
      
      if (activeApplication) {
        console.log('Auto-opening chat for application:', activeApplication.id);
        setSelectedChat(activeApplication.id);
        setSelectedFormType(activeApplication.type);
        setAutoOpenedChat(true);
      }
    }
  }, [applications, autoOpenedChat, selectedChat]);

  const loadProfile = async () => {
    if (hasError) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log(localStorage.getItem('token'));
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const profileData = await profileAPI.getProfile();
        console.log('Profile data from backend:', profileData);
        setUser(profileData);
        setProfileData(profileData);
        setHasError(false);
        
        await loadApplications();
        
      } catch (backendError) {
        console.log('Backend error, using localStorage');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setProfileData(userData);
          setHasError(true);
          
          await loadApplications();
        } else {
          navigate('/login');
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      const response = await profileAPI.getMyApplications();
      console.log('Applications response:', response);
      
      let apps = [];
      if (response && response.data && Array.isArray(response.data)) {
        apps = response.data;
      } else if (Array.isArray(response)) {
        apps = response;
      } else if (response && response.data && response.data.data && Array.isArray(response.data.data)) {
        apps = response.data.data;
      } else {
        apps = [];
      }
      
      setApplications(apps);
      return apps; 
    } catch (error) {
      console.error('Failed to load applications:', error);
      setApplications([]);
      return [];
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const updated = await profileAPI.updateProfile(profileData);
      setProfileData(updated);
      setUser(updated);
      setEditing(false);
      localStorage.setItem('user', JSON.stringify(updated));
      await loadProfile();
      alert('Профиль успешно обновлен!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Заполните все поля');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Новый пароль должен содержать минимум 6 символов');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Новый пароль и подтверждение не совпадают');
      return;
    }
    
    try {
      await profileAPI.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setPasswordSuccess('Пароль успешно изменен!');
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setPasswordError(error.response.data.error);
      } else {
        setPasswordError('Ошибка при смене пароля. Проверьте текущий пароль.');
      }
    }
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openChat = (formId, formType) => {
    setSelectedChat(formId);
    setSelectedFormType(formType);
  };

  const closeChat = () => {
    setSelectedChat(null);
    setSelectedFormType(null);
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'pending': { text: 'В обработке', color: '#f39c12', bg: '#fef3c7' },
      'in-progress': { text: 'В работе', color: '#3498db', bg: '#dbeafe' },
      'completed': { text: 'Выполнено', color: '#27ae60', bg: '#d1fae5' },
      'cancelled': { text: 'Отменено', color: '#e74c3c', bg: '#fee2e2' }
    };
    return statuses[status] || { text: status, color: '#666', bg: '#f3f4f6' };
  };

  const getFormTypeName = (type) => {
    const types = {
      'emergency': 'Авария',
      'no-heating': 'Нет отопления',
      'no-hot-water': 'Нет горячей воды'
    };
    return types[type] || 'Заявка';
  };

  if (loading) {
    return (
      <>
        <Header title="Личный кабинет" />
        <ContainerComponent>
          <div className={styles.Loading}>Загрузка...</div>
        </ContainerComponent>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Header title="Личный кабинет" />
      <ContainerComponent>
        <main className={styles.Main}>
          <section className={styles.ProfileSection}>
            <div className={styles.ProfileCard}>
              <div className={styles.ProfileHeader}>
                <div className={styles.Avatar}>
                  {user.firstname?.charAt(0)}{user.lastname?.charAt(0)}
                </div>
                <div className={styles.ProfileInfo}>
                  <h2 className={styles.ProfileName}>
                    {user.firstname} {user.lastname}
                  </h2>
                  <p className={styles.ProfileEmail}>{user.email}</p>
                  {user.phone && (
                    <p className={styles.ProfilePhone}>{user.phone}</p>
                  )}
                </div>
                <button className={styles.LogoutButton} onClick={handleLogout}>
                  Выйти
                </button>
              </div>
              
              <div className={styles.ProfileDetails}>
                <div className={styles.DetailItem}>
                  <span className={styles.DetailLabel}>Район:</span>
                  <span className={styles.DetailValue}>{user.district || 'Не указан'}</span>
                </div>
                <div className={styles.DetailItem}>
                  <span className={styles.DetailLabel}>Адрес:</span>
                  <span className={styles.DetailValue}>{user.address || 'Не указан'}</span>
                </div>
                <div className={styles.DetailItem}>
                  <span className={styles.DetailLabel}>Дата регистрации:</span>
                  <span className={styles.DetailValue}>
                    {user.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : '-'}
                  </span>
                </div>
              </div>

              <button className={styles.EditButton} onClick={() => setEditing(!editing)}>
                {editing ? 'Отменить' : 'Редактировать профиль'}
              </button>

              {editing && (
                <form onSubmit={handleUpdateProfile} className={styles.EditForm}>
                  <input
                    type="text"
                    value={profileData.firstname || ''}
                    onChange={(e) => setProfileData({...profileData, firstname: e.target.value})}
                    placeholder="Имя"
                    className={styles.EditInput}
                  />
                  <input
                    type="text"
                    value={profileData.lastname || ''}
                    onChange={(e) => setProfileData({...profileData, lastname: e.target.value})}
                    placeholder="Фамилия"
                    className={styles.EditInput}
                  />
                  <input
                    type="tel"
                    value={profileData.phone || ''}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="Телефон"
                    className={styles.EditInput}
                  />
                  <input
                    type="text"
                    value={profileData.address || ''}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    placeholder="Адрес"
                    className={styles.EditInput}
                  />
                  <button type="submit" className={styles.SaveButton}>
                    Сохранить изменения
                  </button>
                </form>
              )}
            </div>

            <div className={styles.StatsCard}>
              <h3>Статистика</h3>
              <div className={styles.StatsGrid}>
                <div className={styles.StatItem}>
                  <span className={styles.StatValue}>{applications.length}</span>
                  <span className={styles.StatLabel}>Всего заявок</span>
                </div>
                <div className={styles.StatItem}>
                  <span className={styles.StatValue}>
                    {applications.filter(a => a.status === 'in-progress').length}
                  </span>
                  <span className={styles.StatLabel}>В работе</span>
                </div>
                <div className={styles.StatItem}>
                  <span className={styles.StatValue}>
                    {applications.filter(a => a.status === 'completed').length}
                  </span>
                  <span className={styles.StatLabel}>Выполнено</span>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.TabsSection}>
            <div className={styles.Tabs}>
              <button 
                className={`${styles.Tab} ${activeTab === 'applications' ? styles.Active : ''}`}
                onClick={() => {
                  setActiveTab('applications');
                  loadApplications();
                }}
              >
                <img src={padIcon} alt="applications"/> Мои заявки
              </button>
              <button 
                className={`${styles.Tab} ${activeTab === 'chats' ? styles.Active : ''}`}
                onClick={() => setActiveTab('chats')}
              >
                <img src={chatIcon} alt="chats"/> Чаты
              </button>
              <button 
                className={`${styles.Tab} ${activeTab === 'settings' ? styles.Active : ''}`}
                onClick={() => setActiveTab('settings')}
              >
                <img src={settingIcon} alt="settings"/> Настройки
              </button>
            </div>

            <div className={styles.TabContent}>
              {activeTab === 'applications' && (
                <div className={styles.ApplicationsList}>
                  {applications.length > 0 ? (
                    applications.map(app => {
                      const status = getStatusBadge(app.status);
                      return (
                        <div key={app.id} className={styles.ApplicationCard}>
                          <div className={styles.AppHeader}>
                            <div>
                              <span className={styles.AppType}>
                                {getFormTypeName(app.type)}
                              </span>
                              <span className={styles.AppDate}>
                                {new Date(app.created_at).toLocaleDateString('ru-RU')}
                              </span>
                            </div>
                            <span 
                              className={styles.AppStatus}
                              style={{ backgroundColor: status.bg, color: status.color }}
                            >
                              {status.text}
                            </span>
                          </div>
                          <p className={styles.AppAddress}>{app.address}</p>
                          <p className={styles.AppDescription}>{app.description}</p>
                          <div className={styles.AppFooter}>
                            <button 
                              className={styles.ChatButton}
                              onClick={() => openChat(app.id, app.type)}
                            >
                              Чат с оператором
                            </button>
                            <span className={styles.AppId}>Заявка №{app.id}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className={styles.EmptyState}>
                      <span>📋</span>
                      <p>У вас пока нет заявок</p>
                      <button onClick={() => navigate('/')}>Создать заявку</button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'chats' && (
                <div className={styles.ChatsList}>
                  {applications.filter(app => app.status !== 'completed').length > 0 ? (
                    applications
                      .filter(app => app.status !== 'completed')
                      .map(app => (
                        <div key={app.id} className={styles.ChatCard}>
                          <div className={styles.ChatInfo}>
                            <div className={styles.ChatType}>
                              {getFormTypeName(app.type)}
                            </div>
                            <div className={styles.ChatAddress}>{app.address}</div>
                            <div className={styles.ChatStatus}>
                              <span className={styles.StatusDot}></span>
                              Активный чат
                            </div>
                          </div>
                          <button 
                            className={styles.OpenChatButton}
                            onClick={() => openChat(app.id, app.type)}
                          >
                            Открыть чат
                          </button>
                        </div>
                      ))
                  ) : (
                    <div className={styles.EmptyState}>
                      <span>💬</span>
                      <p>Нет активных чатов</p>
                      <small>Чаты появляются после создания заявки</small>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'settings' && (
                <div className={styles.SettingsSection}>
                  <div className={styles.SettingsCard}>
                    <h3>Смена пароля</h3>
                    
                    {passwordError && (
                      <div className={styles.ErrorMessage}>{passwordError}</div>
                    )}
                    {passwordSuccess && (
                      <div className={styles.SuccessMessage}>{passwordSuccess}</div>
                    )}
                    
                    <form onSubmit={handleChangePassword} className={styles.PasswordForm}>
                      <input
                        type="password"
                        name="oldPassword"
                        placeholder="Текущий пароль"
                        value={passwordData.oldPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.PasswordInput}
                        required
                      />
                      <input
                        type="password"
                        name="newPassword"
                        placeholder="Новый пароль (мин. 6 символов)"
                        value={passwordData.newPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.PasswordInput}
                        required
                      />
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Подтвердите новый пароль"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordInputChange}
                        className={styles.PasswordInput}
                        required
                      />
                      <button type="submit" className={styles.ChangePasswordButton}>
                        Сменить пароль
                      </button>
                    </form>
                  </div>
                  
                  <div className={styles.SettingsCard}>
                    <h3>Уведомления</h3>
                    <label className={styles.Checkbox}>
                      <input type="checkbox" defaultChecked />
                      Получать уведомления о статусе заявок
                    </label>
                    <label className={styles.Checkbox}>
                      <input type="checkbox" defaultChecked />
                      Получать новости и обновления
                    </label>
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </ContainerComponent>
      
      <ChatModal 
        isOpen={selectedChat !== null}
        onClose={closeChat}
        formId={selectedChat}
        formType={selectedFormType}
        applicationStatus={applications.find(app => app.id === selectedChat)?.status} 
      />
      
      <Footer />
    </>
  );
};

export default ProfilePage;
