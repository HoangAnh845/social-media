import mysql from "mysql"

const db = mysql.createConnection({
  host:"localhost",
  user:"root",
  password:"",
  database:"social"
})

db.connect((err)=>{
    if(err){
        console.log("ERROR_____",err)
    }else{
        console.log("Connected successfully")
    }
})

export default db;