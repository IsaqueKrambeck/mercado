
document.addEventListener('DOMContentLoaded', async () => {
  const id = qs('id');
  const buy = qs('buy');
  const container = document.getElementById('detalheProduto');
  const navLogin = document.getElementById('nav-login-2');

  if (isLoggedIn()) {
    navLogin.textContent = 'Logout';
    navLogin.href = '#';
    navLogin.addEventListener('click', (e)=>{
      e.preventDefault();
      setLoggedOut(); location.reload();
    });
  }

  if (!id) {
    container.innerHTML = '<div class="alert alert-warning">Produto não especificado.</div>';
    return;
  }

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error('Produto não encontrado');
    const p = await res.json();

    container.innerHTML = `
      <div class="row g-3">
        <div class="col-md-6">
          <img src="${p.images[0] || p.thumbnail}" class="img-fluid rounded" alt="${p.title}">
          <div class="mt-2 d-flex gap-2">
            ${p.images.slice(0,4).map(i=>`<img src="${i}" style="width:80px;height:80px;object-fit:cover" />`).join('')}
          </div>
        </div>
        <div class="col-md-6">
          <h3>${p.title}</h3>
          <p class="text-muted">Código: ${p.id}</p>
          <p>${p.description}</p>
          <p class="price">${fmtCurrency(p.price)} <small class="text-muted">(${p.discountPercentage}% off)</small></p>
          <p>Avaliação: ${p.rating} ★</p>
          <p>Estoque: ${p.stock}</p>
          <div class="mt-3">
            <button id="btn-buy" class="btn btn-success">Comprar</button>
            <a class="btn btn-outline-secondary" href="index.html">Voltar</a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-buy').addEventListener('click', () => {
      const returnUrl = encodeURIComponent(location.pathname + location.search);
      if (isLoggedIn()) {
       
        location.href = `checkout.html?productId=${p.id}`;
      } else {
        
        location.href = `login.html?return=${encodeURIComponent('checkout.html?productId='+p.id)}`;
      }
    });

    
    if (buy === 'true') {
      document.getElementById('btn-buy').click();
    }

  } catch (err) {
    container.innerHTML = '<div class="alert alert-danger">Erro ao obter dados do produto.</div>';
    console.error(err);
  }
});
