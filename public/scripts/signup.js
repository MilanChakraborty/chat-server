const readUsername = () => {
  const usernameInputBox = document.querySelector('#username-box');
  const username = usernameInputBox.value;
  usernameInputBox.value = '';

  return username;
};

const readPassword = () => {
  const passwordInputBox = document.querySelector('#password-box');
  const password = passwordInputBox.value;
  passwordInputBox.value = '';

  return password;
};

const sendSignupRequest = (event) => {
  event.preventDefault();
  const username = readUsername();
  const password = readPassword();
  console.log(username, password);

  fetch('/signup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => {
      if (res.redirected) {
        window.location.replace(res.url);
        return;
      }
      alert('Username Exists');
    })
    .catch((err) => err);
};

const setupSignupForm = () => {
  const formElement = document.querySelector('#signup-form');
  formElement.onsubmit = sendSignupRequest;
};

window.onload = setupSignupForm;
