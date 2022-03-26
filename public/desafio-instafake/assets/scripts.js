(() => {
    const formularioSelector = document.querySelector("#js-form");
    const feedUnicoSelector = document.querySelector("#mostrar-feed");
    const contenedorImagenesSelector = document.querySelector(
        "#contenedor-imagenes"
    );
    const logoutSelector = document.querySelector("#cerrar-sesion");
    const masImagenesSelector = document.querySelector("#cargar-mas-imagenes");
    let stringImagenes = "";
    let pageNum = 1;

    formularioSelector.addEventListener("submit", async(event) => {
        // Obtener el JWT a través del formulario de login entregado.
        event.preventDefault();
        const email = document.querySelector("#js-input-email").value;
        const password = document.querySelector("#js-input-password").value;
        const jwt = await postData(email, password);
        getFoto(jwt, pageNum);
        document.querySelector("#js-input-email").value = "";
        document.querySelector("#js-input-password").value = "";
    });

    const postData = async(email, password) => {
        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                body: JSON.stringify({ email: email, password: password }),
            });

            const { token } = await response.json();
            localStorage.setItem("jwt-token", token); // Persistir el token utilizando localStorage

            return token;
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    const getFoto = async(jwt, numeroPagina) => {
        // Con el JWT consumir la API http://localhost:3000/api/photos.
        try {
            const response = await fetch(
                `http://localhost:3000/api/photos?page=${numeroPagina}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                }
            );
            const { data } = await response.json();
            console.log(data);
            if (data) {
                contenedorImagenesSelector.setAttribute("style", "display: block");
                formularioSelector.setAttribute("style", "display: none");
                data.forEach((datos) => {
                    stringImagenes += `
                    <div class="card" id="tarjeta">
                        <img width="600" height="800" src="${datos.download_url}" class="card-img-top"/>
                        <div class="card-footer">
                            <span>${datos.author}</span>
                        </div>
                    </div>
                    `;
                });
                feedUnicoSelector.innerHTML = stringImagenes;
                // Al momento de recibir el JWT ocultar el formulario y mostrar el feed principal con las fotos.
                // Manipular el JSON de respuesta de la API anterior y manipular el DOM con JavaScript para mostrar las imágenes.
            }
        } catch (error) {
            console.log(error);
        }
    };

    logoutSelector.addEventListener("click", () => {
        localStorage.removeItem("jwt-token");
        localStorage.clear();
        feedUnicoSelector.innerHTML = "";
        contenedorImagenesSelector.setAttribute("style", "display: none");
        formularioSelector.setAttribute("style", "display: block");
    }); // Crear botón de logout que elimine el JWT almacenado y vuelva la aplicación a su estado inicial.

    masImagenesSelector.addEventListener("click", () => {
        pageNum++;
        console.log(pageNum);
        getFoto(localStorage.getItem("jwt-token"), pageNum);
    });
    /* En la parte inferior de la página, crear un botón que al presionarlo traiga más fotos(http://localhost:3000/api/photos?page=x)
      que deben ser añadidas al listado existente.*/

    const iniciar = () => {
        const token = localStorage.getItem("jwt-token");
        if (token) {
            getFoto(token, pageNum);
        }
    };
    iniciar(); // Cargar el feed de fotos cuando exista el JWT

    //Fin de la funcion IIFE
})();