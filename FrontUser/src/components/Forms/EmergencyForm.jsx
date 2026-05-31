import React, { useState, useEffect } from 'react';
import { form_create } from '../../API/FormService.js';
import styles from './EmergencyForm.module.css';
import Alert, {showAlert} from '../UI/Alert/Alert.jsx';
import emergencyIcon from '../../assets/icon-wrench.svg';

const EmergencyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
  });
  const form_type = "emergency"

  useEffect(() => {
    try {
      const store = localStorage.getItem('store');
      if (store) {
        const parsedStore = JSON.parse(store);
        const user = parsedStore?.user;
        
        if (user) {
          const fullName = `${user.lastName || ''} ${user.firstName || ''}`.trim();
          
          setFormData(prev => ({
            ...prev,
            name: fullName || '',
            address: user.address || '',
            phone: user.phone || ''
          }));
          
          console.log('Автозаполнение данных:', {
            name: fullName,
            address: user.address,
            phone: user.phone
          });
        } else {
          console.log('Нет данных пользователя в store');
        }
      } else {
        console.log('Нет store в localStorage');
      }
    } catch (error) {
      console.error('Ошибка загрузки данных пользователя:', error);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      console.log(localStorage.getItem('token'));
      if (!token) {
        showAlert('Войдите в аккаунт', 'error', 6000);
        return;
      }

      const result = await form_create.pullForm(
        form_type,
        formData.address,
        formData.phone,
        formData.description,
      );

      
      showAlert('Аварийная заявка принята! Бригада уже в пути.', 'success', 6000);
      
      // Очищаем только адрес и описание, но оставляем ФИО и телефон
      setFormData(prev => ({ 
        ...prev, 
        address: '', 
        description: '' 
      }));
      
    } catch (error) {
      console.error('Ошибка отправки:', error);
      showAlert('Ошибка при отправке. Пожалуйста, позвоните по телефону 8 (800) 123-45-67', 'error', 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.FormWrapper}>
      <div className={styles.FormHeader}>
        <div className={styles.HeaderIcon}>
          <img src={emergencyIcon} alt="emergency" />
        </div>
        <div className={styles.HeaderText}>
          <h2 className={styles.FormTitle}>Протечка / Аварийная ситуация</h2>
          <Alert/>
          <p className={styles.FormSubtitle}>
            Заполните форму — бригада выедет немедленно
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.Form}>
        {/* ФИО */}
        <div className={styles.FormGroup}>
          <label htmlFor="name" className={styles.Label}>
            ФИО <span className={styles.Required}>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Иванов Иван Иванович"
            className={styles.Input}
            required
            disabled={isSubmitting}
          />
          <small className={styles.Hint}>Ваше полное имя</small>
        </div>

        {/* Адрес */}
        <div className={styles.FormGroup}>
          <label htmlFor="address" className={styles.Label}>
            Точный адрес <span className={styles.Required}>*</span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="ул. Примерная, д. 10, кв. 45"
            className={styles.Input}
            required
            disabled={isSubmitting}
          />
          <small className={styles.Hint}>Укажите улицу, номер дома и квартиру</small>
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="phone" className={styles.Label}>
            Контактный телефон <span className={styles.Required}>*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+7 (XXX) XXX-XX-XX"
            className={styles.Input}
            required
            disabled={isSubmitting}
          />
          <small className={styles.Hint}>Для связи с бригадой</small>
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="description" className={styles.Label}>
            Описание проблемы <span className={styles.Required}>*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите, что произошло: где течёт, как сильно, есть ли угроза затопления соседей..."
            className={styles.Textarea}
            rows="5"
            required
            disabled={isSubmitting}
          />
          <small className={styles.Hint}>
            Чем подробнее описание, тем быстрее мы сможем помочь
          </small>
        </div>

        <button 
          type="submit" 
          className={styles.SubmitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.Spinner}></span>
              Отправка...
            </>
          ) : (
            <>
              Вызвать аварийную бригаду
            </>
          )}
        </button>

        <p className={styles.UrgentNote}>
           Срочно? Звоните: <strong>7 (949) 306-41-35</strong> (круглосуточно)
        </p>
      </form>
    </div>
  );
};

export default EmergencyForm;
