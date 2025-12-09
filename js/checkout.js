// checkout.js
document.addEventListener('DOMContentLoaded', async () => {
  const productId = qs('productId');
  if (!isLoggedIn()) {
    // redireciona para login, passando return para voltar aqui
    location.href = `login.html?return=${encodeURIComponent(location.pathname + location.search)}`;
    return;
  }

  const summary = document.getElementById('product-summary');
  const payMethod = document.getElementById('pay-method');
  const cardForm = document.getElementById('card-form');
  const pixPanel = document.getElementById('pix-panel');
  const btnConfirm = document.getElementById('confirm-btn');

  // logout button
  document.getElementById('btn-logout').addEventListener('click', () => { setLoggedOut(); location.href='index.html'; });

  let product = null;
  try {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    product = await res.json();
    summary.innerHTML = `
      <div class="card p-3">
        <h5>${product.title}</h5>
        <p>${product.description}</p>
        <p class="fw-bold">${fmtCurrency(product.price)} <small class="text-muted">(-${product.discountPercentage}%)</small></p>
      </div>
    `;
  } catch (err) {
    summary.innerHTML = '<div class="alert alert-danger">Erro ao buscar produto.</div>';
  }

  // alterar painéis
  payMethod.addEventListener('change', () => {
    if (payMethod.value === 'card') {
      cardForm.classList.remove('d-none');
      pixPanel.classList.add('d-none');
      btnConfirm.disabled = true;
    } else {
      cardForm.classList.add('d-none');
      pixPanel.classList.remove('d-none');
      btnConfirm.disabled = true;
    }
  });

  // Validação cartão
  const ccNumber = document.getElementById('cc-number');
  const ccError = document.getElementById('cc-error');

  function validateCardInputs() {
    const number = ccNumber.value.replace(/\s+/g,'');
    const name = document.getElementById('cc-name').value.trim();
    const month = document.getElementById('cc-month').value;
    const year = document.getElementById('cc-year').value;
    const cvv = document.getElementById('cc-cvv').value;

    const cardValid = number.length >= 12 && luhnCheck(number)
      && name.length > 2 && /^\d{1,2}$/.test(month) && /^\d{4}$/.test(year) && /^\d{3,4}$/.test(cvv);

    ccError.classList.toggle('d-none', cardValid);
    btnConfirm.disabled = !cardValid;
  }

  ccNumber.addEventListener('input', () => {
    // format simple: add spaces every 4 digits
    let v = ccNumber.value.replace(/\D/g,'').slice(0,19);
    v = v.replace(/(.{4})/g,'$1 ').trim();
    ccNumber.value = v;
    validateCardInputs();
  });

  ['cc-name','cc-month','cc-year','cc-cvv'].forEach(id => {
    document.getElementById(id).addEventListener('input', validateCardInputs);
  });

  // PIX flow
  const btnPix = document.getElementById('btn-generate-pix');
  const pixCodeEl = document.getElementById('pix-code');
  const pixCountdown = document.getElementById('pix-countdown');

  btnPix.addEventListener('click', () => {
    const code = 'PIX-' + Math.random().toString(36).slice(2,10).toUpperCase();
    pixCodeEl.textContent = code;
    let seconds = 10;
    pixCountdown.textContent = `Redirecionando em ${seconds}s...`;
    btnConfirm.disabled = true;

    const t = setInterval(() => {
      seconds--;
      pixCountdown.textContent = `Redirecionando em ${seconds}s...`;
      if (seconds <= 0) {
        clearInterval(t);
        // salvar os dados da compra em sessionStorage e redirecionar
        const purchase = {
          productId: productId,
          title: product?.title || '',
          price: product?.price || 0,
          discount: product?.discountPercentage || 0,
          payment: 'pix',
          pixCode: code
        };
        sessionStorage.setItem('lastPurchase', JSON.stringify(purchase));
        location.href = 'approved.html';
      }
    }, 1000);
  });

  // Confirm click (cartão)
  btnConfirm.addEventListener('click', () => {
    if (payMethod.value === 'card') {
      const purchase = {
        productId: productId,
        title: product?.title || '',
        price: product?.price || 0,
        discount: product?.discountPercentage || 0,
        payment: 'card',
        cardName: document.getElementById('cc-name').value
      };
      sessionStorage.setItem('lastPurchase', JSON.stringify(purchase));
      location.href = 'approved.html';
    }
  });

  // Se cartão por padrão, desativa botão até validar
  if (payMethod.value === 'card') btnConfirm.disabled = true;
});
