//horário
function Atualizar(){
var res=document.getElementById('horario')
var data = new Date()//importando Date()
        var hora = data.getHours()<=9 ? "0"+data.getHours(): data.getHours()
        var minuto = data.getMinutes()<=9 ? "0"+data.getMinutes(): data.getMinutes(),
         segundos = data.getSeconds() <=9 ? "0"+data.getSeconds(): data.getSeconds()
         horario.innerHTML = `${hora}:${minuto}:${segundos}`//coloca um do lado do outro
}
setInterval(Atualizar, 1000)

const input = document.getElementById('cidadee')
const sugestoes = document.getElementById('sugestoes')
//fica observando a todo momento oq o user digita, async para usar await
input.addEventListener('input', async () => {

    const texto = input.value

    // só busca se tiver 3 letras
    if (texto.length < 3) {
        sugestoes.innerHTML = ''
        return
    }
    //await aguarda uma resposta da API
    const resposta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${texto}`)
    //converte para JSON
    const dados = await resposta.json()

    sugestoes.innerHTML = ''
//se a API nao enviar nada
    if (!dados.results) return
//olha cada cidade
    dados.results.forEach(cidade => {
        const item = document.createElement('div')
//a cada cidade enontrada vai criando uma div
        item.innerText = cidade.name
//quando clicar na sugestao vai preencher o input
        item.onclick = () => {
            input.value = cidade.name
            sugestoes.innerHTML = ''
        }

        sugestoes.appendChild(item)
    })
})

function buscar(){
    document.getElementById("resultado").classList.remove("escondido");
    var cidade = document.getElementById("cidadee").value
    var cidadeselecionada = document.getElementById("cidadeselecionada")
    //pega o valor do input e tranforma em coordenadas
fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=10&language=pt&format=json`)
//transforma em JSON
.then(res2=>res2.json())
.then(city=>{
    console.log(city)
//se nao aparecer resultados
    if(!city.results){
        cidadeselecionada.innerHTML="cidade não encontrada"
    }else{
    //escreve a cidade, aparece o resultado encontrado mais proximo
    // e aparece as coordenadas
    cidadeselecionada.innerHTML=`${city.results[0].name}`

    console.log(city.results[0].latitude)
    console.log(city.results[0].longitude)
    var lat = (city.results[0].latitude)
    var long = (city.results[0].longitude)
    }
//entra em contato com a API e coloca os valores de latitude e longitude convertidos
//no fim da requisição coloco os parametros e valores que quero
fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,rain,apparent_temperature`)
//tranforma a resposta dela em json
.then(res=>res.json())
.then(dados =>{
    console.log(dados)
    //imprimindo valores
    document.getElementById("temp").innerHTML =
  dados.hourly.temperature_2m[0] + "°C";
  document.getElementById("tempaparent").innerHTML =
  dados.hourly.temperature_2m[0] + "°C";
  document.getElementById("umidade").innerHTML =
  dados.hourly.relative_humidity_2m[0] + " %";
  document.getElementById("vento").innerHTML =
  dados.hourly.wind_speed_10m[0] + " km/h";
    document.getElementById("chuva").innerHTML =
  dados.hourly.apparent_temperature[0] + " mm";
  })
})
}

