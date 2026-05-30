import {useState} from "react"
import { LoginCredentialsI } from '../../types/user.types';
import { validateUsername, validatePassword } from '../../utils/login.utils';

export const useLoginForm = (onSubmit: (credentials: LoginCredentialsI) => void) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<LoginCredentialsI>({
    name: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState<LoginCredentialsI>({
    name: '',
    password: '',
  });

  const validateForm = (): boolean => {
    const errors = {
      name: '',
      password: '',
    };
    let isValid = true;

    if (!validateUsername(credentials.name)) {
      errors.name = 'Имя пользователя обязательно';
      isValid = false;
    }

    if (!validatePassword(credentials.password)) {
      errors.password = 'Пароль обязателен';
      isValid = false;
    } else if (credentials.password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(credentials);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    showPassword,
    credentials,
    formErrors,
    handleChange,
    handleSubmit,
    togglePasswordVisibility,
  };
};