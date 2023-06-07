// seleccionamos el carrito
const carrito = document.querySelector("#carrito");
console.log(carrito);
// seleccionamos el contenedor del carrito
let contenedorCarrito = document.querySelector("#lista-carrito tbody");
// console.log(contenedorCarrito);
const vaciarCarritoBTN = document.querySelector("#vaciar-carrito");
let articulosCarrito = [];

//Seleccionamos la card
const card = document.querySelector("#lista-cursos");

cargarEventListener();
async function cargarEventListener() {
  card.addEventListener("click", (e) => {
    e.preventDefault();
    // console.log("Datos del elmelemto", e.target);

    e.target.classList.forEach((element) => {
      // console.log(element);
      if (element === "agregar-carrito") {
        //mandamos la card al carrito
        console.log("Mandamos al carrito");
        agregarCarrito(e.target);
      }
    });
  });

  carrito.addEventListener("click", eliminarCurso);

  // MUESTRA LOS CURSOS DEL LOCALSTORAGE
  document.addEventListener("DOMContentLoaded", () => {
    articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

    console.log("Datos del localStorage", articulosCarrito);

    mostrarHTML();
  });

  //VACIAR CARRITO
  vaciarCarritoBTN.addEventListener("click", vaciarCarrito);
}

// Agregar al carrito
async function agregarCarrito(info) {
  const cursoSeleccionado = info.parentElement.parentElement;

  leerDatos(cursoSeleccionado);
}

// elimianr del carrito
async function eliminarCurso(e) {
  //   console.log("desde eliminar curso", e.target.classList.value);

  if (e.target.classList.contains("borrar-curso")) {
    console.log("borramos");
    // console.log(e.target.getAttribute("data-id"));
    const cursoID = e.target.getAttribute("data-id");

    //eliminamos el curso -  se trae todos menos el que quitamos
    console.log(articulosCarrito);

    articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoID);
    console.log(articulosCarrito);

    // iterar sobre el carrito y mostrar en HTML
    mostrarHTML();
  }
}

// VACIAR CARRITO
async function vaciarCarrito() {
  articulosCarrito = []; // reseteamos el arreglo
  //limpiamos HTML
  limpiarHTML();
}
//leer datos
async function leerDatos(curso) {
  console.log("Seleccioando", curso);

  let progress = curso.querySelector("#progress");
  let progressText = curso.querySelector("#progressText");
  // console.log("Seleccionando progress", progress);

  //ACTIVAR BARRA DE PROGRESSO
  progress.removeAttribute("hidden");
  progressText.removeAttribute("hidden");

  //ANIMAR BARRA DE PROGRESO
  setTimeout(() => {
    progress.setAttribute("value", 100);
  }, 0.5);
  setTimeout(() => {
    progress.setAttribute("hidden", "");
    progressText.setAttribute("hidden", "");
  }, 1000);

  //creamos objeto para mandar la info
  const info = {
    imagen: curso.querySelector("img").src,
    nombre: curso.querySelector("h4").textContent,
    precio: curso.querySelector(".precio span").textContent,
    id: curso.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  //AGREGAMOS BARRA DE PROGRESO
  console.log("Agregando...", info);

  //REVISAR SI EL CURSO YA EXISTE EN EL CARRITO
  const existe = articulosCarrito.some((curso) => curso.id === info.id);
  //   console.log(existe);
  if (existe) {
    // actualizamos la cantidad
    const cursos = articulosCarrito.map((curso) => {
      if (curso.id === info.id) {
        curso.cantidad++;
        return curso; // retorna el objeto actualizado
      } else {
        return curso; // retorna los objetos que no son duplicados
      }
    });
    articulosCarrito = [...cursos];
    console.log(cursos);
  } else {
    //agregamos al carrito
    articulosCarrito = [...articulosCarrito, info];
  }
  //   console.log("Articulos", articulosCarrito);
  mostrarHTML();
}

//mostramos en html los cursos
async function mostrarHTML() {
  //limpiar HTML previo
  limpiarHTML();
  //recorrer el carrito y generra codigo HTML
  articulosCarrito.forEach((curso) => {
    console.log(curso);

    const row = document.createElement("tr");

    //destructuring para sacar los datos del objeto
    const { imagen, nombre, precio, cantidad, id } = curso;

    row.innerHTML = `
    <td>
    <img src="${imagen}" style="width:150px"/>
    
    </td>
    <td>
    ${nombre}
    </td>
    <td>
    ${precio}
    </td>
    <td style="text-align: "center"">
    ${cantidad}
    </td>
    <td>
    <a href="#" data-id="${id}" class="borrar-curso">X</a> 
    </td>
    `;

    // agregar html al carrito tbody
    contenedorCarrito.appendChild(row);

    //AGREGAR EL CARRITO DE COMPRAS AL STORAGE
    sincronizarStorage();
  });
}

async function sincronizarStorage() {
  localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// limpiar table body
async function limpiarHTML() {
  //forma lenta
  contenedorCarrito.innerHTML = "";

  //forma con mejor performance -  basicamente revisa el tb tiene elementos y los va eliminando hasta no dejar ninguno ya y de esa forma limpiamos
  while (contenedorCarrito.firstChildNode) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}
