const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('templateCard').content
const templateFooter = document.getElementById('templateFooter').content
const templateCarrito = document.getElementById('templateCarrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded',() => {
    fetchData()
    if (localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem("carrito"))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        // console.log(data)
        pintarCard(data)
    } catch (error) {
      
    }
}

const pintarCard = data => {
    // console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.nombre
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.imagen) 
        templateCard.querySelector('.btn-dark').dataset.sku = producto.sku
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
  // console.log(e.target)
  // console.log(e.target.classList.contains('btn-dark'))
  if(e.target.classList.contains('btn-dark')) {
    setCarrito(e.target.parentElement)
   

  }
  e.stopPropagation()
  
}
 const setCarrito = objeto => {
    const producto = {
        sku: objeto.querySelector('.btn-dark').dataset.sku,
        nombre: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if(carrito.hasOwnProperty(producto.sku)) {
        producto.cantidad = carrito[producto.sku].cantidad + 1
    }
        carrito[producto.sku] = {...producto}
      // console.log(carrito) 
      pintarCarrito()
 }

 const pintarCarrito = () => {
    // console.log(carrito)
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.sku
        templateCarrito.querySelectorAll('td')[0].textContent = producto.nombre
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-outline-success').dataset.sku = producto.sku
        templateCarrito.querySelector('.btn-outline-danger').dataset.sku = producto.sku
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)       
    })
    items.appendChild(fragment)

    pintarFooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
 }

const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row text-center" colspan="5"  >Carrito vacio - comienza tu compra!</th>
        `
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const vaciarCarrito = document.getElementById('vaciarCarrito')
    vaciarCarrito.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}
const btnAccion = e => {
    console.log(e.target)
    if(e.target.classList.contains('btn-outline-success')){
        carrito[e.target.dataset.sku]

        const producto = carrito[e.target.dataset.sku]
        producto.cantidad = carrito[e.target.dataset.sku].cantidad + 1
        carrito[e.target.dataset.sku] = {...producto}
        pintarCarrito()
    }

    if(e.target.classList.contains('btn-outline-danger')) {
        const producto = carrito[e.target.dataset.sku]
        
        producto.cantidad--
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.sku]
            pintarCarrito()
        }

    }

    e.stopPropagation()
}