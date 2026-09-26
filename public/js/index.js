import { login, logout } from './login.js';
import { udateSettings } from './udateSetting.js';
import { bookTour } from './stripe.js';
import { signup } from './signup.js';


//Dom Element
const form = document.querySelector(".form--login");
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const logoutBtn = document.querySelector('.nav__el--logout');
const formudateData = document.querySelector('.form-user-data');
const formUpdatePassword = document.querySelector('.form-user-password');
const bookingBtn = document.getElementById('book-tour');
const signupForm = document.querySelector('.form--signup');


if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    login(email.value, password.value);
  });
}

if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email-signup').value;
    const name = document.getElementById('name-signup').value;
    const password = document.getElementById('password-signup').value;
    const passwordConfirm = document.getElementById('password-confirm').value;


    signup(name, email, password, passwordConfirm);
  })
};




if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
};

if (formudateData) {
  formudateData.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData()
    const nameUpdate = document.querySelector('#name').value;
    const emailUpdate = document.querySelector('#email-update').value;
    const photoUpdate = document.querySelector('#photo').files[0];
    form.append('name', nameUpdate);
    form.append('email', emailUpdate);
    form.append('photo', photoUpdate);

    udateSettings(form, 'data');
  })
}


if (formUpdatePassword) {
  // console.log('hello from update password')
  formUpdatePassword.addEventListener('submit', async (e) => {
    e.preventDefault();
    const currentPassword = document.querySelector('#password-current').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#password-confirm').value;

    document.querySelector('.btn-save-update-password').textContent = '...Udating password';

    await udateSettings({ currentPassword, password, passwordConfirm }, 'password');

    document.querySelector('.btn-save-update-password').textContent = 'Save password';

    document.querySelector('#password-current').value = '';
    document.querySelector('#password').value = '';
    document.querySelector('#password-confirm').value = '';
  })
};


if (bookingBtn) {
  bookingBtn.addEventListener('click', e => {
    e.currentTarget.textContent = 'Processing......'
    const { tourId } = e.currentTarget.dataset;

    bookTour(tourId);

  })
}