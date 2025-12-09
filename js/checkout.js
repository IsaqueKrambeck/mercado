
document.addEventListener('DOMContentLoaded', async () => {
  const productId = qs('productId');
  if (!isLoggedIn()) {

    location.href = `login.html?return=${encodeURIComponent(location.pathname + location.search)}`;
    return;
  }

  const sumario = document.getElementById('sumarioProduto');
  const metodoPagamento = document.getElementById('pay-method');
  const cartaoForm = document.getElementById('card-form');
  const pix = document.getElementById('pix-panel');
  const btnConfirm = document.getElementById('confirm-btn');


  document.getElementById('btn-logout').addEventListener('click', () => { setLoggedOut(); location.href='index.html'; });

  let product = null;
  try {
    const res = await fetch(`https://dummyjson.com/products/${productId}`);
    product = await res.json();
    sumario.innerHTML = `
      <div class="card p-3">
        <h5>${product.title}</h5>
        <p>${product.description}</p>
        <p class="fw-bold">${fmtCurrency(product.price)} <small class="text-muted">(-${product.discountPercentage}%)</small></p>
      </div>
    `;
  } catch (err) {
    sumario.innerHTML = '<div class="alert alert-danger">Erro ao buscar produto.</div>';
  }

  
  metodoPagamento.addEventListener('change', () => {
    if (metodoPagamento.value === 'card') {
      cartaoForm.classList.remove('d-none');
      pix.classList.add('d-none');
      btnConfirm.disabled = true;
    } else {
      cartaoForm.classList.add('d-none');
      pix.classList.remove('d-none');
      btnConfirm.disabled = true;
    }
  });

  
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

  if (payMethod.value === 'card') btnConfirm.disabled = true;
});
