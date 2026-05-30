import styles from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <>
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    </>
  );
};

export default Loader;
