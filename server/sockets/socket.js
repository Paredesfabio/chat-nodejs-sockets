const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();

const { crearMensaje } = require('../utilidades/utilidades');


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {


        if( !data.usuario.nombre || !data.usuario.sala ){
            let err = {
                error: true,
                mensaje: 'El nombre/sala es necesario'
            };            
            return callback(err);
        }

        // unir al usuario a una sala de chat
        client.join(data.usuario.sala);

        usuarios.agregarPersona( client.id, data.usuario.nombre, data.usuario.sala ); 

        // listar las personas de esa sala de chat
        client.broadcast.to(data.usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.usuario.sala));
        client.broadcast.to(data.usuario.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.usuario.nombre} se unio al chat`));

        callback( usuarios.getPersonasPorSala(data.usuario.sala) );

    });
 
    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona( client.id );
        let mensaje = crearMensaje( persona.nombre, data.mensaje );
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona( client.id );
        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} abandono el chat`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    });

    // Mensaje Privado
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        // Al broadcast se le agrega el to.( id del usuario )
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });    

});