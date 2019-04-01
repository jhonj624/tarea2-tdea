require('../config/config');
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const session = require('express-session');
const funciones = require('./funciones');
require('./helpers');

const directoriopublico = path.join(__dirname, '../public');
const directoriopartials = path.join(__dirname, '../partials');
const dirNode_modules = path.join(__dirname, '../node_modules')


// Registro de la sesión con clave secreta 
//app.use(session({ secret: 'mysecret' }));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

app.use(express.static(directoriopublico));
app.use('/css', express.static(dirNode_modules + '/bootstrap/dist/css'));
app.use('/js', express.static(dirNode_modules + '/jquery/dist'));
app.use('/js', express.static(dirNode_modules + '/popper.js/dist'));
app.use('/js', express.static(dirNode_modules + '/bootstrap/dist/js'));

hbs.registerPartials(directoriopartials);
app.use(bodyParser.urlencoded({
    extended: false
}))

app.set('view engine', 'hbs');

app.get('/', (req, res) => res.render('index'));
app.get('/registrar', (req, res) => res.render('registrar'));

app.get('/ingresar', (req, res) => { res.render('ingresar') });

app.post('/ingreso', (req, res) => {
    identificacion = req.body.id;
    // Almaceno mi variable de sesión
    //req.session.id = req.body.id;

    /// --- escribo un archivo temporal con el id 
    funciones.escribir_id_temp(identificacion);
    /// -----

    let texto = funciones.verificarRol(identificacion);
    if (texto[0] == '0') {
        res.render('ingresar', {
            mensaje: `<div class = 'alert-danger'\
            role = 'alert'> <h4 class="alert-heading"> <br> ${texto[1]} </h4><hr></div>`,
        });
    } else if (texto == '1') {
        res.render('indexCoordinador');
    } else {
        res.render('indexAspirante');
    }
});

app.post('/registro', (req, res) => {
    aspirante = {
        nombre: req.body.nombre,
        id: req.body.id,
        email: req.body.email,
        tel: req.body.tel,
    };

    let texto = funciones.crearRol(aspirante);
    if (texto[0] == '2') {
        res.render('ingresar', {
            mensaje: `<div class = 'alert-danger'\
            role = 'alert'> <h4 class="alert-heading"> <br> ${texto[1]} </h4><hr></div>`,
        });
    } else if (texto[0] == '1') {
        res.render('ingresar', {
            mensaje: `<div class = 'alert-success'\
            role = 'alert'> <h4 class="alert-heading"> <br> ${texto[1]} </h4><hr></div>`,
        });
    }
});


app.post('/formularioCrear', (req, res) => {
    infoCursos = funciones.mostrar();
    res.render('formularioCrear', {
        TablaCursos: infoCursos[0],
    });

})

app.post('/crear', (req, res) => {
    curso = {
        nombre: req.body.nombre,
        id: req.body.id,
        valor: req.body.valor,
        descripcion: req.body.descripcion,
        modalidad: req.body.modalidad,
        intensidad: req.body.intensidad
    };
    mensaje = funciones.crear(curso);
    if (mensaje[0] == '1') {
        texto = `<div class = 'alert-success'\
        role = 'alert'> <h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
    } else {
        texto = `<div class = 'alert alert-danger'\
        role = 'alert'><h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
    }
    infoCursos = funciones.mostrar();
    console.log(mensaje);
    res.render('crear', {
        texto,
        informacion: infoCursos[0],
    });
});
// Se muestra los cursos abiertos a los usuarios
app.post('/ver', (req, res) => {
    infoCursos = funciones.mostrar();
    //console.log(infoCursos[1]);
    res.render('ver', {
        informacion: infoCursos[1],
    });
});

// Se muestra al usuario sus cursos inscritos
app.post('/verMisCursos', (req, res) => {
    // obtengo el id del aspirante
    cambia = req.body.curso_id;
    console.log(cambia);


    let infoMisCursos = funciones.mostrar_mis_cursos(cambia);
    res.render('verMisCursos', { informacion: infoMisCursos });


});

app.post('/inscribir', (req, res) => {
    Nombre_Cursos = funciones.mostrar_nombres_cursos();
    res.render('inscribir', {
        Nombre_Cursos
    })
});

app.post('/inscritos', (req, res) => {
    infoInscripcion = {
            id: req.body.cedula,
            nombreCurso: req.body.nombreCurso,
        }
        /*estudiante = {
            nombre: req.body.nombre,
            cedula: req.body.cedula,
            email: req.body.email,
            tel: req.body.tel,
            nombreCurso: req.body.nombreCurso,
        };
        mensaje = funciones.inscribir(estudiante);*/
    mensaje = funciones.inscribir(infoInscripcion);
    if (mensaje[0] == '1') {
        texto = `<div class = 'alert-success px-4'
        role = 'alert'> <h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
        inscrito = mensaje[2];
    } else {
        texto = `<div class = 'alert alert-danger px-4'
        role = 'alert'><h4 class="alert-heading"> <br> ${mensaje[1]} </h4><hr></div>`
        inscrito = ` `;
    }
    res.render('inscritos', {
        texto,
        inscrito,
    });
});

app.post('/verInscritos', (req, res) => {

    // lee si se seleccionó un curso para cerrar
    cambia = req.body.gridRadios;

    if (!cambia) {
        infoCursos = funciones.mostrar_inscritos();
        res.render('verInscritos', {
            informacion: infoCursos,
        })
    } else {
        funciones.actualizarCursos(cambia, 'cerrado')
        infoCursos = funciones.mostrar_inscritos();
        res.render('verInscritos', {
            informacion: infoCursos,
        })

    }
});

app.post('/eliminarInscritos', (req, res) => {
    Nombre_Cursos = funciones.mostrar_nombres_cursos();
    res.render('eliminarInscritos', {
        Nombre_Cursos,
    })
});

app.post('/eliminado', (req, res) => {
    idElimina = req.body.id;
    cursoElimina = req.body.nombreCurso;
    let texto = funciones.eliminarInscritos(cursoElimina, idElimina);
    res.render('eliminado', {
        mensaje: texto[0],
        permanecenInscritos: texto[1],
    })
});

app.post('/editarPerfiles', (req, res) => {
    id_verifica = req.body.id;
    if (!id_verifica) {
        res.render('editarPerfiles')
    } else {
        infoUsuario = funciones.verificarUsuarios(id_verifica);
        if (infoUsuario[0] == '1') {
            res.render('editarPerfiles', {
                mensaje: '<h2> Información del usuario </h2>',
                Formulario: `<div class="container px-5">
                    <form action="/editado" method="post">
                        <div class="form-row px-5 my-5 border border-dark">
                            <div class="form-group col-md-4 mt-5">
                                Identificación del usuario:
                                <input type="number" class="form-control" size="50" maxlength="50" value="${infoUsuario[1].id}" name="id" required>
                            </div>
        
                            <div class="form-group col-md-4 mt-5">
                                Nombre del Usuario:
                                <input type="text" class="form-control" size="50" maxlength="50" value="${infoUsuario[1].nombre}" name="nombre" required>
                            </div>
                            <div class="form-group col-md-4 mt-5">
                                Email:
                                <input type="text" class="form-control" size="50" maxlength="50" value="${infoUsuario[1].email}" name="email" required>
                            </div>
                            <div class="form-group col-md-4 mt-5">
                                Telefono:
                                <input type="number" class="form-control" size="50" maxlength="50" value="${infoUsuario[1].telefono}" name="tel" required>
                            </div>
                            <div class="form-group col-md-6 mt-5">
                                Seleccione el rol:
                                <select class="form-control" name="perfil" required>
                                <option>aspirante</option>
                                <option>docente</option>
                                </select>
                            </div>
                            <div class="form-group col-md-6 mt-4 ">
                                <button class="btn btn-dark mx-auto"> Enviar </button>
                            </div>
                            
                    </form>
                </div>`
            })
        } else {
            res.render('editarPerfiles', {
                mensaje: infoUsuario[1],
            })
        }
    }
});



app.post('/editado', (req, res) => {
    datos = {
        nombre: req.body.nombre,
        id: req.body.id,
        email: req.body.email,
        tel: req.body.tel,
        perfil: req.body.perfil,
    }
    let texto = funciones.editarUsuarios(datos);
    res.render('editado', {
        mensaje: texto[0],
        infoUsuario: texto[1],
    })
});

app.get('*', (req, res) => res.render('error'));

let port = process.env.PORT;
app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`);
})