const express = require('express')
const router = express.Router()
const formidable = require('formidable')
const moment = require('moment')
const fs = require('fs')
const path = require('path')
const MongoControl = require('./tools/MongoControl')

const user = new MongoControl('b', 'user')
const video = new MongoControl('b','video')
router.get('/' , function(req,res){
    console.log(req.url)
})
// 注册模块
router.post('/zhuce', (req, res) => {
    const { username, password } = req.body
    res.setHeader('Access-Control-Allow-Origin', '*')
    user.findData({ username: username }, (e, err) => {
        if (e == '') {
            user.insertOneData({ username: username, password: password }, (e, err) => {
                console.log(e.result)
                res.send(e)
            })
        } else {
            console.log(e)
            res.send(e)
        }
    })
})
// 登录模块
router.post('/login', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    const { username, password } = req.body
    if (username == '' || password == '') {
        res.redirect('http://localhost:3000/login')
    } else {
        user.findData({ username: username }, (e, err) => {
            var a = e[0].password
            if (a == password) {
                res.send(username)
            } else {
                res.send(false)

            }
        })
    }
})

// 上传模块
router.post('/publish',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    // 初始化formidable
    var form = new formidable.IncomingForm()
    // 设置视频上传位置
    form.uploadDir = path.resolve(__dirname,'./data/video')
    // 获取表单上传内容，files包含了前端发送过来的数据信息
    form.parse(req,function(err,fields,files){
        console.log(fields)
        // 获取文件原地址
        var oldPath = files.video.path
        // 用moment插件生成时间
        var time = moment(new Date).format('YYYYMMDDHHmmss')
        // 生成随机数，防止重复
        var rand = parseInt(Math.random()*8999+10000)
        // 获取拓展名
        var extname = path.extname(files.video.name)
        // 创建新名字
        var newPath = path.resolve(__dirname,'./data/video/'+time+rand+extname)
        console.log(newPath)
        // 对传入的文件进行改名并移动到具体目录下
        fs.rename(oldPath,newPath,function(err){
            if(err){
                throw Error("改名失败")
            }else{
                video.insertOneData({name:time+rand+extname,sort:fields.sort,title:fields.title,introduction:fields.introduction,username:fields.username,state:"0"},()=>{
                    res.redirect('http://localhost:3000')
                })
            }
        })
    })
})



// 传视频文件
router.post('/video',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    var {name} = req.body
    res.sendFile(name)
})

// 按钮通过模块
router.post('/pass',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {state,name} =req.body
    console.log(state,name)
        video.updateOneData({name:name},{state:state},(e,err)=>{
            res.send(e)
        })    
})
// 按钮不通过模块
router.post('/noPass',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {state,name} =req.body
        video.updateOneData({name:name},{state:state},(e,err)=>{
            res.send(e)
        })    
})
// 通过文件名获取信息
router.post('/content',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {name} =req.body
    video.findData({name:name},(e,err)=>{
        res.send(e)
    })
})

// 通过用户名获取信息
router.post('/list',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {username} =req.body
    video.findData({username:username},(e,err)=>{
        res.send(e)
    })
})
// 获取已通过视频资源
router.post('/getList',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {state}=req.body
    video.findData({state:state},(e,err)=>{
        res.send(e)
    })
})

// 添加评论
router.post('/pinglun',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {name,username,text}=req.body
    video.findData({name:name},(e,err)=>{
        console.log(e)
        if(e[0].pl == undefined){
            video.updateOneData({name:name},{pl:[{username:username,text:text,moment:moment(new Date).format('YYYY-MM-DD hh:mm')}]},(e,err)=>{
                res.send(e)
            })
        }else{
            var arr =[]
            arr = e[0].pl
            arr.push({username:username,text:text,moment:moment(new Date).format('YYYY-MM-DD hh:mm')})
            video.updateOneData({name:name},{pl:arr},(e,err)=>{
                res.send(e)
            })
        }
    })
})
// 添加弹幕
router.post('/danmu',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    var {name,time,text}=req.body
    video.findData({name:name},(e,err)=>{
        console.log(e)
        if(e[0].danmu == undefined){
            video.updateOneData({name:name},{danmu:[{text:text,time:time}]},(e,err)=>{
                res.send(e)
            })
        }else{
            var arr =[]
            arr = e[0].danmu
            arr.push({text:text,time:time})
            video.updateOneData({name:name},{danmu:arr},(e,err)=>{
                res.send(e)
            })
        }
    })
})

// 判断cookie跳转模块
router.get('/tiaozhuan', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); //cros跨域必须指定允许的域名
    res.setHeader('Access-Control-Allow-Credentials' ,true);  //设置允许携带cookie  

    if (req.cookies.username != null) {        
        res.send(req.cookies.username)
    }
})
// 删除cookie模块
router.get('/tuichu',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); //cros跨域必须指定允许的域名
    res.setHeader('Access-Control-Allow-Credentials' ,true);  //设置允许携带cookie  
    res.clearCookie('username',{domain:'localhost',path:'/'})
    res.send(true)
})
// 获取视频列表模块
router.get('/getList',(req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    video.findData({},(e,err)=>{
        res.send(e)
    })
})
// 视频资源上传模块
router.get('/server/data/video/:id',function(req,res){
    var id = req.params.id
    let head = {'Content-Type':'video/mp4'};
    // 设置http head
    res.writeHead(200,head);
    // 使用pipe
    fs.createReadStream('./data/video/'+id)
    .pipe(res);
})
// 图片资源上传
router.get('/server/data/picture/:name',function(req,res){
    var name = req.params.name
    let head = {'Content-Type':'image/png'};
    // 设置http head
    res.writeHead(200,head);
    // 使用pipe
    fs.createReadStream(`./data/picture/${name}.png`)
    .pipe(res);
})
module.exports = router