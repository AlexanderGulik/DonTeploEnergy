import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router';
import styles from './Sidebar.module.css';
import { navItems } from '../../config/nav.config.tsx';
import MenuIcon from '../UI/Icons/MenuIcon';
import { useUser } from '../../hooks/useUser';
import { useActions } from '../../hooks/useActions';
import { AuthService } from '../../API/AuthService';
import LoadingSpinner from '../UI/Loader/LoadingSpinner';

const Sidebar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useUser().store; 
  const currentUser = user.user;
  const { logout } = useActions();

  const getFilteredNavItems = () => {
    if (!currentUser?.roles) return [];
    
    return navItems.filter(item => {
      if (!item.roles) return true;
           
      return item.roles.includes(currentUser.roles);
    });
  };

  const filteredNavItems = getFilteredNavItems();

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavItemClick = () => {
    if (window.innerWidth < 1200) {
      setMobileOpen(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await AuthService.logout();
      localStorage.removeItem('store');
      logout();
      navigate('/admin');
    } catch (error) {
      console.error('Ошибка при выходе из системы:', error);
      setError('Не удалось выйти из системы. Пожалуйста, попробуйте снова.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1200) {
        setMobileOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <button className={styles.mobileToggle} onClick={toggleMobileMenu}>
        <MenuIcon />
      </button>

      <div className={`${styles.mobileOverlay} ${mobileOpen ? styles.active : ''}`} onClick={toggleMobileMenu} />

      <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarCollapsed : ''} ${mobileOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/dashboard" className={styles.logoContainer}>
            <span className={styles.logo}>Дон. Тепло Сеть</span>
          </Link>
          <button className={styles.collapseBtn}></button>
        </div>

        <nav className={styles.navigation}>
          {filteredNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`${styles.navItem} ${location.pathname.startsWith(item.path) ? styles.active : ''}`}
              onClick={handleNavItemClick}
            >
              {item.icon}
              <span className={styles.navText}>{item.text}</span>
            </Link>
          ))}
        </nav>

        {currentUser && (
          <div className={styles.sidebarFooter}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>{currentUser.name?.charAt(0).toUpperCase() || 'A'}</div>
              <div>
                <div className={styles.userName}>{currentUser.name || 'Администратор'}</div>
                <div className={styles.userRole}>
                  {currentUser.roles === 'admin' ? 'Администратор' : 
                   currentUser.roles === 'moderator' ? 'Модератор' : 
                   currentUser.roles || 'Администратор'}
                </div>
              </div>
            </div>
            <div className={styles.logoutContainer}>
              <button className={styles.logoutButton} onClick={handleLogout} disabled={isLoading} aria-label="Выход из системы">
                {isLoading ? (
                  <>
                    <LoadingSpinner />
                    Выход...
                  </>
                ) : (
                  'Выйти'
                )}
              </button>
              {error && <div className={styles.errorMessage}>{error}</div>}
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
