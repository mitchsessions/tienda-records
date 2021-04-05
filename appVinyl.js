//variables dom
const carrito = document.querySelector('#carrito'),
    listaTracks = document.querySelector('#lista-tracks'),
    contenedorCarrito = document.querySelector('#lista-carrito tbody'),
    vaciarCarritoBtn = document.querySelector('#vaciar-carrito'),
    busqueda = document.querySelector('#buscador'),
    buscadorBtn = document.querySelector('#submit-buscador');

    const barra = document.querySelector('.barra');
//variable
let articulosCarrito = [];

//eventos
cargarEventListeners();
function cargarEventListeners(){
    //busqueda
    buscadorBtn.addEventListener('click',buscar);
    //agrega track carrito
    listaTracks.addEventListener('click',agregarTrack);

    //trae tracks de local storage
    document.addEventListener('DOMContentLoaded',() =>{
        articulosCarrito = JSON.parse(localStorage.getItem('carrito')) || [] ;
        carritoHTML();
    })

    //elimina tracks del carrito 
    carrito.addEventListener('click',eliminarTrack);

    //elimina carrito
    vaciarCarritoBtn.addEventListener('click', () => {
        articulosCarrito = [];

        limpiarHTML();
    });
}

//funciones
function agregarTrack(e){
    
    //e.preventDefault();
    if(e.target.classList.contains('agregar-carrito')){
        const trackSeleccionado = e.target.parentElement.parentElement;
        leerDatosTrack(trackSeleccionado);
        
    }
    
}

function eliminarTrack(e){

    if(e.target.classList.contains('borrar-track')){
        const trackId = e.target.getAttribute('data-id');
        //elimina del arreglo articuloscarrito por el data-id
        articulosCarrito = articulosCarrito.filter(track => track.id !== trackId);

        carritoHTML();
    }

}

function leerDatosTrack(track){
    

    //crear un onjeto con info track
    const infoTrack = {
        imagen: track.querySelector('img').src, 
        titulo: track.querySelector('h4').textContent,
        precio: track.querySelector('.precio span').textContent,
        id: track.querySelector('a').getAttribute('data-id'),
        cantidad :1,
    }

    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(track => track.id === infoTrack.id);
    if (existe){
        const  tracks = articulosCarrito.map(track =>{
            if(track.id === infoTrack.id){
                track.cantidad++;
                return track;
            }
            else
                return track;
        });
        articulosCarrito= [...tracks];
    }
    else{
        //agrega elementos carrito
        articulosCarrito = [...articulosCarrito, infoTrack];
    }

    

    //console.log(articulosCarrito);
    carritoHTML();
}

//muestra carrito en el html
function carritoHTML(){
    //limpia el html
    limpiarHTML();

    //recorre el carrito y genera el html
    articulosCarrito.forEach( (track) => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>
            <img src = "${track.imagen}" width="100";
        </td>
        <td>
            ${track.titulo}
        </td>
        <td>
            ${track.precio}
        </td>
        <td>
            ${track.cantidad}
        </td>
        <td>
            <a href="#" class="borrar-track" data-id="${track.id}" > X </a>
        </td>
        `;

        //agrega html en el table body
        contenedorCarrito.appendChild(row);
    })

    //local storage
    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));


}

//elimina los tracks del table body 
function limpiarHTML(){
    //forma lenta
    //contenedorCarrito.innerHTML = '';

    //forma eficiente 

    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);

    }
}

function almacenamientoLocal(){

    localStorage.setItem('carrito',JSON.stringify(articulosCarrito));

}

function buscar(e){
    e.preventDefault();
    const dato = busqueda.value;

    
    //crear arreglo con todos los objetos disponibles
    const lista =listaTracks.getElementsByClassName('card');
    const arrg = Array.from(lista);
    let arrg2=[];
    arrg.map( (track)=>{
        const infoTrack = {
            imagen: track.querySelector('img').src, 
            titulo: track.querySelector('h4').textContent,
            precio: track.querySelector('.precio span').textContent,
            id: track.querySelector('a').getAttribute('data-id'),
            productor: track.querySelector('p').textContent,    
            
        }
        arrg2=[...arrg2,infoTrack];
    });

    //filtrar de acuerdo a la busqueda, puede ser nombre track o productor

    for(let i=0;i<arrg2.length;i++){
        var titulo = arrg2[i].titulo;
        
        if(dato.length>0){
            if(titulo.toLowerCase() === dato || arrg2[i].productor.toLowerCase()===dato){
                //insertar contenido html antes de los mas vistos
                const row = document.createElement('div');
                row.setAttribute("id","resultado");
                row.innerHTML = `
                <div class="container" >
                    <div class="row" >
                        <div class="four columns" >
                            <div class="card" >
                                <img src="${arrg2[i].imagen}" class="imagen-curso u-full-width">
                                <div class="info-card">
                                    <h4> ${arrg2[i].titulo} </h4>
                                    <p> ${arrg2[i].productor} </p>
                                    <p class="precio"><span class="u-pull-right "> ${arrg2[i].precio} </span></p>
                                    <a href="#" class="u-full-width button-primary button input agregar-carrito" data-id="${i}">Agregar Al Carrito</a>
                                </div>
                            </div>
                        </div> 
                    </div>  
                </div>      
                `;

                barra.appendChild(row);
                const res = document.querySelector('#resultado');
                
                res.addEventListener('click', (e)=>{

                    if(e.target.classList.contains('agregar-carrito')){
                        const trackSeleccionado = e.target.parentElement.parentElement;
                        leerDatosTrack(trackSeleccionado);
                        
                    }

                });

               
                
            }
            else{
                const mns = "No se encontró ningun resultado";

            }
        }
    }

    
    
   
    
    
}