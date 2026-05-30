import React from 'react';
import styles from './ContainerComponent.module.css';

const ContainerComponent = ({ children }) => {
  return <div className={styles.Container}>{children}</div>;
};

export default ContainerComponent;
