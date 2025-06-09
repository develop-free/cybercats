import './teacherPage.css';
import Header from '../../components/Header/headerPage';
import Footer from '../../components/Footer/footerPage';

const Teachers = () => {
  return (
    <>
      <Header />
      <div className="teachers-container">
        <div className="intro-section">
          <div className="intro-grid">
            <div className="intro-text-block">
              <h2 className="section-title">Формируйте будущее с Cyber Cats!</h2>
              <p className="intro-text">
                Уважаемые преподаватели, на платформе Cyber Cats вы становитесь архитекторами образовательного процесса. Управляйте студентами, создавайте вдохновляющие мероприятия и награждайте за успехи, чтобы мотивировать новое поколение лидеров!
              </p>
            </div>
            <div className="intro-icon-block">
              <svg className="intro-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="4" width="20" height="14" rx="2" stroke="#512da8" strokeWidth="2"/>
                <line x1="2" y1="8" x2="22" y2="8" stroke="#512da8" strokeWidth="2"/>
                <circle cx="12" cy="12" r="2" fill="#512da8"/>
              </svg>
            </div>
          </div>
        </div>

        <div className="features-section">
          <h3 className="section-subtitle">Ваша роль в Cyber Cats</h3>
          <div className="features-carousel">
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" stroke="#512da8" strokeWidth="2"/>
                <path d="M6 20C6 17.79 8.69 16 12 16C15.31 16 18 17.79 18 20" stroke="#512da8" strokeWidth="2"/>
                <path d="M4 12C5.1 12 6 11.1 6 10C6 8.9 5.1 8 4 8C2.9 8 2 8.9 2 10C2 11.1 2.9 12 4 12Z" stroke="#512da8" strokeWidth="2"/>
                <path d="M20 12C21.1 12 22 11.1 22 10C22 8.9 21.1 8 20 8C18.9 8 18 8.9 18 10C18 11.1 18.9 12 20 12Z" stroke="#512da8" strokeWidth="2"/>
              </svg>
              <h4><strong>Управление студентами</strong></h4>
              <p>
                Добавляйте студентов, управляйте их профилями и следите за их прогрессом, чтобы поддерживать активное участие.
              </p>
            </div>
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="16" rx="2" stroke="#512da8" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="#512da8" strokeWidth="2"/>
                <line x1="9" y1="4" x2="9" y2="10" stroke="#512da8" strokeWidth="2"/>
                <line x1="15" y1="4" x2="15" y2="10" stroke="#512da8" strokeWidth="2"/>
                <circle cx="7" cy="14" r="1" fill="#512da8"/>
                <circle cx="12" cy="14" r="1" fill="#512da8"/>
                <circle cx="17" cy="14" r="1" fill="#512da8"/>
              </svg>
              <h4><strong>Создание мероприятий</strong></h4>
              <p>
                Организуйте квесты, семинары и соревнования, чтобы вовлечь студентов и сделать обучение увлекательным.
              </p>
            </div>
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z" stroke="#512da8" strokeWidth="2"/>
                <circle cx="12" cy="9" r="3" fill="#512da8"/>
              </svg>
              <h4><strong>Награды для рейтинга</strong></h4>
              <p>
                Присуждайте баллы и награды за достижения, формируя рейтинг и мотивируя студентов к успеху.
              </p>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h3 className="section-subtitle">Вдохновляйте и ведите к вершинам!</h3>
          <p className="cta-text">
            Ваша роль как преподавателя на Cyber Cats — это возможность зажечь искру в студентах. Создавайте уникальные мероприятия, награждайте за старания и помогайте каждому раскрыть свой потенциал, поднимая рейтинг всей платформы!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Teachers;