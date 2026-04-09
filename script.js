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


function buscar(){
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
fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`)
//tranforma a resposta dela em json
.then(res=>res.json())
.then(dados =>{
    console.log(dados)
    //imprimindo temperatura
    document.getElementById("temp").innerHTML =
  dados.hourly.temperature_2m[0] + "°C";
  document.getElementById("umidade").innerHTML =
  dados.hourly.relative_humidity_2m[0] + " %";
  document.getElementById("vento").innerHTML =
  dados.hourly.wind_speed_10m[0] + " km/h";
    document.getElementById("chuva").innerHTML =
  dados.hourly.rain[0] + " mm";
  })
})
}
