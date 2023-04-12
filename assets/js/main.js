const form = document.getElementById('formulario');

function oneClick(event) {
  const numeros = document.querySelector('#numeros').value;
  const listaNumeros = numeros.split(',');
  const quantidadeNumeros = listaNumeros.length;
  const servidor = 'http://localhost';
  const api = `/otg-api/public/api/v1/imagens/lista/${numeros}`;
  const url = servidor + api;
  const tamanhoLinha = document.querySelector('#tamanho').value;
  //const espL = document.querySelector('#largura').value;
  //const espA = document.querySelector('#altura').value;
  //const espLa = 0 + Number(espL);
  //const espAl = 0 + Number(espA);
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('canvas')
      const imagensAnteriores = document.querySelectorAll('canvas');
      imagensAnteriores.forEach(imagem => imagem.remove());


      // Aqui definimos os tamanhos utilizados para ajeitar as imagens dentro do canvas, inserindo suas dimensões e o espaçamento de altura e largura.
      const espacamentoLargura = 0;
      const espacamentoAltura = 0;
      const larguraImagem = 2002;
      const alturaImagem = 2002;
      const quantidadeLinhas = Math.ceil(quantidadeNumeros / tamanhoLinha)
      let larguraTotal = 0;
      const alturaMaxima = (quantidadeLinhas * alturaImagem) + (quantidadeLinhas * espacamentoAltura) - espacamentoAltura;

      const canvas = document.createElement('canvas');

      if (quantidadeNumeros < tamanhoLinha) {
        larguraTotal = quantidadeNumeros * (larguraImagem + espacamentoLargura) - espacamentoLargura;
      } else {
        larguraTotal = tamanhoLinha * (larguraImagem + espacamentoLargura) - espacamentoLargura;
      }
      canvas.id = "imagens";
      canvas.width = larguraTotal;
      canvas.height = alturaMaxima;
      const ctx = canvas.getContext('2d');


      let posicaoX = 0; // Define a posição inicial como 0
      let posicaoY = 0; // Define a posição inicial como 0

      data.forEach((item) => {
        const img = new Image();
        img.onload = () => {
          if (posicaoX + larguraImagem > larguraTotal) {
            // Se a imagem exceder a largura máxima, avança para a próxima linha
            posicaoX = 0;
            posicaoY += alturaImagem + espacamentoAltura;
          }
          ctx.drawImage(img, posicaoX, posicaoY);
          posicaoX += larguraImagem + espacamentoLargura; // Atualiza a posição X para a próxima imagem
        };
        img.src = servidor + item.diretorio;
      });
      container.appendChild(canvas).style.display = 'none';
    });
};

function download() {
  const element = document.getElementById("imagens");
  element.toBlob(function (blob) {

    saveAs(blob, "ODT_img.png");
  });
};

function sucessAlert() {
  Swal.fire({
    icon: 'success',
    title: 'ODS GERADA COM SUCESSO!',
    text: 'Aguarde o início do download!',
    showConfirmButton: false,
    timer: 4000
  });
};

function startAlert() {
  Swal.fire({
    icon: 'info',
    title: 'GERANDO ODS!',
    text: 'Por favor, aguarde um momento!',
    showConfirmButton: false,
    timer: 2400,
  });
  Swal.showLoading();
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  setTimeout(() => {
    oneClick();
    startAlert();
    setTimeout(() => {
      oneClick();
      oneClick();
      setTimeout(() => {
        oneClick();
        setTimeout(() => {
          download();
          setTimeout(() => {
            sucessAlert();
          }, 0);
        }, 1500);
      }, 600);
    }, 300);
  }, 0);
});



