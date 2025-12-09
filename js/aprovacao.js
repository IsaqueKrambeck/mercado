// approved.js
document.addEventListener('DOMContentLoaded', async () => {
  const report = document.getElementById('report');
  const btnPrint = document.getElementById('btn-print');

  const raw = sessionStorage.getItem('lastPurchase');
  if (!raw) {
    report.innerHTML = '<div class="alert alert-warning">Nenhuma compra encontrada.</div>';
    return;
  }
  const p = JSON.parse(raw);

  // prazo de frete: random entre 3 e 10 dias
  const prazo = Math.floor(Math.random() * 8) + 3;
  report.innerHTML = `
    <p><strong>Código do produto:</strong> ${p.productId}</p>
    <p><strong>Título:</strong> ${p.title}</p>
    <p><strong>Preço:</strong> ${fmtCurrency(p.price)}</p>
    <p><strong>Desconto:</strong> ${p.discount}%</p>
    <p><strong>Método de pagamento:</strong> ${p.payment.toUpperCase()}</p>
    ${p.payment === 'pix' ? `<p><strong>Chave PIX:</strong> ${p.pixCode}</p>` : ''}
    <p><strong>Prazo de entrega estimado:</strong> ${prazo} dias</p>
  `;

  btnPrint.addEventListener('click', () => window.print());
});
