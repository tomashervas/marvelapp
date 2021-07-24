import {API} from './env.js';
let listaHtml = '';
let limit = 24;
let offset = 0;
let contenedor = document.querySelector('#row');
const input = document.querySelector('input');
let query = '';
const sinImagen = '_not_';
const noImg = '4c002e0305708';

function ocultar(){
    input.classList.toggle('oculta');
}

const updateValue = (e) => {
    const busqueda = e.target.value;
    console.log(e.target.value);
    listaHtml = '';
    offset=0;
    query= (busqueda) ?  `nameStartsWith=${busqueda}&` : '';
    marvel();
}

input.addEventListener('change', updateValue);
const buscarBtn = document.getElementById('buscarBtn').addEventListener('click', ocultar);
     

const marvel = () => {
    const urlAPI = `http://gateway.marvel.com/v1/public/characters?${query}limit=${limit}&offset=${offset}&ts=1&apikey=${API.API_KEY}&hash=${API.HASH}`;

    fetch(urlAPI)
        .then(res => res.json())
        .then(({ data }) => {
            console.log(data)
            data.results.map(hero => {
                if (hero.thumbnail.path.includes(sinImagen) || hero.thumbnail.path.includes(noImg)) return;

                listaHtml += `<div class="cajaImagen">
                                <a href="${hero.urls[0].url}">
                                    <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}">

                                    <div class="cajaNombre">
                                        <p class="nombreHeroe">${hero.name || hero.title}</p>
                                    </div>
                                </a>
                            </div>`
            })
            contenedor.innerHTML = listaHtml;
            //console.log(contenedor.lastElementChild);
            console.log('Elementos en lista: ' + contenedor.childElementCount)

            if(data.total > contenedor.childElementCount){
                setObserver();
            }
        })
}

const detectaUltimoEnPantalla = (entries)=>{
    entries.forEach(entry=>{
        if(entry.isIntersecting){
            console.log(entry)
            offset = offset + 24;
            console.log('offset' + offset)
            marvel();
        }})
}


const setObserver = ()=>{
    const options = {
        threshold:0.1
    }

    const observer = new IntersectionObserver(detectaUltimoEnPantalla, options)
    observer.observe(contenedor.lastElementChild);
}

marvel();