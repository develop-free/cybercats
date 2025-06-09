import './studentPage.css';
import Header from '../../components/Header/headerPage';
import Footer from '../../components/Footer/footerPage';

const Students = () => {
  return (
    <>
      <Header />
      <div className="students-container">
        <div className="intro-section">
          <h2 className="section-title">Ваш путь к успеху с Cyber Cats!</h2>
          <p className="intro-text">
            Cyber Cats — это платформа, где каждый студент становится героем своей учебной истории. Участвуйте в захватывающих мероприятиях, зарабатывайте баллы и поднимайтесь на вершину рейтинга, чтобы доказать, что вы лучший в нашем сообществе!
          </p>
        </div>

        <div className="features-section">
          <h3 className="section-subtitle">Почему Cyber Cats?</h3>
          <div className="features-list">
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h4><strong>Баллы за каждое мероприятие</strong></h4>
              <p>
                Участвуйте в квестах, мастер-классах и соревнованиях, чтобы зарабатывать баллы. Чем активнее вы участвуете, тем выше ваш рейтинг!
              </p>
            </div>
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" fill="#512da8"/>
              </svg>
              <h4><strong>Общий рейтинг студентов</strong></h4>
              <p>
                Ваши баллы суммируются в общем рейтинге. Соревнуйтесь с другими студентами и стремитесь к вершине лидерборда!
              </p>
            </div>
            <div className="feature-block">
              <svg className="feature-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke="#512da8" strokeWidth="2"/>
                <path d="M9 15L7 22H17L15 15" stroke="#512da8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="8" y="20" width="8" height="2" fill="#512da8"/>
              </svg>
              <h4><strong>Слава лидера</strong></h4>
              <p>
                Станьте первым в рейтинге и получите эксклюзивные награды, признание сообщества и статус легенды Cyber Cats!
              </p>
            </div>
          </div>
        </div>

        <div className="leaderboard-highlight">
          <h3 className="section-subtitle">Станьте номером один!</h3>
          <p className="highlight-text">
            Первое место в рейтинге Cyber Cats — это не просто цифра, это символ вашего упорства и стремления к совершенству. Каждый балл, заработанный на мероприятиях, приближает вас к вершине. Покажите всем, что вы достойны быть лучшим, и вдохновляйте других своим примером!
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Students;