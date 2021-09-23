const { Client } = require('pg');

// const client = new Client({
//     connectionString: 'postgresql://postgres:admin@localhost:5432/alwaysmusic'
//     });
const config = {
    user: 'postgres',
    host: 'localhost',
    database: 'alwaysmusic',
    password: 'admin',
    port: 5432,
}
// CREATE TABLE estudiante (
//     id SERIAL PRIMARY KEY,
//     nombre varchar(50) NOT NULL,
//     rut varchar(12) NOT NULL,
//     curso varchar(10) NOT NULL,
//     nivel int NOT NULL
// );
const client = new Client(config);
client.connect()

const argumentos = process.argv.slice(2);

console.log(argumentos);

//insert into estudiante (nombre, rut, curso, nivel) values ('Eric Leiva', '1.111.111-1','violin','10')

if (argumentos[0] == 'nuevo'){   //Si el primer argumento es nuevo, significa insertar un nuevo registro

    const nombre = argumentos[1];
    const rut = argumentos[2];
    const curso = argumentos[3];
    const nivel = argumentos[4];
    ingresar( nombre, rut, curso, nivel);

}else if (argumentos[0] == 'rut' ) {  //Si el primer argumento es rut significa una consulta por medio del rut
    const rut = argumentos[1];
    console.log(rut);
    consultaRut( rut );
}else if (argumentos[0] == 'consulta'){ //Si el primer argumento es consulta significa consultar todos los registros
    consultaTodes();
}else if( argumentos[0] == 'editar'){ // Si el primer argumento es editar significar editar un nuevo registro
    const nombre = argumentos[1];
    const rut = argumentos[2];
    const curso = argumentos[3];
    const nivel = argumentos[4];
    editar( nombre, rut, curso, nivel);
} else if ( argumentos[0] == 'eliminar'){ //Si el primer argumento es eliminar significa eliminar por medio del rut
    const rut = argumentos[1];
    eliminar( rut );
}

async function ingresar( nombre, rut, curso, nivel) {
    const res = await client.query(
        `insert into estudiante (nombre, rut, curso, nivel) values ('${nombre}', '${rut}', '${curso}','${nivel}') RETURNING *; `);
        console.log(res);
        console.log('Registro agregado con exito');
    client.end();
}

async function consultaRut( rut ) {

    const res = await client.query(
    `SELECT NOMBRE, RUT, CURSO, NIVEL FROM estudiante WHERE rut = '${rut}'`
    );

    console.log('Registros: ', res.rows);

    client.end();
}
async function consultaTodes() {

    const res = await client.query(
    `SELECT NOMBRE, RUT, CURSO, NIVEL FROM estudiante;`
    );

    console.log('Registros: ', res.rows);
    
    client.end();
}
async function editar( nombre, rut, curso, nivel ) {
    
    const res = await client.query(
        `UPDATE estudiante SET NOMBRE = '${nombre}',
                                CURSO = '${curso}',
                                NIVEL = '${nivel}'
                                WHERE rut = '${rut}' RETURNING *;`
    );
    
    console.log('Registro modificado', res.rows[0]);
    
    console.log('Cantidad de registros afectados', res.rowCount);
    client.end();
}
async function eliminar( rut ) {
    
    const res = await client.query(
        `DELETE FROM estudiante where rut = '${rut}'`
    );

    console.log('Cantidad de registros afectados', res.rowCount);
    client.end();
}
