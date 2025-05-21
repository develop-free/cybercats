import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTelegram, faVk, faGoogle, faYandex } from '@fortawesome/free-brands-svg-icons';
import { registerUser, loginUser } from '../../API/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import './authoriz_regPage.css';

const Authorization = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loginData, setLoginData] = useState({ login: '', password: '' });
  const [registerData, setRegisterData] = useState({ login: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const validateLoginForm = () => {
    if (!loginData.login.trim()) {
      toast.error('Поле "Логин или email" обязательно для заполнения');
      return false;
    }
    if (!loginData.password.trim()) {
      toast.error('Поле "Пароль" обязательно для заполнения');
      return false;
    }
    if (loginData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    if (!registerData.login.trim()) {
      toast.error('Поле "Логин" обязательно для заполнения');
      return false;
    }
    if (registerData.login.length < 3) {
      toast.error('Логин должен содержать минимум 3 символа');
      return false;
    }
    if (!registerData.email.trim()) {
      toast.error('Поле "Email" обязательно для заполнения');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      toast.error('Введите корректный email');
      return false;
    }
    if (!registerData.password.trim()) {
      toast.error('Поле "Пароль" обязательно для заполнения');
      return false;
    }
    if (registerData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;

    setIsLoading(true);

    try {
      const response = await loginUser(loginData);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || 'Не получили токен от сервера');
      }

      toast.success('Авторизация успешна! Добро пожаловать!');
      localStorage.setItem('accessToken', response.data.accessToken);
      setAuth({
        isAuthenticated: true,
        user: {
          login: response.data.login,
          email: response.data.email,
          role: response.data.role || 'user'
        },
      });

      const role = response.data.role || 'user';
      if (role === 'admin') {
        navigate('/admin_dashboard/*');
      } else if (role === 'teacher') {
        navigate('/teacher_dashboard/*');
      } else {
        navigate('/personal_account/*');
      }
    } catch (error) {
      console.error('Ошибка авторизации:', error);
      const errorMessage = error.message || 'Ошибка авторизации. Проверьте логин и пароль.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;

    setIsLoading(true);

    try {
      const response = await registerUser(registerData);

      if (!response?.data?.accessToken) {
        throw new Error(response?.data?.message || 'Не получили токен от сервера');
      }

      toast.success('Регистрация успешна! Вход выполнен.');
      localStorage.setItem('accessToken', response.data.accessToken);
      setAuth({
        isAuthenticated: true,
        user: {
          login: registerData.login,
          email: registerData.email,
          role: response.data.role || 'user'
        },
      });

      const role = response.data.role || 'user';
      if (role === 'admin') {
        navigate('/admin_dashboard/*');
      } else if (role === 'teacher') {
        navigate('/teacher_dashboard/*');
      } else {
        navigate('/personal_account/*');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      const errorMessage = error.message || 'Ошибка регистрации. Проверьте данные.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const socialLinks = [
    { icon: faTelegram, url: 'https://telegram.org' },
    { icon: faVk, url: 'https://vk.com' },
    { icon: faGoogle, url: 'https://google.com' },
    { icon: faYandex, url: 'https://yandex.ru' },
  ];

  return (
    <div className="auth-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {isSignUp ? (
            <form onSubmit={handleRegisterSubmit}>
              <h1 className="heading">Создать аккаунт</h1>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Login with ${social.icon.iconName}`}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
              <span>или зарегистрироваться через Email и пароль</span>
              <input
                type="text"
                name="login"
                placeholder="Логин"
                value={registerData.login}
                onChange={handleRegisterChange}
                required
                minLength="3"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль (минимум 6 символов)"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                minLength="6"
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <h1 className="heading">Авторизация</h1>
              <div className="social-icons">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className="icon"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Login with ${social.icon.iconName}`}
                  >
                    <FontAwesomeIcon icon={social.icon} />
                  </a>
                ))}
              </div>
              <span>или войти через логин и пароль</span>
              <input
                type="text"
                name="login"
                placeholder="Логин (email или логин)"
                value={loginData.login}
                onChange={handleLoginChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Пароль"
                value={loginData.password}
                onChange={handleLoginChange}
                required
                minLength="6"
              />
              <button
                type="button"
                onClick={() => toast.info('Функция восстановления пароля пока недоступна')}
                className="forgot-password"
              >
                Забыли пароль?
              </button>
              <button type="submit" disabled={isLoading}>
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
            </form>
          )}
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>С возвращением!</h1>
              <p>Введите свои данные для входа</p>
              <button className="hidden" onClick={toggleForm}>
                Войти
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Привет, друг!</h1>
              <p>Зарегистрируйтесь для использования сайта</p>
              <button className="hidden" onClick={toggleForm}>
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authorization;