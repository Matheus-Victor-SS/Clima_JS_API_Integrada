
fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.1864&longitude=-46.8842&hourly=temperature_2m")
.then(res=>res.json())
.then(dados =>{
    console.log(dados)
    document.getElementById("resultado").innerHTML =
  dados.hourly.temperature_2m[0] + "°C";
})
