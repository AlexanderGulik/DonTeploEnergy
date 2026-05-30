import React, { useState, useEffect } from 'react';
import styles from './Alert.module.css';

let globalShowAlert = null;

export const showAlert = (message, type = 'info', duration = 7000) => {
  if (globalShowAlert) {
    globalShowAlert(message, type, duration);
  }
};

const Alert = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    globalShowAlert = (message, type, duration) => {
      const id = Date.now();
      setAlerts(prev => [...prev, { id, message, type, duration }]);
      
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== id));
      }, duration);
    };
  }, []);

  const getAlertClass = (type) => {
    switch(type) {
      case 'success': return styles.success;
      case 'error': return styles.error;
      case 'warning': return styles.warning;
      case 'info':
      default: return styles.info;
    }
  };

  return (
    <div className={styles.alertContainer}>
      {alerts.map(alert => (
        <div 
          key={alert.id} 
          className={`${styles.alert} ${getAlertClass(alert.type)}`}
        >
          <span className={styles.message}>{alert.message}</span>
          <button 
            className={styles.closeBtn}
            onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Alert;
