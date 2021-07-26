import {API} from './env.js';

let contenedor = document.querySelector('#row');
const input = document.querySelector('input');
const inp = document.getElementById('inp');
const nav = document.getElementById('nav');
const marv = document.getElementById('marv');
const sobre = document.getElementById('sobre');
const personajesBtn = document.getElementById('personajesBtn');
const comicsBtn = document.getElementById('comicsBtn');
const sobreBtn = document.getElementById('sobreBtn');
const spinner = document.querySelector('.spinner');
const buscarBtn = document.getElementById('buscarBtn');
const menuBtn = document.getElementById('menuBtn');


let listaHtml = '';
let limit = 24;
let offset = 0;
let query = '';
let tipo = 'characters';

personajesBtn.classList.add('activo');
spinner.classList.add('oculta');

const sinImagen = '_not_';
const noImg = '4c002e0305708';

let contSinImg = 0;

const reset = ()=>{
    buscarBtn.classList.remove('disabled');
    buscarBtn.disabled=false;
    listaHtml = '';
    offset=0;
    contSinImg = 0;
    query = '';
    input.value = '';
    inp.classList.add('oculta');
}

const vaciarLista = ()=>{
    while (contenedor.firstChild) {
        contenedor.removeChild(contenedor.firstChild);
      }
}

function toogle(el){
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
    vaciarLista();
    reset();
    sobreBtn.classList.remove('activo');
    comicsBtn.classList.remove('activo');
    personajesBtn.classList.add('activo');
    sobre.classList.add('oculta');
    tipo = 'characters';
    marvel(tipo, query);
})


//Botones
buscarBtn.addEventListener('click', ()=>{
    toogle(inp)
    input.focus();
});

menuBtn.addEventListener('click', ()=>{toogle(nav)});

personajesBtn.addEventListener('click',()=>{
    vaciarLista();
    reset();
    sobreBtn.classList.remove('activo');
    comicsBtn.classList.remove('activo');
    personajesBtn.classList.add('activo');
    sobre.classList.add('oculta');
    tipo = 'characters';
    marvel(tipo, query);
})

comicsBtn.addEventListener('click',()=>{
    vaciarLista();
    reset();
    sobreBtn.classList.remove('activo');
    comicsBtn.classList.add('activo');
    personajesBtn.classList.remove('activo');
    sobre.classList.add('oculta');
    tipo = 'comics';
    marvel(tipo, query);
})

sobreBtn.addEventListener('click', ()=>{
    reset();
    tipo = '';
    buscarBtn.disabled = true;
    buscarBtn.classList.add('disabled');
    sobre.classList.remove('oculta');
    sobreBtn.classList.add('activo');
    comicsBtn.classList.remove('activo');
    personajesBtn.classList.remove('activo')
    vaciarLista()
})
     

const marvel = (t, q) => {

    spinner.classList.remove('oculta');

    const urlAPI = `https://gateway.marvel.com/v1/public/${t}?${q}limit=${limit}&offset=${offset}&ts=1&apikey=${API.API_KEY}&hash=${API.HASH}`;

    fetch(urlAPI)
        .then(res => res.json())
        .then(({ data }) => {

            spinner.classList.add('oculta');

            if(t != tipo) return;
            console.log(data)

            if(data.total == 0) {
                listaHtml = `<div class="noExiste" id="noExiste">
                                <p>No se ha encontrado nada, prueba otra cosa...</p>
                            </div>`
            }
            data.results.map(hero => {

                if (hero.thumbnail.path.includes(sinImagen) || hero.thumbnail.path.includes(noImg)) return contSinImg++;
                
                    listaHtml += `<div class="cajaImagen">
                                    <a href="${hero.urls[0].url}">
                                        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name || hero.title}">
    
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

        }).catch(err=>{
            console.log(err);
            listaHtml = `<div class="noExiste" id="noExiste">
                                <p>Ha ocurrido un error, intentelo más tarde...</p>
                            </div>`
        })
}

//Intersection observer para detectar último héroe en pantalla y hacer infinit scroll

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
