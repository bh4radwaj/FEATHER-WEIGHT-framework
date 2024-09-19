#!/usr/bin/ts-node
import * as fs from 'fs';

//let v:any = "";
//let one = ()=>{
    //for(let i=0;i<9999999;i++){

    //}
    //fs.readFile("/home/bnk/progs/node/os.js",(data,err)=>{
        //if(err){
        //}
        //v = data
        //console.log(data)
    //})
//}
//let two = ()=>{
    //console.log(v)
//}
//one()
//two()


let Func = ()=>{
    return new Promise((resolve,reject)=>{
        for(let i=0;i<999999999;i++){}
        resolve("hello")
    })
};

let msg:any = "notUsed";
let one  = async ()=>{
   msg = await Func();
   console.log(msg)
}

let two = ()=>{
    if(msg==="notUsed"){
        console.log("notChangedYet")
    }
}

one()
two()
