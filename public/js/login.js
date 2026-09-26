import axios from "axios";
import { showAlert } from "./alert";

export const login = async (email, password) => {
  try {
    const response = await axios.post('/api/v1/users/login', {
      email,
      password
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 2000)
    }
  } catch (error) {
    showAlert('error', error.response.data.message)
  }
}

export const logout = async () => {
  try {
    const res = await axios.get('/api/v1/users/logout')

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfully');
      window.location.reload(true)
    }
  } catch (error) {
    showAlert('error', 'Error Logged out Try again');
  }
}