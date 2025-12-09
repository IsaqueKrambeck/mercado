
document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('product-list');
  const navLogin = document.getElementById('nav-login');

  if (isLoggedIn()) {
    navLogin.textContent = 'Logout';
    navLogin.classList.remove('btn-outline-primary');
    navLogin.classList.add('btn-outline-secondary');
    navLogin.href = '#';
    navLogin.addEventListener('click', (e) => { e.preventDefault(); setLoggedOut(); location.reload(); });
  }

  try {
    const res = await fetch('https://dummyjson.com/products');
    if (!res.ok) throw new Error('Erro na API');
    const data = await res.json();
    const products = data.products.slice(0, 8);
    products.forEach((p) => {
      const col = document.createElement('div');
      col.className = 'col-12 col-md-6 col-lg-4';
      col.innerHTML = `
        <div class="card h-100 product-card">
          <img src="${p.thumbnail}" class="card-img-top" alt="${p.title}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${p.title}</h5>
            <p class="mb-1 price">${fmtCurrency(p.price)}</p>
            <p class="mb-1 small">Avaliação: ${p.rating} ★</p>
            <p class="mb-2 small text-muted">Desconto: ${p.discountPercentage}%</p>
            <div class="mt-auto d-flex justify-content-between">
              <a class="btn btn-sm btn-outline-primary" href="produto.html?id=${p.id}">Detalhar</a>
              <!-- usar produto.html com parâmetro buy -->
              <a class="btn btn-sm btn-success" href="produto.html?id=${p.id}&buy=true">Comprar</a>
            </div>
          </div>
        </div>
      `;
      list.appendChild(col);
    });
  } catch (err) {
    list.innerHTML = '<p>Erro ao carregar produtos.</p>';
    console.error(err);
  }
});
