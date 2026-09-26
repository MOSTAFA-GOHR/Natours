import axios from 'axios';
import { showAlert } from './alert';

export const signup = async (name, email, password, passwordConfirm) => {
  try {
    const response = await axios.post('http://127.0.0.1:3000/api/v1/users/signup', {
      name,
      email,
      password,
      passwordConfirm
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Welcome in our family');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000)
    }

  } catch (err) {
    showAlert('error', err.response.data.message);
  }
}