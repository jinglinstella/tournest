/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';


// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.login-form');

//const logOutBtn = document.querySelector('nav__el nav__el--logout');
//<a class="nav__el nav__el--logout">Log out</a>

//const userDataForm = document.querySelector('.form-user-data');

//const bookBtn = document.getElementById('book-tour');

document.addEventListener('DOMContentLoaded', function() {
  const bookBtn = document.getElementById('book-tour');
  
  if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });


});




// DELEGATION
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}



//if (logOutBtn) logOutBtn.addEventListener('click', logout);
document.addEventListener('DOMContentLoaded', function() {
  const logOutBtn = document.querySelector('.nav__el--logout');
  
  if(logOutBtn) {
    //console.log('logging out');
    logOutBtn.addEventListener('click', logout);
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const userDataForm = document.querySelector('.form-user-data');
  
  if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });


});


document.addEventListener('DOMContentLoaded', function() {
  const userPasswordForm = document.querySelector('.form-user-password');
  
  if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });



});







const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 20);
