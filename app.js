import {API} from './env.js';
let listaHtml = '';
let limit = 24
let offset = 0;
let contenedor = document.querySelector('#row');

const marvel = () => {
    const urlAPI = `http://gateway.marvel.com/v1/public/characters?limit=${limit}&offset=${offset}&ts=1&apikey=${API.API_KEY}&hash=${API.HASH}`;

    fetch(urlAPI)
        .then(res => res.json())
        .then(({ data }) => {
            data.results.map(hero => {
                
                listaHtml += `<div class="cajaImagen">
                                <a href="${hero.urls[0].url}">
                                    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">

                                    <div class="cajaNombre">
                                        <p class="nombreHeroe">${hero.name}</p>
                                    </div>
                                </a>
                            </div>`
            })
            contenedor.innerHTML = listaHtml;
            //console.log(contenedor.lastElementChild);
            console.log(contenedor.childElementCount)
            setObserver();
        })
}

const callback = (entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            console.log(entry)
            offset = offset + 24;
            console.log(offset)
            marvel();
        }})
}


const setObserver = ()=>{
    const options = {
        threshold:0.1
    }

    const observer = new IntersectionObserver(callback, options)
    observer.observe(contenedor.lastElementChild);
}

marvel();