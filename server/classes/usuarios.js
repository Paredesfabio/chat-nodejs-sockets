class Usuarios {

    constructor(){
        this.personas = [];
    }

    agregarPersona(id, nombre, sala){
        let persona = { id, nombre, sala };
        this.personas.push(persona);

        return this.personas;
    }

    getPersona(id){
        let persona = this.personas.filter( persona => persona.id === id )[0];

        return persona;
    }

    getPersonas(){
        return this.personas;
    }

    getPersonasPorSala(sala){
        let personasEnSala = this.personas.filter( persona => persona.sala === sala );
        return personasEnSala;
    }

    borrarPersona(id){

        let personaBorrada = this.getPersona(id);
        // creo un nuevo arreglo y excluyo la persona con el id enviado
        this.personas = this.personas.filter(persona => persona.id != id);
        return personaBorrada;

    }

}

module.exports = { 
    Usuarios 
};