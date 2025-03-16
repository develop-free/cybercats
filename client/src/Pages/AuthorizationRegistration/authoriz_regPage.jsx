import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYandex, faTelegram, faVk, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { registerUser, loginUser } from '../../API/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import './authoriz_regPage.css';

const Authorization = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await registerUser(formData);
        toast.success('Регистрация успешна! Теперь вы можете войти в систему.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setIsSignUp(false); // Переключение на форму входа после успешной регистрации
      } else {
        const response = await loginUser(formData);
        toast.success('Авторизация успешна! Добро пожаловать!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        localStorage.setItem('user', JSON.stringify(response.user)); // Сохраняем пользователя в localStorage
        navigate('/personal_account'); // Перенаправляем на страницу личного кабинета
      }
    } catch (error) {
      toast.error(error.message || 'Произошла ошибка. Пожалуйста, попробуйте снова.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div>
      <ToastContainer />
      <button id="back-button" className="back-button" onClick={() => window.history.back()}>
        <i className="fa-solid fa-arrow-left"></i> Вернуться назад
      </button>
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {isSignUp ? (
            <form onSubmit={handleSubmit}>
              <h1 className='heading'>Создать аккаунт</h1>
              <div className="social-icons">
                <a href="https://telegram.org" className="icon" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTelegram} />
                </a>
                <a href="https://vk.com" className="icon" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faVk} />
                </a>
                <a href="https://google.com" className="icon" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faGoogle} />
                </a>
                <a href="https://yandex.ru" className="icon" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faYandex} />
                </a>
              </div>
              <span>или зарегистрироваться через Email и пароль</span>
              <input type="text" name="name" placeholder="Name" onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} />
              <button type="submit">Регистрация</button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <h1 className='heading'>Авторизация</h1>
              <div className="social-icons">
                <a href="https://telegram.org" className="icon" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faTelegram} /></a>
                <a href="https://vk.com" className="icon" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faVk} /></a>
                <a href="https://google.com" className="icon" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faGoogle} /></a>
                <a href="https://yandex.ru" className="icon" target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faYandex} /></a>
              </div>
              <span>или войти через Email и пароль</span>
              <input type="text" name="login" placeholder="Login" onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" onChange={handleChange} />
              <button
                type="button"
                onClick={() => toast.info('Функция восстановления пароля пока недоступна', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })}
                style={{ background: 'none', border: 'none', color: 'black', textTransform: 'capitalize', cursor: 'pointer' }}
              >
                Забыл пароль?
              </button>
              <button type="submit">Войти</button>
            </form>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>С возвращением!</h1>
              <p>Введите свои личные данные, чтобы использовать все возможности сайта</p>
              <button className="hidden" id="login" onClick={toggleForm}>Войти</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Привет, друг!</h1>
              <p>Зарегистрируйтесь, указав свои личные данные, чтобы использовать все возможности сайта</p>
              <button className="hidden" id="register" onClick={toggleForm}>Зарегистрироваться</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;