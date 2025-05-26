import React from 'react';
import './homePage.css';
import Header from '../../components/Header/headerPage';
import Footer from '../../components/Footer/footerPage';
import academic from '../../assets/images/academic.png';
import calendar from '../../assets/images/calendar.png';
import integration from '../../assets/images/integration.png';
import social from '../../assets/images/social_vz.png';
import folder from '../../assets/images/folder.png';
import security from '../../assets/images/security.png';

const Home = () => {
  return (
    <>
      <Header />
      <div className="container-content-1">
        <div className="text-content">
          <div className="greeting">
            <h3 className="title-text-content">Добро пожаловать на <br />Cyber Cats</h3>
            <p className="def-greeting">
              Здесь начинается ваше увлекательное путешествие в мир образования, где каждый шаг приносит не только знания, но и радость от игры. Мы создали этот веб-ресурс, чтобы помочь вам повысить мотивацию и сделать учебный процесс более интересным и интерактивным.
            </p>
          </div>
          <div className="description-users">
            <h3 className="title-text-content">Присоединяйтесь к нам и откройте для себя</h3>
            <ul className="points-desc">
              <li className="points">
                <strong>Захватывающие квесты и мероприятия:</strong> Проходите задания, зарабатывайте баллы и открывайте новые возможности.
              </li>
              <li className="points">
                <strong>Соревнования и лидерборды: </strong>Соревнуйтесь с друзьями и одногрупниками, чтобы стать лучшим.
              </li>
              <li className="points">
                <strong>Достижения и награды:</strong> Получайте награды за свои успехи и достижения.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="advantages-section">
        <h2>Наши преимущества</h2>
        <div className="advantages-list">
          <div className="advantage-block">
            <img src={academic} alt="Удобство" />
            <h3><strong>Удобство и простота использования</strong></h3>
            <p>
              Cyber Cats предлагает интуитивно понятный интерфейс, который позволяет студентам легко находить и отмечать мероприятия.
            </p>
          </div>
          <div className="advantage-block">
            <img src={calendar} alt="Централизация" />
            <h3><strong>Централизованная информация</strong></h3>
            <p>
              Все мероприятия собраны в одном месте. Это помогает студентам не пропустить важные события.
            </p>
          </div>
          <div className="advantage-block">
            <img src={integration} alt="Интеграция" />
            <h3><strong>Интеграция с учебным расписанием</strong></h3>
            <p>
              Отметки мероприятий интегрируются с учебным расписанием, что помогает избежать конфликтов.
            </p>
          </div>
          <div className="advantage-block">
            <img src={social} alt="Социальное взаимодействие" />
            <h3><strong>Социальное взаимодействие</strong></h3>
            <p>
              Студенты могут видеть, кто еще планирует посетить мероприятие, что способствует новым связям.
            </p>
          </div>
          <div className="advantage-block">
            <img src={folder} alt="Дополнительная информация" />
            <h3><strong>Доступ к дополнительной информации</strong></h3>
            <p>
              Cyber Cats предоставляет описание, место проведения и контактные данные организаторов.
            </p>
          </div>
          <div className="advantage-block">
            <img src={security} alt="Безопасность" />
            <h3><strong>Безопасность и надежность</strong></h3>
            <p>
              Все данные защищены современными методами шифрования, что гарантирует конфиденциальность.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;