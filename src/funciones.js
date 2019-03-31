const fs = require('fs');
const path = require('path');


// Usuarios
const verificarRol = (identificacion) => {
    listarUsuarios();
    let usuario = listaUsuarios.find(u => u.id == identificacion);
    if (!usuario) {
        let valor = `0`
        let mensaje = `No hay ningún usuario registrado con ese id`
        return [valor, mensaje]
    } else {
        let rol = usuario.rol;
        if (rol == 'coordinador') {
            valor = `1`
            return valor
        } else {
            valor = `2`
            return valor
        }
    }
}

const listarUsuarios = () => {
    try {
        listaUsuarios = require(path.join(__dirname, '../listadoUsuarios.json'));
    } catch (error) {
        listaUsuarios = [];
    }
};

const crearRol = (usuario) => {
    listarUsuarios();
    let usu = {
        nombre: usuario.nombre,
        id: usuario.id,
        email: usuario.email,
        telefono: usuario.tel,
        rol: "aspirante"
    };
    let duplicado = listaUsuarios.find(iden => iden.id == usu.id);
    if (!duplicado) {
        listaUsuarios.push(usu);
        guardarUsuario();
        mensaje = ("El usuario se ha registrado con éxito");
        valor = '1';
        return [valor, mensaje];
    } else {
        mensaje = ("El usuario que desea registrar ya existe");
        //console.log('La identificación del curso que desea agregar ya existe');
        valor = '2';
        return [valor, mensaje];
    }

}

const guardarUsuario = () => {
    let datos = JSON.stringify(listaUsuarios);
    fs.writeFile('listadoUsuarios.json', datos, (err) => {
        if (err) throw (err);
        mensaje2 = ("El archivo ha sido creado con éxito");
        //console.log(mensaje2);

    })
};

// Cursos
const crear = (curso) => {
    listar();
    let cur = {
        nombre: curso.nombre,
        id: curso.id,
        descripcion: curso.descripcion,
        valor: curso.valor,
        modalidad: curso.modalidad,
        intensidad: curso.intensidad,
        estado: "disponible"
    };

    let duplicado = listaCursos.find(iden => iden.id == curso.id);
    if (!duplicado) {
        listaCursos.push(cur);
        guardar();
        mensaje = ("El archivo se ha creado con éxito");
        valor = '1';
        return [valor, mensaje];
    } else {
        mensaje = ("La identificación del curso que desea agregar ya existe");
        //console.log('La identificación del curso que desea agregar ya existe');
        valor = '2';
        return [valor, mensaje];
    }

}

const listar = () => {
    try {
        listaCursos = require(path.join(__dirname, '../listadoCursos.json'));
    } catch (error) {
        listaCursos = [];
    }
};

// Carga la lista de listadoInscritos (aspirantes)
const listarInscritos = () => {
    try {
        listaInscritos = require(path.join(__dirname, '../listadoInscritos.json'));
    } catch (error) {
        listaInscritos = [];
    }
};

const guardar = () => {
    let datos = JSON.stringify(listaCursos);
    fs.writeFile('listadoCursos.json', datos, (err) => {
        if (err) throw (err);
        mensaje2 = ("El archivo ha sido creado con éxito");
        //console.log(mensaje2);

    })
};

texto = '';
const mostrar = () => {
    listar();
    let size = Object.keys(listaCursos).length;;
    let texto = "<table class='table table-striped'>\
    <thead class='thead-dark'>\
        <th> Id del curso </th>\
        <th> Nombre del Curso </th>\
        <th> Descripción de Curso </th>\
        <th> Valor del curso </th>\
        <th> Estado </th>\
    </thead>\
    <tbody>";

    //console.log('La lista de estudiantes se presenta a continuación');
    listaCursos.forEach(curso => {
        texto = `${texto} 
        <tr> 
        <td> ${curso.id} </td>
        <td> ${curso.nombre} </td>
        <td> ${curso.descripcion} </td>
        <td> ${curso.valor} </td>
        <td> ${curso.estado} </td>
        </tr>`

    });
    texto = texto + '</tbody> </table>';

    let cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')
    if (cursosDisponibles.length == 0) {
        texto2 = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos disponibles </h4><hr></div>`
    } else {
        let texto2 = `<div class='accordion' id='accordionExample'>`
        i = 0;
        listaCursos.forEach(curso => {
            if (curso.estado == 'disponible') {
                if (i % 2 == 0) {
                    texto2 = `${texto2}
            <div class="row">`
                }
                texto2 = `${texto2}
                <div class="col-sm-6"> 
                    <div class="card">
                        <div class="card-header" id="heading${i}">
                            <h2 class="mb-0">
                                <button class="btn btn-link text-left " type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
                                    Nombre: ${curso.nombre} <br>
                                    Descripción: ${curso.descripcion}<br>
                                    Valor: ${curso.valor}
                                </button>
                            </h2>
                        </div>

                        <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                            <div class="card-body text-left">
                                Descripción: ${curso.descripcion}<br>
                                Modalidad: ${curso.modalidad}<br>
                                Intensidad horaria: ${curso.intensidad}
                            </div>
                        </div>
                    </div>
                </div>`

                if (((i % 2) == 1) || ((size % 2) == 1 && i == size - 1)) {
                    texto2 = texto2 + '<br> </div>'
                }
                i = i + 1;
            }
        });
        texto2 = texto2 + '</div>'
        return [texto, texto2]
    };

}

const mostrar_mis_cursos = () => {
    // Cargar la lista de aspirantes y sus respectivos cursos
    listarInscritos();
    // Cargar los cursos 
    leer_id();
    let texto;
    misCursos = listaInscritos.filter(mc => mc.id == identificacion);
    console.log(misCursos);
    if (misCursos.length == 0) {
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No tiene cursos inscritos </h4><hr></div>`

    } else {
        let size = Object.keys(listaInscritos).length;
        texto = "<table class='table table-striped'>\
    <thead class='thead-dark'>\
        <th> # </th>\
        <th> Nombre del Curso </th>\
        <th> Opción </th>\
    </thead>\
    <tbody>"
        let i = 0;
        misCursos.forEach(curso => {
            i++;
            texto = `${texto}
        <tr>
        <td>${i}</td>
        <td>${curso.curso}</td>
        <td>'Cancelar'</td>
        </tr>`
        })
        texto = texto + '</tbody> </table>';
    }
    return texto;

}

texto = '';
const mostrar_nombres_cursos = () => {
    listar();

    let cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')
    if (cursosDisponibles.length == 0) {
        texto = `<option> No hay cursos disponibles </option>`
    } else {
        listaCursos.forEach(curso => {
            if (curso.estado == 'disponible') {
                texto = `${texto}
        <option>${curso.nombre}</option>`
            }

        });
    }
    return texto
}

const actualizarCursos = (posCurso, NombreEstado) => {
    listar();
    let nombresCursos = [];
    cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')

    cursosDisponibles.forEach(curso => {
        if (curso.estado == 'disponible') {
            nombresCursos.push(curso.nombre)
        } else {
            console.log('No hay cursos disponibles');
        }
    });
    //console.log(nombresCursos);
    let cambiaCurso = listaCursos.find(buscar => buscar.nombre == nombresCursos[posCurso]);
    if (!cambiaCurso) {
        console.log('El curso no existe');
    } else {
        //console.log(cambiaCurso);
        cambiaCurso['estado'] = NombreEstado;
        guardar()
    }
}



// Inscritos
const inscribir = (infoInscrito) => {

    listarUsuarios();
    let usuario = listaUsuarios.find(u => u.id == infoInscrito.id);
    if (!usuario) {
        mensaje = ("Usuario no registrado");
        valor = '2';
        return [valor, mensaje];

    } else {
        listarInscritos();
        let est = {
            nombre: usuario.nombre,
            id: usuario.id,
            email: usuario.email,
            telefono: usuario.telefono,
            curso: infoInscrito.nombreCurso,
        };

        duplicado = listaInscritos.find(buscar => ((buscar.curso == est.curso) && (buscar.id == est.id)));
        if (!duplicado) {
            listaInscritos.push(est);
            guardarInscritos();
            mensaje = ("La inscripción se ha realizado con éxito");

            let texto = `<table class='table table-striped'>\
        <thead class='thead-dark'>
            <th> Identificacion </th>
            <th> Nombre </th>
            <th> Curso </th>
        </thead>
        <tbody>"
            <tr> 
            <td> ${est.id} </td>
            <td> ${est.nombre} </td>
            <td> ${est.curso} </td>
            </tr> 
        </tbody> 
        </table>`

            valor = '1';
            return [valor, mensaje, texto];
        } else {
            mensaje = ("Ya se encuentra inscrito en el curso solicitado");
            //console.log('La identificación del curso que desea agregar ya existe');
            valor = '2';
            return [valor, mensaje];
        }
    }

}


const guardarInscritos = () => {
    let datos = JSON.stringify(listaInscritos);
    fs.writeFile('listadoInscritos.json', datos, (err) => {
        if (err) throw (err);
        mensaje2 = ("El archivo ha sido creado con éxito");
        console.log(mensaje2);

    })
};

const mostrar_inscritos = () => {
    listarInscritos();
    listar();
    let nombresCursos = [];
    cursosDisponibles = listaCursos.filter(cur => cur.estado == 'disponible')
    if (cursosDisponibles.length == 0) {
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> No hay cursos disponibles </h4><hr></div>`
        return texto
    } else {
        let size = Object.keys(cursosDisponibles).length;;
        let texto = `<div class='accordion' id='accordionExample'>`
        i = 0;
        listaCursos.forEach(curso => {
            if (curso.estado == 'disponible') {
                inscritospcurso = listaInscritos.filter(ins => (ins.curso == curso.nombre));
                let texto_tabla = `<table class='table table-striped'>
            <thead class='thead-dark'>
                <th> Identificación </th>
                <th> Nombre </th>
                <th> Email </th>
                <th> Telefono </th>
            </thead>
            <tbody>`
                inscritospcurso.forEach(ins => {
                    texto_tabla = `${texto_tabla} 
            <tr> 
            <td> ${ins.id} </td>
            <td> ${ins.nombre} </td>
            <td> ${ins.email} </td>
            <td> ${ins.telefono} </td>
            </tr>`
                })
                texto_tabla = `${texto_tabla} </tbody> </table>`

                if (i % 2 == 0) {
                    texto = `${texto}
            <div class="row">`
                }
                texto = `${texto}
        <div class="col-sm-6"> 
            <div class="card">
                <div class="card-header" id="heading${i}">
                    <h2 class="mb-0">
                        <button class="btn btn-link text-left " type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
 
                            Curso: ${curso.nombre}<br>
                            

                        </button>
                    </h2>
                        <form action="/verInscritos" method="post" class = "float-right form-inline">
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="gridRadios" id="gridRadios1" value="${i}">
                                <label class="form-check-label" for="gridRadios1"> Cerrar curso <br> </label>
                            </div>
                            <button class="btn btn-outline-dark btn-sm" type="submit">Enviar</button> 
                                
                        </form>
                </div>
                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
                        <div class="card-body text-left">
                            ${texto_tabla}
                        </div>
                 </div>
            </div>
        </div>`

                if (((i % 2) == 1) || ((size % 2) == 1 && i == size - 1)) {
                    texto = texto + '<br> </div>'
                }
                i = i + 1;

            }
        });

        return [texto]
    }
}

const eliminarInscritos = (curso, id) => {
    listarInscritos();

    nuevo = listaInscritos.filter(buscar => (buscar.id == id && buscar.curso == curso));
    index = listaInscritos.findIndex(buscar => (buscar.id == id && buscar.curso == curso));

    if (index > -1) {
        listaInscritos.splice(index, 1);

        //listaInscritos = nuevo;
        guardarInscritos();
        InscritosCursoInteres = listaInscritos.filter(buscar => buscar.curso == curso);

        texto = `<div class = 'alert alert-success' role = 'alert'><h4 class="alert-heading"> <br> El usuario fue eliminado con éxito </h4><hr></div>`

        let texto_tabla = `<table class='table table-striped'>
            <thead class='thead-dark'>
                <th> Identificación </th>
                <th> Nombre </th>
                <th> Email </th>
                <th> Telefono </th>
                <th> Curso </th>
            </thead>
            <tbody>`
        InscritosCursoInteres.forEach(ins => {
            texto_tabla = `${texto_tabla} 
            <tr> 
            <td> ${ins.id} </td>
            <td> ${ins.nombre} </td>
            <td> ${ins.email} </td>
            <td> ${ins.telefono} </td>
            <td> ${ins.curso} </td>
            </tr>`
        })
        texto_tabla = `${texto_tabla} </tbody> </table>`
        return [texto, texto_tabla]


    } else {
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> El usuario no se encuentra inscritro al curso seleccionado </h4><hr></div>`
        texto_tabla = ''
        return [texto, texto_tabla]
    }
};

const verificarUsuarios = (idVerifica) => {
    listarUsuarios();
    usuario = listaUsuarios.find(us => us.id == idVerifica)

    if (!usuario) {
        bandera = '0'
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> El usuario no se encuentra registrado </h4><hr></div>`
        return [bandera, texto]
    } else {
        bandera = '1'
        return [bandera, usuario]
    }
}

const editarUsuarios = (datos) => {
    listarUsuarios();

    usuario = listaUsuarios.find(us => us.id == datos.id)
    if (!usuario) {
        texto = `<div class = 'alert alert-danger' role = 'alert'><h4 class="alert-heading"> <br> El usuario no se encuentra registrado </h4><hr></div>`
        texto_tabla = ''
        return [texto, texto_tabla]
    } else {
        usuario['nombre'] = datos.nombre;
        usuario['id'] = datos.id;
        usuario['email'] = datos.email;
        usuario['telefono'] = datos.tel;
        usuario['rol'] = datos.perfil;
        guardarUsuario();

        texto = `<div class = 'alert alert-success' role = 'alert'><h4 class="alert-heading"> <br> El usuario se ha modificado </h4><hr></div>`
        texto_tabla = `<table class='table table-striped'>
        <thead class='thead-dark'>
            <th> Identificación </th>
            <th> Nombre </th>
            <th> Email </th>
            <th> Telefono </th>
            <th> Perfil </th>
        </thead>
        <tbody> 
            <tr> 
            <td> ${datos.id} </td>
            <td> ${datos.nombre} </td>
            <td> ${datos.email} </td>
            <td> ${datos.tel} </td>
            <td> ${datos.perfil} </td>
        </tbody> </table>`
        return [texto, texto_tabla]

    }

}

const escribir_id_temp = (id) => {

    fs.writeFile('id_temp.json', identificacion, (err) => {
        if (err) throw (err);
        msn = ("El id temporal no se guardó");
        console.log(msn);
    });
}

const leer_id = () => {
    try {
        identificacion = require(path.join(__dirname, '../id_temp.json'));
    } catch (error) {
        identificacion = undefined;
    }
}

module.exports = {
    verificarRol,
    crearRol,
    crear,
    mostrar,
    mostrar_mis_cursos,
    mostrar_nombres_cursos,
    inscribir,
    mostrar_inscritos,
    actualizarCursos,
    eliminarInscritos,
    verificarUsuarios,
    editarUsuarios,
    escribir_id_temp,
    //eliminar
}