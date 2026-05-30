import React, { useEffect, useState } from 'react';
import ContainerComponent from '../../components/Layout/ContainerComponent';
import Header from '../../components/UI/Header/Header.jsx';
import Footer from '../../components/UI/Footer/Footer.jsx';
import styles from './FAQPage.module.css';
import faqData from '../../data/faqData';

import questIcon from '../../assets/icon-questuion.svg';
import phoneIcon from '../../assets/icon-phone-call-5068731.svg';
import locationIcon from '../../assets/icon-marker.svg';
import emailIcon from '../../assets/icon-mail.svg';
import chatIcon from '../../assets/icon-chat.svg';
import manIcon from '../../assets/icon-man.svg';
import searchIcon from '../../assets/icon-search.svg';
import bookOpenIcon from '../../assets/icon-book-open.svg';
import bookCloseIcon from '../../assets/icon-book-close.svg';

const FAQPage = () => {
  const [openSections, setOpenSections] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredFAQs, setFilteredFAQs] = useState(faqData);

  const categories = ['all', ...new Set(faqData.map(faq => faq.category))];

  useEffect(() => {
    let filtered = faqData;
    
    if (searchQuery) {
      filtered = filtered.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }
    
    setFilteredFAQs(filtered);
  }, [searchQuery, selectedCategory]);

  const toggleSection = (id) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const expandAll = () => {
    const allOpen = {};
    filteredFAQs.forEach(faq => {
      allOpen[faq.id] = true;
    });
    setOpenSections(allOpen);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const botUsername = 'donteploenergo_bot';
  const phoneNumber = '+7 (856) 305-46-33';
  const email = 'dgts@teplodn.ru';

  const openBot = () => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/${botUsername}`);
    } else {
      window.open(`https://t.me/${botUsername}`, '_blank');
    }
  };

  const callOperator = () => {
    window.location.href = `tel:${phoneNumber.replace(/[^0-9+]/g, '')}`;
  };

  const sendEmail = () => {
    window.location.href = `mailto:${email}`;
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={index} className={styles.Highlight}>{part}</mark>
        : part
    );
  };

  return (
      <>
      <Header title="Вопросы и ответы" />
    <ContainerComponent>
      
      <main className={styles.Main}>
        <section className={styles.HeroSection}>
          <div className={styles.HeroContent}>
            <h1 className={styles.HeroTitle}>
              <span className={styles.TitleIcon}><img src = {questIcon}/></span>
              Часто задаваемые вопросы
            </h1>
            <p className={styles.HeroSubtitle}>
              Найдите ответ на свой вопрос или свяжитесь с нами для получения помощи
            </p>
          </div>
        </section>



        <section className={styles.ContactSection}>
          <div className={styles.ContactGrid}>
            <div className={styles.ContactCard}>
              <div className={styles.ContactIcon}><img src={chatIcon}/></div>
              <div className={styles.ContactInfo}>
                <h3>Telegram бот</h3>
                <p>Быстрые ответы 24/7</p>
                <button onClick={openBot} className={styles.ContactButton}>
                  @{botUsername} 
                </button>
              </div>
            </div>

            <div className={styles.ContactCard}>
                <div className={styles.ContactIcon}><img src ={phoneIcon}/></div>
              <div className={styles.ContactInfo}>
                <h3>Телефон</h3>
                <p>Круглосуточная поддержка</p>
                <button onClick={callOperator} className={styles.ContactButton}>
                  {phoneNumber} 
                </button>
              </div>
            </div>

            <div className={styles.ContactCard}>
              <div className={styles.ContactIcon}><img src={emailIcon}/></div>
              <div className={styles.ContactInfo}>
                <h3>Email</h3>
                <p>Ответ в течение 24 часов</p>
                <button onClick={sendEmail} className={styles.ContactButton}>
                  {email} 
                </button>
              </div>
            </div>

            <div className={styles.ContactCard}>
              <div className={styles.ContactIcon}><img src={locationIcon}/></div>
              <div className={styles.ContactInfo}>
                <h3>Офис</h3>
                <p>г. Донецк, ул. Теплая, 15</p>
                <span className={styles.WorkHours}>Пн-Пт: 8:00 - 20:00</span>
              </div>
            </div>
          </div>
        </section>

        {/* Поиск и фильтры */}
        <section className={styles.SearchSection}>
          <div className={styles.SearchWrapper}>
            <span className={styles.SearchIcon}><img src = {searchIcon}/></span>
            <input
              type="text"
              placeholder="Поиск по вопросам и ответам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.SearchInput}
            />
            {searchQuery && (
              <button className={styles.ClearButton} onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>

          <div className={styles.FiltersBar}>
            <div className={styles.Categories}>
              {categories.map(category => (
                <button
                  key={category}
                  className={`${styles.CategoryButton} ${selectedCategory === category ? styles.Active : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category === 'all' ? 'Все вопросы' : category}
                </button>
              ))}
            </div>

            <div className={styles.Actions}>
              <button onClick={expandAll} className={styles.ActionButton}>
                <img src={bookOpenIcon}/> Развернуть все
              </button>
              <button onClick={collapseAll} className={styles.ActionButton}>
                <img src={bookCloseIcon}/> Свернуть все
              </button>
            </div>
          </div>

          <div className={styles.ResultsInfo}>
            Найдено вопросов: {filteredFAQs.length}
          </div>
        </section>

        {/* Список FAQ */}
        <section className={styles.FAQSection}>
          {filteredFAQs.length > 0 ? (
            <div className={styles.Accordion}>
              {filteredFAQs.map(faq => (
                <div key={faq.id} className={styles.Section}>
                  <button
                    className={styles.SectionHeader}
                    onClick={() => toggleSection(faq.id)}
                    aria-expanded={openSections[faq.id]}
                  >
                    <div className={styles.QuestionWrapper}>
                      {faq.category && (
                        <span className={styles.CategoryBadge}>{faq.category}</span>
                      )}
                      <span className={styles.Question}>
                        {searchQuery 
                          ? highlightText(faq.question, searchQuery)
                          : faq.question
                        }
                      </span>
                    </div>
                    <span className={styles.Arrow}>
                      {openSections[faq.id] ? '−' : '+'}
                    </span>
                  </button>

                  {openSections[faq.id] && (
                    <div className={styles.Answer}>
                      <div className={styles.AnswerContent}>
                        {searchQuery 
                          ? highlightText(faq.answer, searchQuery)
                          : faq.answer
                        }
                      </div>
                      {faq.links && (
                        <div className={styles.RelatedLinks}>
                          <strong>Полезные ссылки:</strong>
                          <ul>
                            {faq.links.map((link, index) => (
                              <li key={index}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                  {link.text}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.EmptyState}>
              <span className={styles.EmptyIcon}><img src = {searchIcon}/></span>
              <h3>Ничего не найдено</h3>
              <p>Попробуйте изменить поисковый запрос или выберите другую категорию</p>
              <button 
                className={styles.ResetButton}
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </section>

        {/* Секция "Не нашли ответ?" */}
        <section className={styles.CTASection}>
          <div className={styles.CTACard}>
            <div className={styles.CTAContent}>
              <h2>Не нашли ответ на свой вопрос?</h2>
              <p>Свяжитесь с нами любым удобным способом, и мы обязательно поможем!</p>
              <div className={styles.CTAButtons}>
                <button onClick={openBot} className={styles.PrimaryCTA}>
                  <img src = {chatIcon}/> Написать в Telegram
                </button>
                <button onClick={callOperator} className={styles.SecondaryCTA}>
                  <img src = {phoneIcon}/> Позвонить оператору
                </button>
              </div>
            </div>
            <div className={styles.CTAIllustration}>
              <img src ={manIcon}/>
            </div>
          </div>
        </section>
      </main>

    </ContainerComponent>

      <Footer />
    </>
  );
};

export default FAQPage;
