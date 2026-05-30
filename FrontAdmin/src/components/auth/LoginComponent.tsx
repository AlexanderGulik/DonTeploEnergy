import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../store/user/user.slice';
import { LoginCredentialsI } from '../../types/user.types';
import LoginForm from './LoginForm';
import styles from './Login.module.css';
import { useUser } from '../../hooks/useUser';
import { AppDispatch } from '../../store';

const LoginComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { status, error, store, adminId } = useUser();
  const isLoading = status === 'loading';
  const hasRedirected = useRef(false);

  const handleLogin = async (credentials: LoginCredentialsI) => {
    console.log('Attempting login...');
    try {
      const result = await dispatch(loginUser(credentials)).unwrap();
      console.log('Login successful, redirecting...');
      navigate('/admin/forms');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  useEffect(() => {
    console.log('Store.isAuthenticated:', store?.isAuthenticated);
    console.log('Store.user:', store?.user);
    
    if (store?.isAuthenticated && store?.user && !hasRedirected.current) {
      console.log('Redirecting to /admin/forms');
      hasRedirected.current = true;
      navigate('/admin/forms');
    }
  }, [store?.isAuthenticated, store?.user, navigate]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <h1>Донбасс Теплоэнерго</h1>
        </div>

        <LoginForm onSubmit={handleLogin} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default LoginComponent;
