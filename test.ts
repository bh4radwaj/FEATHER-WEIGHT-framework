#!/usr/bin/ts-node
import {Micro,getPostData,Resp,Req,urlDeocde} from './microFramework';
import * as path from 'path';
// import * as chalk from 'chalk';

let PORT = 5000;
//let app = new Micro(PORT);
let app = Micro();

let m1 = (req:Req,res:Resp)=>{
    console.log('new get request')
    //console.log(req.headers)
}

app.set('views',path.join(__dirname,'views/'))
app.set('secret','87rgfiuerhgigv')


app.get('/',(req:Req,res:Resp)=>{
    res.write("<h1>welcome to micro</h1>")
})

app.get('/redirect',(req:Req,res:Resp)=>{
    //req.redirect
    res.redirect('/about')
})

app.get('/render',(req:Req,res:Resp)=>{
    //render(res,'test.html')
    res.render('test.html')
})

app.get('/test',(req:Req,res:Resp)=>{
    req.session.new = "something_new"
    console.log(req.session.password)
    res.writes('test route')
})

app.get('/home',(req:Req,res:Resp)=>{
    req.session.uid = 'test';
    req.session.email = 'test@gmail.com'
    req.session.password = 'admin'
    //res.writeHead(200,{'session':'X-value'})
    //sessionEnd(req,res)
    //res.setCookie('hi','hoo')
    //res.write('home')
    //res.setHeader('Set-Cookie','name=test')
    res.writes('hello')
})

app.get('/about',(req:Req,res:Resp)=>{
    let cook = req.getCookie()
    console.log(cook)
    res.setCookie('greet','hello')
    //console.log(req.path)
    res.write('about')
})

app.post('/postRoute',async (req:Req,res:Resp)=>{
    let body:any = await getPostData(req);
    console.log(urlDeocde(body.uid))
    res.write('welcome to Micro')
    res.end()
})

app.listen(4000,()=> console.log(`server started at http://localhost:${PORT}`))
