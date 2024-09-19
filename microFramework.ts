#!/usr/bin/ts-node
//the basic of this is class object midification. you can add or alter methods of objects using this or self
import * as http from 'http';
import * as fs from 'fs';
// import * as chalk from 'chalk';
import * as cookie from 'cookie';
import * as crypto from 'crypto';
import * as path from 'path';

//let AA = (req,res)=>{
    //res.write('hello from http')
    //res.end()
//}

//let a = {a:'a'b:'b'}
export let urlDeocde = (str:string)=>{
    let last:any = str.split("%40")
    last = last.join("@")
    last = last.split("%21")
    last = last.join("!")
    last = last.split("+")
    last = last.join(" ")
    last = last.split("%2B")
    last = last.join("+")
    last = last.split("%23")
    last = last.join("#")
    last = last.split("%24")
    last = last.join("$")
    last = last.split("%25")
    last = last.join("%")
    last = last.split("%26")
    last = last.join("&")
    last = last.split("%5E")
    last = last.join("^")
    last = last.split("%28")
    last = last.join("(")
    last = last.split("%29")
    last = last.join(")")
    last = last.split("%3D")
    last = last.join("=")
    last = last.split("%5B")
    last = last.join("[")
    last = last.split("%5D")
    last = last.join("]")
    last = last.split("%7B")
    last = last.join("{")
    last = last.split("%7D")
    last = last.join("}")
    return last
}



let getPostData = (req:Req)=>{
    let body:any = '';
    let splits = [];
    return new Promise((resolve,rejects)=>{
        req.on('data',(data:any)=>{
            body+=data.toString()
        })
        req.on('end',()=>{
            //console.log(body)
            let hit = true;
            //body.forEach((l)=>{
                //if(l==='='){
                    //hit=true
                //}
            //})
            if(hit){
                let values:any = [];
                let sub_ = body.split('&')
                sub_.forEach((s:any)=>{
                    let sub__ = s.split('=')
                    values[values.length] = sub__
                    //values.push(sub__)
                })
                //console.log(values)
                let last:string = '';
                let len = values.length;
                let i = 1;
                values.forEach((val:any)=>{
                    //if(i==1) console.log(val)
                    if(i==len){
                       last+=`"${val[0]}":"${val[1]}"`
                    }
                    else{
                       last+=`"${val[0]}":"${val[1]}",`
                    }
                   i++;
                })
                //console.log(last)
                last = `{${last}}`
                //let dup_dict = `{${last}}`
                //console.log(dup_dict)
                //let arr = dup_dict.split('"');
                ////arr.reverse()
                //arr.pop()
                //arr[arr.length] = '}'
                //console.log(arr)
                //arr.forEach((ar)=>{
                //})
                //console.log(`last:${last}`)
                //console.log(last)
                let dict = JSON.parse(last);
                //console.log(dict)
                resolve(dict)

            }
            //}
        })
    })
}

export interface Resp extends http.ServerResponse{
    render:(filename:string)=>void;
    redirect:(url:string)=>void;
    setCookie:(key:string,value:string,options?:object)=>void;
    setSession:(key:string,value:string)=>void;
    writes:(str:string)=>void;
}
export interface Req extends http.IncomingMessage{
    getCookie:Function;
    //getSession:Function;
    session:any;
}
export interface Methoder{
    path:string;
    func:Function;
    middle?:Function;
}

export let sessionEnd = (req:Req,resp:Resp)=>{
    let stringed = JSON.stringify(req.session)
    //console.log(stringed)
    resp.writeHead(200,{'Set-Cookie':stringed})
}
type keys = "views" | "secret";
//interface Cro_{
    //set(option:keys,values:string)=>void;
    //set(option:keys,values:string)=>void;
    //set(option:keys,values:string)=>void;
    //set(option:keys,values:string)=>void;
    //set(option:keys,values:string)=>void;
//}
//let render = (resp:any,file:string)=>{
    //console.log(file)
    //resp.writeHead(201,{'Content-Type':'text/html'})
//}

//the CORE of framework
class cro {
    static readonly greet:string = "welcome to Micro"
    private port:number = 3000;
    private gets:Methoder[] = [];
    private posts:Methoder[] = [];
    private puts:Methoder[] = [];
    private dels:Methoder[] = [];
    private public_folder:string = ""
    private views:string= ""
    private secret:string= ""
    constructor(){
        //this.port = p;
        this.gets = [];
        this.posts = [];
        this.dels = [];
        this.puts = [];
        console.log(cro.greet)
    }
    set(option:keys,value:string){
        switch(option){
            case 'views':
                this.views = value
                break;
            case 'secret':
                this.secret = value
                break;
        }
    }
    get(path:string,func:Function,middle?:Function){
        let obj:Methoder= {
            path,
            func
        }
        if(middle){
            obj.middle = middle
        }
        this.gets.push(obj);
    }
    post(path:string,func:Function,middle?:Function){
        let obj:Methoder = {
            path,
            func,
        }
        if(middle){
            obj.middle = middle
        }
        this.posts.push(obj);
    }
    put(path:string,func:Function,middle?:Function){
        let obj:Methoder = {
            path,
            func,
        }
        if(middle){
            obj.middle = middle
        }
        this.puts.push(obj);
    }
    delete(path:string,func:Function,middle?:Function){
        let obj:Methoder = {
            path,
            func,
        }
        if(middle){
            obj.middle = middle
        }
        this.dels.push(obj);
    }

    listen(port:number,callback:Function){
        this.port = port;
        http.createServer(async(req:any, resp:any) => {
            req.session = {}
            if(req.headers.cookie){
                console.log(req.headers.cookie)
                //let sess = JSON.parse(req.headers.cookie.split(';')[0])
                let data_incoming:any = req.headers.cookie;
                console.log(data_incoming)
                data_incoming = cookie.parse(data_incoming)
                data_incoming = data_incoming['decrypt_it']
                const algorithm_ = "aes-192-cbc";
                let key = crypto.scryptSync(this.secret,'salt',24)
                let decipher = crypto.createDecipher(algorithm_,key);

                let decrypted = '';
                decipher.on('readable',()=>{
                    let chunk;
                    while(null!==(chunk=decipher.read())){
                        decrypted += chunk.toString('utf-8')
                    }
                })
                decipher.on('end',()=>{
                    //console.log('decrypted::::',decrypted)
                    let sess = JSON.parse(decrypted)
                    req.session = sess;
                })
                decipher.write(data_incoming,'hex');
                decipher.end()
            }

            req.getCookie = ()=>{
                //console.log(req.headers)
                return cookie.parse(req.headers.cookie)
            }
            resp.writes = (str:string)=>{
                let stringed = JSON.stringify(req.session)
                //console.log(stringed)


                const algorithm = "aes-192-cbc";
                //const salt = "h";
                let key = crypto.scryptSync(this.secret,'salt',24);
                let cipher = crypto.createCipher(algorithm,key)

                let encrypted = '';
                cipher.on('readable',()=>{
                    let chunk;
                    while(null !== (chunk = cipher.read())){
                        encrypted+=chunk.toString('hex')
                    }
                    //console.log('cookie',encrypted)
                })

                cipher.on('end',()=>{
                    encrypted = 'decrypt_it='+encrypted
                    resp.writeHead(200,{'Set-Cookie':encrypted})
                    resp.write(str)
                })
                cipher.write(stringed);
                cipher.end()
            }

            //let sessionEnd = (req:Req)=>{
                //let stringed = JSON.stringify(req.session)
                //console.log(stringed)
                //resp.writeHead(202,{'session':stringed})
            //}

            resp.setCookie = (key:string,value:string,options?:object)=>{
                 let cooked = cookie.serialize(key,value,options)
                 resp.writeHead(200,{'Set-Cookie':cooked})
            }


            //resp.setSession()

            resp.render = (file:string) =>{
                let data = fs.readFileSync(this.views+file);
                //console.log(data.toString().replace('\n',''));
                //console.log(file)
                resp.writeHead(200,{'Content-Type':'text/html'})
                resp.write(data.toString())
            }

            resp.redirect = (path:string)=>{
                resp.writeHead(301,{'Location':path})
                resp.end()
            }

            let url_hit:boolean;
            url_hit = false;
            if (req.method=='GET'){
                this.gets.forEach((obj)=>{
                    if(req.url==obj.path){
                        url_hit = true;
                        if(obj.middle){
                            obj.middle(req,resp)
                        }
                        setTimeout(()=>{
                            obj.func(req,resp)
                        },5)
                        //req.session.end = ()=>{
                            //let stringed = JSON.stringify(req.session)
                            //console.log(stringed)
                            //resp.writeHead(202,{'session':stringed})
                        //}
                        setTimeout(()=>{
                            resp.end()
                        },10)
                    }
                })
            }
            else if (req.method=='POST'){
                this.posts.forEach((obj)=>{
                    if(req.url==obj.path){
                        url_hit = true;
                        if(obj.middle) obj.middle(req,resp)
                        obj.func(req,resp)
                        //resp.end()
                    }
                })
            }
            if(!url_hit){
                resp.statusCode = 404;
                resp.end()
            }
        }).listen(this.port);
        callback()

    }

}

let Micro = ():cro=>{
    return new cro()
}
export {Micro,getPostData}
