import React from 'react';
import styles from './NotFound.module.css';

const NotFound: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>Страница не найдена</h2>
        <p className={styles.message}>
          Извините, запрашиваемая вами страница не существует или была перемещена. Возможно, вы ввели неправильный адрес или страница была удалена.
        </p>
      </div>
    </div>
  );
};

export default NotFound;
