var mysql = require("mysql");
var ERROR = 0;
var conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "baseprueba"
})

conexion.connect((err)=>{
    if(err) throw err 
        console.log("funca");
    
})
var insertar = "INSERT INTO usuarios (nombre,contrasena) VALUES ('anuel','holanuel');"

conexion.query(insertar,(err,rows) =>{
    if(err) throw err
        ERROR = 1;

    if(ERROR == 0){
        console.log("error");
    }else{
        console.log("esta es la data");
        console.log(rows);
    }
});
ERROR = 0;
conexion.query("SELECT * from usuarios",(err,rows) =>{
    if(err) throw err 
        ERROR = 1;
    if(ERROR == 0){
        console.log("error");
    }else{
        console.log("esta es la data");
        console.log(rows);
    }
});
conexion.end();