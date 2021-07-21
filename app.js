const marvel = () => {
    const urlAPI = `http://gateway.marvel.com/v1/public/characters?limit=24&ts=1&apikey=5c72b03216bfdf7ec53f405d8abb2718&hash=979491c3699536e3c55dce60b46b0c9a`;
    const contenedor = document.querySelector('#row');
    let listaHtml = '';
    fetch(urlAPI)
        .then(res => res.json())
        .then(({ data }) => {
            data.results.map(result => {
                console.log(result);
                listaHtml += `<div class="cajaImagen">
                                <a href="${result.urls[0].url}">
                                    <img src="${result.thumbnail.path}.${result.thumbnail.extension}" alt="${result.name}">

                                    <div class="cajaNombre">
                                        <p class="nombreHeroe">${result.name}</p>
                                    </div>
                                </a>
                            </div>`
            })
            contenedor.innerHTML = listaHtml;
        })
}

marvel();