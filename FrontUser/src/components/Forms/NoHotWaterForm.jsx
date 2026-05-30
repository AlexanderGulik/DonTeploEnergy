import React, { useState } from 'react';
import { form_create} from '../../API/FormService.js';
import styles from './FormStyles.module.css';

import Alert, {showAlert} from '../UI/Alert/Alert.jsx';

import waterIcon from '../../assets/icon-water.svg';
import clockIcon from '../../assets/icon-clock.svg';
const NoHotWaterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    description: ''
  });

  const form_type = "nowatter"

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = 1;

    try {
        const token = localStorage.getItem('token');
      if (!token) {
        showAlert('войдите в аккаунт','error', 6000);
        return;
      }

      const result = await form_create.pullForm(
        form_type,
        formData.address,
        formData.phone,
        formData.description,
      );
      
      showAlert('Заявка принята!', 'success', 6000);
      setFormData({ name: '', address: '', phone: '', description: '' });
      
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
        <div className={styles.HeaderIcon} style={{ 
          boxShadow: '0 4px 12px rgba(52, 152, 219, 0.2)'
        }}>
          <img src = {waterIcon}/>
        </div>
        <div className={styles.HeaderText}>
          <h2 className={styles.FormTitle}>Заявка на отсутствие горячей воды</h2>
          <Alert/>
          <p className={styles.FormSubtitle}>
            Заполните форму — мы проверим причину и сообщим сроки восстановления
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.Form}>
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
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="address" className={styles.Label}>
            Адрес <span className={styles.Required}>*</span>
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
        </div>

        <div className={styles.FormGroup}>
          <label htmlFor="description" className={styles.Label}>
            Описание проблемы
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Когда пропала горячая вода? Есть ли вода у соседей? Были ли объявления об отключении?"
            className={styles.Textarea}
            rows="4"
            disabled={isSubmitting}
          />
        </div>

        <button 
          type="submit" 
          className={styles.SubmitButton}
          style={{ 
            '--accent-color': '#3498db',
            background: 'linear-gradient(135deg, #3498db 0%, #5faee3 100%)',
            boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)'
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.Spinner}></span>
              Отправка...
            </>
          ) : (
            <>
               Отправить заявку
            </>
          )}
        </button>

        <p className={styles.InfoNote}>
          <img src = {clockIcon}/> Среднее время обработки заявки — до 2 часов.
        </p>
      </form>
    </div>
  );
};

export default NoHotWaterForm;
