
const formulario = document.querySelector("#form-conversor");
const valor = document.querySelector("#valor");
const moedaOrigem = document.querySelector("#moeda-origem");
const moedaDestino = document.querySelector("#moeda-destino");
const botaoInverter = document.querySelector("#inverter");
const valorConvertido = document.querySelector("#valor-convertido");
const taxaCambio = document.querySelector("#taxa-cambio");
const botaoConverter = document.querySelector("#converter");
let versaoConversao = 0;

function definirCarregamento(carregando) {
  botaoConverter.disabled = carregando;

  botaoConverter.textContent = carregando
    ? "Convertendo..."
    : "Converter";
}


async function buscarCotacao(origem, destino) {
  const url = `https://api.frankfurter.dev/v1/latest?base=${origem}&symbols=${destino}`;

  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error("Erro ao buscar cotação.");
  }

  const dados = await resposta.json();

  return dados.rates[destino];
}

async function converterMoeda(numero, origem, destino) {
  if (origem === destino) {
    return {
      resultado: numero,
      taxa: 1
    };
  }

  const taxa = await buscarCotacao(origem, destino);

  const resultado = numero * taxa;

  return {
    resultado: resultado,
    taxa: taxa
  };
}


formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  const numero = Number(valor.value);
  const origem = moedaOrigem.value;
  const destino = moedaDestino.value;

  console.log("Valor:", numero);
  console.log("Moeda de origem:", origem);
  console.log("Moeda de destino:", destino);
});


botaoInverter.addEventListener("click", function() {
  const moedaTemporaria = moedaOrigem.value;

  moedaOrigem.value = moedaDestino.value;
  moedaDestino.value = moedaTemporaria;

  limparResultado();
});




formulario.addEventListener("submit", async function(evento) {
  evento.preventDefault();

  const numero = Number(valor.value);
  const origem = moedaOrigem.value;
  const destino = moedaDestino.value;

  if (valor.value.trim() === "" || !Number.isFinite(numero) || numero <= 0) {
    valorConvertido.textContent = "Digite um valor válido!";
    taxaCambio.textContent = "";
    return;
  }
  const versaoAtual = ++versaoConversao;
  definirCarregamento(true);

  valorConvertido.textContent = "Convertendo...";
  taxaCambio.textContent = "";

  try {
    const conversao = await converterMoeda(numero, origem, destino);
    if (versaoAtual !== versaoConversao) return;
    const resultadoFormatado = new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: destino
    }).format(conversao.resultado);

    valorConvertido.textContent = resultadoFormatado;

    taxaCambio.textContent =
      `1 ${origem} = ${conversao.taxa.toFixed(4)} ${destino}`;
    if (versaoAtual !== versaoConversao) return;
  } catch (erro) {
    valorConvertido.textContent = "Erro ao converter moeda.";
    taxaCambio.textContent = "Verifique sua conexão e tente novamente.";

    console.error("Erro na conversão:", erro);

  } finally {
    definirCarregamento(false);
  }
});


function limparResultado() {
    versaoConversao++
  valorConvertido.textContent = "--";
  taxaCambio.textContent = "";
}

valor.addEventListener("input", limparResultado);

moedaOrigem.addEventListener("change", limparResultado);

moedaDestino.addEventListener("change", limparResultado);



