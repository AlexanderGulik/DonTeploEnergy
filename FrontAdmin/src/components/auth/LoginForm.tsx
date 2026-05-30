import React from 'react';
import { LoginCredentialsI } from '../../types/user.types';
import styles from './Login.module.css';
import EyeOpenIcon from '../UI/Icons/EyeOpenIcon';
import EyeClosedIcon from '../UI/Icons/EyeClosedIcon';
import ErrorIcon from '../UI/Icons/ErrorIcon';
import { useLoginForm } from '../../hooks/local/useLoginForm';

interface LoginFormProps {
  onSubmit: (credentials: LoginCredentialsI) => void;
  isLoading: boolean;
  error: string | null;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading, error }) => {
  const { showPassword, credentials, formErrors, handleChange, handleSubmit, togglePasswordVisibility } = useLoginForm(onSubmit);
  

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      {error && (
        <div className={styles.errorMessage}>
          <ErrorIcon />
          {error}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="name">Имя пользователя</label>
        <input type="text" id="name" name="name" className={styles.formControl} value={credentials.name} onChange={handleChange} disabled={isLoading} />
        {formErrors.name && (
          <div className={styles.errorMessage}>
            <ErrorIcon />
            {formErrors.name}
          </div>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Пароль</label>
        <div className={styles.passwordField}>
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            className={styles.formControl}
            value={credentials.password}
            onChange={handleChange}
            disabled={isLoading}
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={togglePasswordVisibility}
            tabIndex={-1}
            aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
          >
            {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
          </button>
        </div>
        {formErrors.password && (
          <div className={styles.errorMessage}>
            <ErrorIcon />
            {formErrors.password}
          </div>
        )}
      </div>

      <button type="submit" className={styles.loginButton} disabled={isLoading}>
        {isLoading ? (
          <>
            <span className={styles.loadingSpinner}></span>
            Авторизация...
          </>
        ) : (
          'Войти'
        )}
      </button>
    </form>
  );
};

export default LoginForm;
