import {API} from './env.js';

let contenedor = document.querySelector('#row');
const input = document.querySelector('input');
const inp = document.getElementById('inp');
const nav = document.getElementById('nav');
const marv = document.getElementById('marv');

let listaHtml = '';
let limit = 24;
let offset = 0;
let query = '';
let tipo = 'characters';

const sinImagen = '_not_';
const noImg = '4c002e0305708';

let contSinImg = 0;

const reset = ()=>{
    listaHtml = '';
    offset=0;
    contSinImg = 0;
    query = '';
    input.value = '';
    inp.classList.add('oculta');
}

function ocultar(el){
    el.classList.toggle('oculta');
}

const updateValue = (e) => {
    const busqueda = e.target.value;
    console.log(e.target.value);
    input.value = e.target.value;
    reset();
    if(tipo=='characters'){
        query= (busqueda) ?  `nameStartsWith=${busqueda}&` : '';  
    } 
    else{
        query= (busqueda) ?  `titleStartsWith=${busqueda}&` : '';  
    }
    marvel(tipo, query);
}

input.addEventListener('change', updateValue);

marv.addEventListener('click', ()=>{
    reset();
    tipo = 'characters';
    marvel(tipo, query);
})


//Botones
const buscarBtn = document.getElementById('buscarBtn').addEventListener('click', ()=>ocultar(inp));
const menuBtn = document.getElementById('menuBtn').addEventListener('click', ()=>ocultar(nav));
const personajesBtn = document.getElementById('personajesBtn').addEventListener('click',()=>{
    reset();
    tipo = 'characters';
    marvel(tipo, query);
})

const comicsBtn = document.getElementById('comicsBtn').addEventListener('click',()=>{
    reset();
    tipo = 'comics';
    marvel(tipo, query);
})
     

const marvel = (tipo, query) => {
    const urlAPI = `http://gateway.marvel.com/v1/public/${tipo}?${query}limit=${limit}&offset=${offset}&ts=1&apikey=${API.API_KEY}&hash=${API.HASH}`;

    fetch(urlAPI)
        .then(res => res.json())
        .then(({ data }) => {
            console.log(data)
            data.results.map(hero => {
                if (hero.thumbnail.path.includes(sinImagen) || hero.thumbnail.path.includes(noImg)) return contSinImg++;

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
            console.log('total ' + data.total)
            console.log('Elementos en lista: ' + contenedor.childElementCount)
            console.log('cont SIN ' + contSinImg)

            if(data.total > (contenedor.childElementCount + contSinImg)){
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
            marvel(tipo, query);
        }})
}


const setObserver = ()=>{
    const options = {
        threshold:0.1
    }

    const observer = new IntersectionObserver(detectaUltimoEnPantalla, options)
    observer.observe(contenedor.lastElementChild);
}

marvel(tipo, query);