export interface UsuarioRegistro {
    nombre: string;
    correo: string;
    contrasena: string;
}

export interface UsuarioLogin {
    correo: string;
    contrasena: string;
}

export interface UsuarioRespuesta {
    id: number;
    nombre: string;
    correo: string;
}