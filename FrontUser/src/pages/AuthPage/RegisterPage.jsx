import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../API/AuthService';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header';
import Footer from '../../components/UI/Footer/Footer';
import styles from './Auth.module.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    district: '',  // оставляем пустую строку для начального состояния
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const data = await authAPI.getDistricts();
      console.log('Districts:', data);
      setDistricts(data);
    } catch (err) {
      console.error('Failed to load districts:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
    if (name === 'district' && value !== '') {
      newValue = Number(value);
    }
    
    setFormData({ ...formData, [name]: newValue });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return false;
    }
    if (!formData.district) {
      setError('Выберите район');
      return false;
    }
    return true;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setLoading(true);
  setError('');

  try {
    const { confirmPassword, ...registerData } = formData;
    console.log('Sending data:', registerData);
    
    await register(registerData);
    
    setTimeout(() => {
      navigate('/profile', { replace: true });
    }, 100);
  } catch (err) {
    console.error('Registration error:', err.response?.data);
    setError(err.response?.data?.message || 'Ошибка при регистрации');
    setLoading(false);
  }
};

  return (
    <>
      <Header title="Регистрация" />
      <ContainerComponent>
        <main className={styles.Main}>
          <div className={styles.AuthWrapper}>
            <div className={styles.AuthCard}>
              <div className={styles.AuthHeader}>
                <h2 className={styles.AuthTitle}>Регистрация</h2>
                <p className={styles.AuthSubtitle}>
                  Создайте аккаунт для доступа к личному кабинету
                </p>
              </div>

              {error && (
                <div className={styles.ErrorAlert}>
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className={styles.AuthForm}>
                <div className={styles.FormRow}>
                  <div className={styles.FormGroup}>
                    <label htmlFor="firstname" className={styles.Label}>
                      Имя <span className={styles.Required}>*</span>
                    </label>
                    <input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Иван"
                      className={styles.Input}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className={styles.FormGroup}>
                    <label htmlFor="lastname" className={styles.Label}>
                      Фамилия
                    </label>
                    <input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Иванов"
                      className={styles.Input}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className={styles.FormGroup}>
                  <label htmlFor="email" className={styles.Label}>
                    Email <span className={styles.Required}>*</span>
                  </label>
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

                <div className={styles.FormGroup}>
                  <label htmlFor="phone" className={styles.Label}>
                    Телефон
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+7 (XXX) XXX-XX-XX"
                    className={styles.Input}
                    disabled={loading}
                  />
                </div>

                <div className={styles.FormGroup}>
                  <label htmlFor="district" className={styles.Label}>
                    Район <span className={styles.Required}>*</span>
                  </label>
                  <select
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    className={styles.Select}
                    required
                    disabled={loading}
                  >
                    <option value="">Выберите район</option>
                    {districts.map(d => (
                      <option key={d.id_district} value={d.id_district}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.FormGroup}>
                  <label htmlFor="address" className={styles.Label}>
                    Адрес
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="ул. Примерная, д. 10, кв. 45"
                    className={styles.Input}
                    disabled={loading}
                  />
                </div>

                <div className={styles.FormRow}>
                  <div className={styles.FormGroup}>
                    <label htmlFor="password" className={styles.Label}>
                      Пароль <span className={styles.Required}>*</span>
                    </label>
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

                  <div className={styles.FormGroup}>
                    <label htmlFor="confirmPassword" className={styles.Label}>
                      Подтверждение <span className={styles.Required}>*</span>
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={styles.Input}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className={styles.SubmitButton}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className={styles.Spinner}></span>
                      Регистрация...
                    </>
                  ) : (
                    'Зарегистрироваться'
                  )}
                </button>
              </form>

              <div className={styles.AuthFooter}>
                <p>Уже есть аккаунт?</p>
                <Link to="/login" className={styles.LinkButton}>
                  Войти 
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

export default RegisterPage;
