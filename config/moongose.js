import mongoose from "mongoose";

const run = async() =>{
      const db = await mongoose.connect(process.env.uri).then(()=>{
          console.log('connected to database');
      },(reason)=>{
        console.log(`Not connected to database `);
        throw reason;
      }).catch((err)=>{ console.log(err);}  ); 
      coms
    }
export { run};