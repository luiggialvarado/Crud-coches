var url = "http://localhost:8080/coches";

function pintarCoches(datos) {
  var texto = "";

  for (var i = 0; i < datos.length; i++) {
    var nombreMarca = "Sin marca";

    if (datos[i].marca != null) {
      nombreMarca = datos[i].marca.nombre;
    }

    texto = texto + "<div class='tarjeta'>";
    texto = texto + "<h3>" + nombreMarca + " " + datos[i].modelo + "</h3>";
    texto = texto + "<p>Id: " + datos[i].id + "</p>";
    texto = texto + "<p>Año: " + datos[i].anio + "</p>";
    texto = texto + "<p>Precio: " + datos[i].precio + " €</p>";
    texto = texto + "</div>";
  }

  document.getElementById("listado").innerHTML = texto;
}

function verTodos() {
  document.getElementById("mensaje").textContent = "";

  fetch(url)
    .then(function (respuesta) {
      return respuesta.json();
    })
    .then(function (datos) {
      console.log(datos);
      pintarCoches(datos);
    })
    .catch(function (error) {
      document.getElementById("mensaje").textContent =
        "No se pudo conectar con el servidor";
      console.log(error);
    });
}

function verUno() {
  var id = document.getElementById("idBuscar").value;

  if (id === "") {
    document.getElementById("mensaje").textContent = "Escribe un id";
    return;
  }

  fetch(url + "/" + id)
    .then(function (respuesta) {
      if (respuesta.ok === false) {
        document.getElementById("mensaje").textContent =
          "No existe el coche con id " + id;
        document.getElementById("listado").innerHTML = "";
        return null;
      }
      return respuesta.json();
    })
    .then(function (coche) {
      if (coche !== null) {
        console.log(coche);
        pintarCoches([coche]);
        document.getElementById("mensaje").textContent = "";
      }
    })
    .catch(function (error) {
      document.getElementById("mensaje").textContent =
        "No se pudo conectar con el servidor";
      console.log(error);
    });
}

function anadir() {
  var modelo = document.getElementById("modelo").value;
  var anio = document.getElementById("anio").value;
  var precio = document.getElementById("precio").value;
  var marcaId = document.getElementById("marcaId").value;

  if (modelo === "" || anio === "" || precio === "") {
    document.getElementById("mensaje").textContent =
      "Rellena modelo, año y precio";
    return;
  }

  var marca = null;
  if (marcaId !== "") {
    marca = { id: parseInt(marcaId) };
  }

  var nuevo = {
    modelo: modelo,
    anio: parseInt(anio),
    precio: parseFloat(precio),
    marca: marca,
  };

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  })
    .then(function (respuesta) {
      if (respuesta.ok === false) {
        document.getElementById("mensaje").textContent =
          "Error al añadir (¿existe esa marca?)";
        return null;
      }
      return respuesta.json();
    })
    .then(function (coche) {
      if (coche !== null) {
        console.log(coche);

        verTodos();
        document.getElementById("mensaje").textContent =
          "Coche añadido con id " + coche.id;
      }
    })
    .catch(function (error) {
      document.getElementById("mensaje").textContent =
        "No se pudo conectar con el servidor";
      console.log(error);
    });
}

function borrar() {
  var id = document.getElementById("idBorrar").value;

  if (id === "") {
    document.getElementById("mensaje").textContent = "Escribe un id";
    return;
  }

  fetch(url + "/" + id, { method: "DELETE" })
    .then(function (respuesta) {
      if (respuesta.ok) {
        verTodos();
        document.getElementById("mensaje").textContent =
          "Coche " + id + " borrado";
      } else {
        document.getElementById("mensaje").textContent =
          "No existe el coche con id " + id;
      }
    })
    .catch(function (error) {
      document.getElementById("mensaje").textContent =
        "No se pudo conectar con el servidor";
      console.log(error);
    });
}
