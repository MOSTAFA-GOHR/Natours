import axios from "axios";
import { showAlert } from "./alert";



export const udateSettings = async (data, type) => {
  const url = (type === 'password') ? '/api/v1/users/updateMyPassword'
    : '/api/v1/users/updateMe';
  // console.log(data)
  try {
    const response = await axios.patch(url, data)
    if (response.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated successfully`);
    }
  } catch (error) {
    showAlert('error', error.response.data.message)
  }
} 