fetch("https://api.open-meteo.com/v1/forecast?latitude=-23.1864&longitude=-46.8842&hourly=temperature_2m")
.then(res=>res.json())
.then(dados =>{
    console.log(dados)
})