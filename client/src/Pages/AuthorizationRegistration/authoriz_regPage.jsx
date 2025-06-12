import { useState, useContext } from 'react';
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
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setErrors({});
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateLoginForm = () => {
    const newErrors = {};
    
    if (!loginData.login.trim()) {
      newErrors.login = 'Поле "Логин или email" обязательно для заполнения';
    }
    if (!loginData.password.trim()) {
      newErrors.password = 'Поле "Пароль" обязательно для заполнения';
    } else if (loginData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors = {};
    
    if (!registerData.login.trim()) {
      newErrors.login = 'Поле "Логин" обязательно для заполнения';
    } else if (registerData.login.length < 3) {
      newErrors.login = 'Логин должен содержать минимум 3 символа';
    }
    
    if (!registerData.email.trim()) {
      newErrors.email = 'Поле "Email" обязательно для заполнения';
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      newErrors.email = 'Введите корректный email';
    }
    
    if (!registerData.password.trim()) {
      newErrors.password = 'Поле "Пароль" обязательно для заполнения';
    } else if (registerData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

return (
    <div className="auth-page">
      <button 
        onClick={() => navigate(-1)} 
        className="back-button-absolute"
      >
        <i className="fas fa-arrow-left"></i> Назад
      </button>
      
      <ToastContainer position="top-right" autoClose={5000} />
      <div className={`container ${isSignUp ? 'active' : ''}`} id="container">
        <div className={`form-container ${isSignUp ? 'sign-up' : 'sign-in'}`}>
          {isSignUp ? (
            <form onSubmit={handleRegisterSubmit}>
              <h1 className="heading">Создать аккаунт</h1>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="login"
                  placeholder="Логин"
                  value={registerData.login}
                  onChange={handleRegisterChange}
                  className={errors.login ? 'error' : ''}
                />
                {errors.login && <span className="error-message">{errors.login}</span>}
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль (минимум 6 символов)"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <button type="submit" disabled={isLoading} className="auth-button">
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
              <button type="button" className="toggle-link" onClick={toggleForm}>
                Уже есть аккаунт? Войти
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit}>
              <h1 className="heading">Авторизация</h1>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="login"
                  placeholder="Логин или email"
                  value={loginData.login}
                  onChange={handleLoginChange}
                  className={errors.login ? 'error' : ''}
                />
                {errors.login && <span className="error-message">{errors.login}</span>}
              </div>
              <div className="input-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>
              <button
                type="button"
                onClick={() => toast.info('Функция восстановления пароля пока недоступна')}
                className="forgot-password"
              >
                Забыли пароль?
              </button>
              <button type="submit" disabled={isLoading} className="auth-button">
                {isLoading ? 'Вход...' : 'Войти'}
              </button>
              <button type="button" className="toggle-link" onClick={toggleForm}>
                Нет аккаунта? Зарегистрироваться
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