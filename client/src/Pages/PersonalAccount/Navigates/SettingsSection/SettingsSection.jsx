// SettingsSection.jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cropper from 'react-easy-crop';
import './SettingsSection.css';
import ProfileAPI from '../../../../API/profileAPI';

const SettingsSection = ({ onProfileUpdate, initialData }) => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    last_name: initialData.lastName || '',
    first_name: initialData.firstName || '',
    middle_name: '',
    birth_date: '',
    department_id: '',
    group_id: '',
    login: '',
    email: '',
    avatar: initialData.avatar || null,
    admission_year: new Date().getFullYear(),
  });

  const [departments, setDepartments] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewUser, setIsNewUser] = useState(initialData.isNewUser || false);
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isCropModalOpen, setIsCropModalOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const isMounted = useRef(false);

  const validateName = (name) => {
    return /^[A-Za-zА-Яа-яЁё\s-]+$/.test(name);
  };

  const validateLogin = (login) => {
    return /^[A-Za-z0-9_-]{3,50}$/.test(login);
  };

  useEffect(() => {
    if (isMounted.current) return;
    isMounted.current = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.warn('Токен отсутствует, перенаправление на /login');
          navigate('/login');
          return;
        }

        const [profileResponse, departmentsResponse] = await Promise.all([
          ProfileAPI.getProfile().catch((err) => {
            if (err.response?.status === 401) {
              throw new Error('unauthorized');
            }
            return { isNewUser: true, data: null };
          }),
          ProfileAPI.getDepartments().catch(() => []),
        ]);

        setDepartments(
          Array.isArray(departmentsResponse?.data)
            ? departmentsResponse.data
            : Array.isArray(departmentsResponse)
              ? departmentsResponse
              : []
        );

        const profileData = profileResponse?.data || {};
        const isNewUserResponse = profileResponse?.isNewUser || false;

        const avatarUrl = profileData.avatar
          ? profileData.avatar.startsWith('http')
            ? profileData.avatar
            : `http://localhost:5000${profileData.avatar}`
          : null;

        setProfile({
          last_name: profileData.last_name || initialData.lastName || '',
          first_name: profileData.first_name || initialData.firstName || '',
          middle_name: profileData.middle_name || '',
          birth_date: profileData.birth_date?.split('T')[0] || '',
          department_id: profileData.department_id?._id || '',
          group_id: profileData.group_id?._id || '',
          login: profileData.login || '',
          email: profileData.email || '',
          avatar: avatarUrl,
          admission_year: profileData.admission_year || new Date().getFullYear(),
        });

        setIsNewUser(isNewUserResponse);
      } catch (err) {
        console.error('Ошибка в fetchData:', err);
        if (err.message === 'unauthorized') {
          console.warn('Ошибка 401, перенаправление на /login');
          localStorage.removeItem('accessToken');
          navigate('/login');
          return;
        }
        setError(
          err.message.includes('Network Error')
            ? 'Сервер недоступен. Проверьте подключение или попробуйте позже.'
            : 'Не удалось загрузить данные профиля. Пожалуйста, обновите страницу.'
        );
        setDepartments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted.current = false;
    };
  }, [initialData, navigate]);

  useEffect(() => {
    const fetchGroups = async () => {
      if (!profile.department_id) {
        setGroups([]);
        return;
      }

      try {
        const groupsResponse = await ProfileAPI.getGroups(profile.department_id);
        const normalizedGroups = Array.isArray(groupsResponse?.data)
          ? groupsResponse.data
          : Array.isArray(groupsResponse)
            ? groupsResponse
            : [];

        setGroups(normalizedGroups);
      } catch (err) {
        console.error('Ошибка получения групп:', err);
        setGroups([]);
      }
    };

    fetchGroups();
  }, [profile.department_id]);

  const handleChange = (e) => {
    const { id, value } = e.target;

    if (['last_name', 'first_name'].includes(id)) {
      if (value && !validateName(value)) {
        toast.error(`Поле "${id === 'last_name' ? 'Фамилия' : 'Имя'}" должно содержать только буквы, пробелы и дефисы`);
        return;
      }
    }

    if (id === 'middle_name') {
      if (value && !/^[A-Za-zА-Яа-яЁё\s-]*$/.test(value)) {
        toast.error('Поле "Отчество" должно содержать только буквы, пробелы и дефисы');
        return;
      }
    }

    if (id === 'login') {
      if (value && !validateLogin(value)) {
        toast.error('Логин должен содержать 3-50 символов (буквы, цифры, _, -)');
        return;
      }
    }

    if (id === 'admission_year') {
      const year = parseInt(value, 10);
      if (value && (year < 2000 || year > new Date().getFullYear())) {
        toast.error(`Год поступления должен быть между 2000 и ${new Date().getFullYear()}`);
        return;
      }
    }

    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
    const { id, value } = e.target;
    setPasswords((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Выбранный файл:', { name: file.name, size: file.size, type: file.type });
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
        setIsCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 100;
    canvas.height = 100;

    ctx.beginPath();
    ctx.arc(50, 50, 50, 0, Math.PI * 2);
    ctx.clip();

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      100,
      100
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        console.log('Обрезанное изображение:', { name: file.name, size: file.size });
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      setProfile((prev) => ({ ...prev, avatar: croppedImage }));
      setIsCropModalOpen(false);
      setImageSrc(null);
    } catch (err) {
      console.error('Ошибка при обрезке изображения:', err);
      toast.error('Ошибка при обрезке изображения');
    }
  };

  const handleCropCancel = () => {
    setIsCropModalOpen(false);
    setImageSrc(null);
  };

  const handleAvatarDelete = async () => {
    try {
      const response = await ProfileAPI.updateAvatar(null);
      console.log('Ответ при удалении аватара:', response);
      setProfile((prev) => ({ ...prev, avatar: null }));
      if (onProfileUpdate) {
        onProfileUpdate({ ...profile, avatar: null });
      }
      toast.success('Аватар успешно удалён');
    } catch (err) {
      console.error('Ошибка при удалении аватара:', err);
      toast.error('Ошибка при удалении аватара');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const requiredFields = [
        { key: 'first_name', label: 'Имя' },
        { key: 'last_name', label: 'Фамилия' },
        { key: 'birth_date', label: 'Дата рождения' },
        { key: 'department_id', label: 'Отделение' },
        { key: 'group_id', label: 'Группа' },
        { key: 'login', label: 'Логин' },
        { key: 'email', label: 'Электронная почта' },
        { key: 'admission_year', label: 'Год поступления' },
      ];

      let hasErrors = false;
      requiredFields.forEach(({ key, label }) => {
        if (!profile[key] || profile[key].toString().trim() === '') {
          toast.error(`Поле "${label}" обязательно для заполнения`);
          hasErrors = true;
        }
      });

      if (hasErrors) return;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profile.email)) {
        toast.error('Пожалуйста, введите корректный адрес электронной почты');
        return;
      }

      if (!validateLogin(profile.login)) {
        toast.error('Логин должен содержать 3-50 символов (буквы, цифры, _, -)');
        return;
      }

      const year = parseInt(profile.admission_year, 10);
      if (year < 2000 || year > new Date().getFullYear()) {
        toast.error(`Год поступления должен быть между 2000 и ${new Date().getFullYear()}`);
        return;
      }

      const formData = new FormData();
      formData.append('last_name', profile.last_name);
      formData.append('first_name', profile.first_name);
      formData.append('middle_name', profile.middle_name || '');
      formData.append('birth_date', profile.birth_date);
      formData.append('department_id', profile.department_id);
      formData.append('group_id', profile.group_id);
      formData.append('login', profile.login);
      formData.append('email', profile.email);
      formData.append('admission_year', profile.admission_year);

      if (
        passwords.oldPassword &&
        passwords.newPassword &&
        passwords.confirmPassword
      ) {
        if (passwords.newPassword !== passwords.confirmPassword) {
          toast.error('Новый пароль и подтверждение пароля не совпадают');
          return;
        }
        formData.append('oldPassword', passwords.oldPassword);
        formData.append('newPassword', passwords.newPassword);
      }

      if (profile.avatar instanceof File) {
        formData.append('avatar', profile.avatar);
      }

      console.log('Отправляемые данные:', {
        entries: [...formData.entries()],
        avatar: profile.avatar instanceof File ? { name: profile.avatar.name, size: profile.avatar.size } : profile.avatar,
      });

      let response;
      try {
        response = await (isNewUser
          ? ProfileAPI.createProfile(formData)
          : ProfileAPI.updateProfile(formData));
      } catch (error) {
        if (error.response?.status === 401) {
          console.warn('Ошибка 401, перенаправление на /login');
          localStorage.removeItem('accessToken');
          navigate('/login');
          return;
        }
        throw error;
      }

      console.log('Ответ сервера:', response);

      if (response?.success) {
        toast.success(isNewUser ? 'Профиль успешно создан!' : 'Профиль успешно сохранён!');

        if (onProfileUpdate) {
          onProfileUpdate({
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar: response.data?.avatar || profile.avatar,
            isNewUser: false,
          });
        }

        const updatedProfile = await ProfileAPI.getProfile();
        if (updatedProfile?.data) {
          const avatarUrl = updatedProfile.data.avatar
            ? updatedProfile.data.avatar.startsWith('http')
              ? updatedProfile.data.avatar
              : `http://localhost:5000${updatedProfile.data.avatar}`
            : null;
          setProfile({
            last_name: updatedProfile.data.last_name || '',
            first_name: updatedProfile.data.first_name || '',
            middle_name: updatedProfile.data.middle_name || '',
            birth_date: updatedProfile.data.birth_date?.split('T')[0] || '',
            department_id: updatedProfile.data.department_id?._id || '',
            group_id: updatedProfile.data.group_id?._id || '',
            login: updatedProfile.data.login || '',
            email: updatedProfile.data.email || '',
            avatar: avatarUrl,
            admission_year:
              updatedProfile.data.admission_year || new Date().getFullYear(),
          });
          setIsNewUser(false);
          setPasswords({
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          });
        }
      } else {
        toast.error(response?.message || 'Ошибка при сохранении профиля');
      }
    } catch (error) {
      console.error('Ошибка при сохранении профиля:', error);
      if (error.response?.status === 401) {
        console.warn('Ошибка 401, перенаправление на /login');
        localStorage.removeItem('accessToken');
        navigate('/authorization');
        return;
      }
      const errorMessage = error.response?.data?.message || error.message || 'Произошла ошибка при сохранении профиля';
      toast.error(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="section loading">
        <div className="spinner"></div>
        <p>Загрузка данных профиля...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section error">
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <div className="section" id="settings-section">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="heading-fixed">
        <h2>{isNewUser ? 'Заполните ваш профиль' : 'Настройки профиля'}</h2>
        {isNewUser && (
          <div className="new-user-notice">
            <p>
              Пожалуйста, заполните обязательную информацию о себе, чтобы
              продолжить использование сервиса.
            </p>
          </div>
        )}
      </div>

      <div className="center-form">
        <form className="settings-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Личные данные</h3>
            <label htmlFor="last_name">Фамилия *</label>
            <input
              type="text"
              id="last_name"
              value={profile.last_name}
              onChange={handleChange}
              title="Только буквы, пробелы и дефисы"
            />

            <label htmlFor="first_name">Имя *</label>
            <input
              type="text"
              id="first_name"
              value={profile.first_name}
              onChange={handleChange}
              title="Только буквы, пробелы и дефисы"
            />

            <label htmlFor="middle_name">Отчество</label>
            <input
              type="text"
              id="middle_name"
              value={profile.middle_name}
              onChange={handleChange}
              title="Только буквы, пробелы и дефисы (необязательно)"
            />

            <label htmlFor="birth_date">Дата рождения *</label>
            <input
              type="date"
              id="birth_date"
              value={profile.birth_date}
              onChange={handleChange}
            />
          </div>

          <div className="form-section">
            <h3>Учебная информация</h3>
            <label htmlFor="admission_year">Год поступления *</label>
            <input
              type="number"
              id="admission_year"
              min="2000"
              max={new Date().getFullYear()}
              value={profile.admission_year}
              onChange={handleChange}
            />

            <label htmlFor="department_id">Отделение *</label>
            <select
              id="department_id"
              value={profile.department_id || ''}
              onChange={handleChange}
            >
              <option value="">Выберите отделение</option>
              {departments.map((dept) => (
                <option key={`dept-${dept._id}`} value={dept._id}>
                  {dept.name}
                </option>
              ))}
            </select>

            <label htmlFor="group_id">Группа *</label>
            <select
              id="group_id"
              value={profile.group_id || ''}
              onChange={handleChange}
              disabled={!profile.department_id || groups.length === 0}
            >
              <option value="">Выберите группу</option>
              {groups.map((grp) => (
                <option key={`grp-${grp._id}`} value={grp._id}>
                  {grp.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-section">
            <h3>Учётные данные</h3>
            <label htmlFor="login">Логин *</label>
            <input
              type="text"
              id="login"
              value={profile.login}
              onChange={handleChange}
              title="Логин должен содержать 3-50 символов (буквы, цифры, _, -)"
              placeholder="Введите логин"
            />

            <label htmlFor="email">Электронная почта *</label>
            <input
              type="email"
              id="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Введите email"
            />

            <label htmlFor="oldPassword">Старый пароль</label>
            <input
              type="password"
              id="oldPassword"
              value={passwords.oldPassword}
              onChange={handlePasswordChange}
              placeholder="Введите старый пароль"
            />

            <label htmlFor="newPassword">Новый пароль</label>
            <input
              type="password"
              id="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              placeholder="Введите новый пароль"
            />

            <label htmlFor="confirmPassword">Повторите новый пароль</label>
            <input
              type="password"
              id="confirmPassword"
              value={passwords.confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Повторите новый пароль"
            />
          </div>

          <div className="form-section">
            <h3>Аватар</h3>
            <label htmlFor="avatar">Загрузить изображение</label>
            <input
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleFileChange}
            />
            {profile.avatar && typeof profile.avatar === 'string' && (
              <div className="avatar-preview">
                <img
                  src={profile.avatar}
                  alt="Текущий аватар"
                  onError={(e) => {
                    console.log('Ошибка предпросмотра аватара:', e.target.src);
                    e.target.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  className="avatar-delete"
                  onClick={handleAvatarDelete}
                  title="Удалить аватар"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="save-button">
            {isNewUser ? 'Создать профиль' : 'Сохранить изменения'}
          </button>
        </form>
      </div>

      {isCropModalOpen && (
        <div className="modal-overlay">
          <div className="crop-modal">
            <h2>Обрезка аватара</h2>
            <div className="crop-container">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div className="crop-controls">
              <label>
                Масштаб:
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                />
              </label>
            </div>
            <div className="modal-buttons">
              <button className="modal-button confirm" onClick={handleCropSave}>
                Сохранить
              </button>
              <button className="modal-button cancel" onClick={handleCropCancel}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;