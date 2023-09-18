/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';


export const logout = async () => {
  console.log('logging out');
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout'
    });
    if ((res.data.status = 'success')) location.reload(true);
  } catch (err) {
    console.log(err.response);
    showAlert('error', 'Error logging out! Try again.');
  }
};




const login=async (email, password)=>{
  //alert(email, password);
  console.log(email, password);
  try{
    const res= await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data:{
        email,
        password
      }
    });
    console.log(res);
    if(res.data.status=='success'){
      alert('logged in successfully');
      window.setTimeout(()=>{
        location.assign('/');
      }, 1500);
    }
  } catch (err){
    console.log(err.response.data);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  const formElement = document.querySelector('.login-form');
  
  if (formElement) {
      formElement.addEventListener('submit', e => {
          console.log("Form submitted");
          e.preventDefault();

          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;

          login(email, password);
      });
  }
});


document.addEventListener('DOMContentLoaded', function() {
  const formElement = document.querySelector('.forgot-form');
  
  if (formElement) {
      formElement.addEventListener('submit', e => {
          console.log("user email submitted");
          e.preventDefault();

          const email = document.getElementById('email').value;
          
          sendResetPasswordEmail(email);
      });
  }
});


const sendResetPasswordEmail=async (email)=>{
  //alert(email, password);
  console.log(email);
  try{
    const res= await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/forgotPassword',
      data:{
        email,
      }
    });
    console.log(res);
    if(res.data.status=='success'){
      alert('Sent reset password email');
      window.setTimeout(()=>{
        location.assign('/');
      }, 1500);
    }
  } catch (err){
    console.log(err.response.data);
  }
};

document.addEventListener('DOMContentLoaded', function() {
  
  const formElement = document.querySelector('.form'); //must be .form NOT .reset-form, or token won't load!!!

  console.log(formElement)
  
  if (formElement) {
      formElement.addEventListener('submit', e => {
          e.preventDefault();

          const password = document.getElementById('password').value;
          const passwordConfirm = document.getElementById('passwordConfirm').value;

          if(password !== passwordConfirm) {
              alert('Passwords do not match!');
              return;
          }

          console.log("reset form submitted");
          
          const token = formElement.getAttribute('data-token');
          //const token = formElement.dataset.token;

          console.log("token extracted from resetPassword form: ", token);

          reset(password, passwordConfirm, token);
      });
  }
});

const reset = async (password, passwordConfirm, token) => {
  //alert(email, password);
  //console.log(email);
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:3000/api/v1/users/resetPassword/${token}`,  // Include the token in the URL
      data: {
        password: password,
        passwordConfirm: passwordConfirm,
      }
    });

    console.log(res);
    if (res.data.status == 'success') {
      alert('Password reset successfully');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    console.log(err.response.data);
  }
};



document.addEventListener('DOMContentLoaded', function() {
  
  const formElement = document.querySelector('.signup-form'); 

  console.log(formElement)
  
  if (formElement) {
      formElement.addEventListener('submit', e => {
          e.preventDefault();

          const password = document.getElementById('password').value;
          const passwordConfirm = document.getElementById('passwordConfirm').value;
          const name = document.getElementById('name').value;
          const email = document.getElementById('email').value;

          if(password !== passwordConfirm) {
              alert('Passwords do not match!');
              return;
          }

          console.log("signup form submitted");
          
          signup(name, email, password, passwordConfirm);
      });
  }
});

//router.post('/signup', authController.signup);

const signup=async (name, email, password, passwordConfirm)=>{
  //alert(email, password);
  console.log(name, email, password);
  try{
    const res= await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/signup',
      data:{
        name, 
        email,
        password, 
        passwordConfirm,
      }
    });
    console.log(res);
    if(res.data.status=='success'){
      alert('signed up successfully');
      window.setTimeout(()=>{
        location.assign('/');
      }, 1500);
    }
  } catch (err){
    console.log(err.response.data);
  }
};

// exports.signup = catchAsync(async (req, res, next) => {
//   const newUser = await User.create({
//     //only allow name, email, pwd to be entered into system
//     //so that user can no longer add himself as admin
//     name: req.body.name,
//     email: req.body.email,
//     password: req.body.password,
//     passwordConfirm: req.body.passwordConfirm

//   })
//   //next need to asign a JWT to the user
//   const url = `${req.protocol}://${req.get('host')}/me`;
//   await new Email(newUser, url).sendWelcome();


//   createSendToken(newUser, 201, req, res);

// });
