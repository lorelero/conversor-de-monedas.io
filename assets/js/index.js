// constantes del html
const input = document.getElementById("ingreso");
const select = document.getElementById("divisa");
const button = document.getElementById("buscar");
const span = document.getElementById("render");
const canvas = document.getElementById("grafico");

// aplicacón de la API
const url = "https://mindicador.cl/api/";

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${day}/${month}/${year}`;
};

let myChart = null;

// renderización del grafico

function renderGrafico(data) {
  const config = {
    type: "line",
    data: {
      labels: data.map((elem) => formatDate(new Date(elem.fecha))),
      datasets: [
        {
          label: "Últimos 10 días",
          backgroundColor: "red",
          data: data.map((elem) => elem.valor),
        },
      ],
    },
  };
  canvas.style.backgroundColor = "white";
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(canvas, config);
}

// Funcionalidad del select
async function buscarCotizacion() {
  try {
    const cantidad = input.value;
    const moneda = select.value;
    const fetching = await fetch(`${url}${moneda}`);
    const data = await fetching.json();
    return data;
  } catch (error) {
    console.log(error);
    span.innerHTML = "Ocurrió un error!";
  }
}

// seteo de la info para mostrar en el grafico
button.addEventListener(`click`, async () => {
  span.innerHTML = `Cargando...`;
  let lastValue, data;
  try {
    const result = await buscarCotizacion();
    const serie = result.serie;
    lastValue = serie[0].valor;
    data = serie.slice(0, 10).reverse();
  } catch (error) {
    span.innerHTML = "Calma volvio a fallar";
    return;
  }

  span.innerHTML = `La cotización del día es $${lastValue}`;
  renderGrafico(data);
});