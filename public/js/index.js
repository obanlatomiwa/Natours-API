/* eslint-disable */

import '@babel/polyfill';
import displayMap from './mapBox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

//DOM
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutButton = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-password');
const bookingButton = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  console.log(locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutButton) logOutButton.addEventListener('click', logout);

if (updateUserDataForm)
  updateUserDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    updateSettings(form, 'data');
  });

if (updateUserPasswordForm)
  updateUserPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating ...';
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
    document.querySelector('.btn-save-password').textContent = 'Done...';
  });

if (bookingButton) {
  console.log('yes im here');
  bookingButton.addEventListener('click', (e) => {
    console.log('yes im here');
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
}


