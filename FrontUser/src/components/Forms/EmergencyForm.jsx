import React, { useState } from 'react';
import { form_create } from '../../API/FormService.js';
import styles from './EmergencyForm.module.css';
import Alert, {showAlert} from '../UI/Alert/Alert.jsx';
import emergencyIcon from '../../assets/icon-wrench.svg';

const EmergencyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    phone: '',
    description: ''
  });
  const form_type = "emergency"

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
        alter("войдите в аккаунт")
        return;
      }

      const result = await form_create.pullForm(
        form_type,
        formData.address,
        formData.phone,
        formData.description,
      );

      
      showAlert('Аварийная заявка принята! Бригада уже в пути.',  'success', 6000);
      
      setFormData({ address: '', phone: '', description: '' });
      
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
        <div className={styles.HeaderIcon}><img src = {emergencyIcon}/></div>
        <div className={styles.HeaderText}>
          <h2 className={styles.FormTitle}>Протечка / Аварийная ситуация</h2>
            <Alert/>
          <p className={styles.FormSubtitle}>
            Заполните форму — бригада выедет немедленно
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.Form}>
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
           Срочно? Звоните: <strong>8 (800) 123-45-67</strong> (круглосуточно)
        </p>
      </form>
    </div>
  );
};

export default EmergencyForm;
