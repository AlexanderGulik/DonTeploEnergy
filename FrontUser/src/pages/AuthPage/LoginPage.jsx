// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header';
import Footer from '../../components/UI/Footer/Footer';
import styles from './Auth.module.css';

import emailIcon from '../../assets/icon-email.svg';
import lockIcon from '../../assets/icon-lock.svg';
import manIcon from '../../assets/icon-man.svg';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
      <Header title="Вход в личный кабинет" />
    <ContainerComponent>
      
      <main className={styles.Main}>
        <div className={styles.AuthWrapper}>
          <div className={styles.AuthCard}>
            <div className={styles.AuthHeader}>
            
              <h2 className={styles.AuthTitle}>Вход в аккаунт</h2>
              <p className={styles.AuthSubtitle}>
                Войдите для доступа к личному кабинету
              </p>
            </div>

            {error && (
              <div className={styles.ErrorAlert}>
                <span> error </span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.AuthForm}>
              <div className={styles.FormGroup}>
                <label htmlFor="email" className={styles.Label}>
                  Email <span className={styles.Required}>*</span>
                </label>
                <div className={styles.InputWrapper}>
                  <span className={styles.InputIcon}><img src = {emailIcon}/> </span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.ru"
                    className={styles.Input}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.FormGroup}>
                <label htmlFor="password" className={styles.Label}>
                  Пароль <span className={styles.Required}>*</span>
                </label>
                <div className={styles.InputWrapper}>
                  <span className={styles.InputIcon}><img src = {lockIcon}/></span>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={styles.Input}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className={styles.FormOptions}>
                <label className={styles.Checkbox}>
                  <input type="checkbox" /> Запомнить меня
                </label>
                <Link to="/forgot-password" className={styles.ForgotLink}>
                  Забыли пароль?
                </Link>
              </div>

              <button 
                type="submit" 
                className={styles.SubmitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className={styles.Spinner}></span>
                    Вход...
                  </>
                ) : (
                  'Войти'
                )}
              </button>
            </form>

            <div className={styles.AuthFooter}>
              <p>Нет аккаунта?</p>
              <Link to="/register" className={styles.LinkButton}>
                Зарегистрироваться 
              </Link>
            </div>
          </div>

                 </div>
      </main>

    </ContainerComponent>

      <Footer />
    </>
  );
};

export default LoginPage;
