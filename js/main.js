// main.js - utilidades comuns
function qs(name, url = location.href) {
  name = name.replace(/[[]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function setLoggedIn(email) {
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('userEmail', email);
}

function setLoggedOut() {
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('userEmail');
}

function isLoggedIn() {
  return localStorage.getItem('loggedIn') === 'true';
}

// Luhn check for card number (only digits)
function luhnCheck(number) {
  const nums = number.replace(/\D/g,'');
  let sum = 0; let alt = false;
  for (let i = nums.length - 1; i >= 0; i--) {
    let n = parseInt(nums.charAt(i),10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n; alt = !alt;
  }
  return (sum % 10) === 0;
}

// Simple helper to format currency
function fmtCurrency(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
