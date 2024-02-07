const { Pool } = require("pg"); // reuse the existing connectiion automatically saving to the pool


const client = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password:"Bajji@#123",
    database: "employeedb"
});

module.exports = client





















// const {response} = require("express");

// ************* Create Table *****************

// ************** After Creating the database and need to create a table *********************


// const CreateTblQry = `create table account(user_id serial primary key ,
//     username varchar(100) not null,
//     password varchar(100) not null);`;

// pool.query(CreateTblQry).then((Response)=> {
//     console.log("Table Created")
//     console.log(response);
// }) 
// .catch((err) => {
    //     console.log(err);
    // });



// **************** create database **********************


// pool.query("CREATE DATABASE employeeDatabase;").then((Response)=> {
//     console.log("DATABASE Created")
//     console.log(response);
// }) 
// .catch((err) => {
//     console.log(err);
// });
