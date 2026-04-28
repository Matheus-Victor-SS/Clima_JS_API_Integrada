//horário
function Atualizar(){
var res=document.getElementById('horario')
//se nao achar horário da cidade usa esse padrão
var fuso = window.timezoneAtual || 'America/Sao_Paulo';
    
    var horarioFormatado = new Date().toLocaleTimeString("pt-BR", {
        timeZone: fuso,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    })
    
    res.innerHTML = horarioFormatado
}
setInterval(Atualizar, 1000)

  //AUTO INCREMENT
const input = document.getElementById('cidadee')
const sugestoes = document.getElementById('sugestoes')
const cidadesVistas = new Set();//armazena cidades duplicadas

//fica observando a todo momento oq o user digita, async para usar await
input.addEventListener('input', async () => {
    const texto = input.value
    
    //se tiver menos q 2 letras nem faz
    if (texto.length < 2) {
        sugestoes.innerHTML = ''
        return
    }
    //await aguarda a API enviar resposta
    const resposta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${texto}&language=pt&count=10&format=json`)
    const dados = await resposta.json()//converte em JSON
    
    sugestoes.innerHTML = ''
    //se nao enviar resultado
    if (!dados.results) return
    
    //vai buscar as cidades e cria um container para cada opção
    dados.results.forEach(cidade => {
        const item = document.createElement('div')
        
        // Nome + País + Estado
        let textoExibir = cidade.name
        
        if (cidade.country) {
            textoExibir += ` (${cidade.country})`
        }
        //caso tenha centro administrativo
        if (cidade.admin1) {
            textoExibir += ` - ${cidade.admin1}`
        }
        
        item.innerHTML = textoExibir
        //quando clicar na opção vai preencher o input
        item.onclick = () => {
            input.value = cidade.name
            sugestoes.innerHTML = ''
            buscar()
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
//nome do pais em baixo, verifica se existe
var nome = city.results[0].name
var pais = city.results[0].country || "País desconhecido"

    //escreve a cidade, aparece o resultado encontrado mais proximo
    // e aparece as coordenadas
cidadeselecionada.innerHTML = `
  <div class="cidade">${nome}</div>
  <div class="pais">${pais}</div>
`//adicionando nome do pais em baixo


    console.log(city.results[0].latitude)
    console.log(city.results[0].longitude)
    var lat = (city.results[0].latitude)
    var long = (city.results[0].longitude)
    //guarda o horario da cidade da API
    window.timezoneAtual = city.results[0].timezone
    }
//entra em contato com a API e coloca os valores de latitude e longitude convertidos
//no fim da requisição coloco os parametros e valores que quero
fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,relative_humidity_2m[0],wind_speed_10m,rain,apparent_temperature,weathercode,&timezone=auto`)
//tranforma a resposta dela em json
.then(res=>res.json())
.then(dados =>{
    console.log(dados)
    //pega o numero traduzido e substitui no local do HTML
    var weathercode = dados.hourly.weathercode[0];
     document.getElementById("climaDescricao").innerHTML = traduzirClima(weathercode);
mudarCorFundo(weathercode);

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

// Traduzindo os valores de clima de numeros para clima
function traduzirClima(weathercode) {
    if (weathercode === 0) return "☀️ Céu limpo";
    if (weathercode === 1 || weathercode === 2) return "⛅ Parcial. nublado";
    if (weathercode === 3) return "☁️ Nublado";
    if (weathercode <= 57) return "🌧️ Chuva";     // Inclui garoa e nevoeiro como chuva
    if (weathercode <= 67) return "🌧️ Chuva";
    if (weathercode <= 77) return "❄️ Neve";
    if (weathercode <= 86) return "🌧️ Pancadas de chuva";
    if (weathercode >= 95) return "⛈️ Tempestade";
    
    return "🌡️ Normal";
}

// COR DE FUNDO
function mudarCorFundo(weathercode) {
    const body = document.body;
    
    // Remove todas as classes de clima anteriores
    body.classList.remove('clima-limpo', 'clima-nublado', 'clima-chuva', 'clima-neve', 'clima-tempestade');
    
    // Adiciona a classe conforme o clima(muda o CSS)
    if (weathercode === 0) {
        body.classList.add('clima-limpo'); 
    } 
    else if (weathercode === 1 || weathercode === 2) {
        body.classList.add('clima-parcial');    // Parcialmente nublado (1 e 2)
    }
    else if (weathercode === 3) {
        body.classList.add('clima-nublado'); 
    }
    else if (weathercode <= 67) {
        body.classList.add('clima-chuva');  
    }
    else if (weathercode <= 77) {
        body.classList.add('clima-neve'); 
    }
    else if (weathercode >= 95) {
        body.classList.add('clima-tempestade'); 
    }
}