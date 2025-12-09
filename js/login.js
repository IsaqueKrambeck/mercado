
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('btn-login');
  const alertBox = document.getElementById('alert');

  btn.addEventListener('click', () => {
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (email === 'teste@teste.com' && pass === '123456') {
      
      setLoggedIn(email);

      const params = new URLSearchParams(location.search);
      const ret = params.get('return');

      if (ret) {
      
        location.href = ret;
      } else {
        location.href = 'index.html';
      }

    } else {
      alertBox.textContent = 'Credenciais inválidas!';
      alertBox.classList.remove('d-none');
    }
  });
});
