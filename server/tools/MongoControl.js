const mongodb = require("mongodb")
const mongoUrl = "mongodb://localhost:27017"
// 创建客户端
const MongoClient = mongodb.MongoClient
// 引入ObjectId
const ObjectId = mongodb.ObjectId


// 函数执行后，自动返回对象
// 构造器
var MongoControl = function (dbName, collectionName) {
    this.db = dbName
    this.coll = collectionName
    // 添加数据
    this.insertOneData = function (newData, callback) {
        mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('数据库在连接数据的时候出错，错误为：')
                console.log(err)
                return
            } else {
                // 选库
                var db = client.db(this.db)
                // 选表  
                var coll = db.collection(this.coll)
                //插入数据
                coll.insertOne(newData, (err, res) => {
                    // if(err){
                    //     console.log('数据库在插入数据的时候出错，错误为：')
                    //     console.log(err)
                    //     return
                    // }else{
                    // console.log('添加数据成功')
                    // console.log(res.result)

                    //返回参数 
                    callback(res, err)
                    client.close()
                    // }
                })
            }
        })
    }
    //插入多个数据
    this.insertManyData= function(newDataArr,callback){
        mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('数据库在连接数据的时候出错，错误为：')
                console.log(err)
                return
            } else {
                // 选库
                var db = client.db(this.db)
                // 选表  
                var coll = db.collection(this.coll)
                //插入数据
                coll.insertMany(newDataArr, (err, res) => {
                    if(err){
                        console.log('数据库在插入数据的时候出错，错误为：')
                        console.log(err)
                        return
                    }else{
                    // console.log('添加数据成功')
                    // console.log(res.result)

                    //返回参数 
                    callback(res, err)
                    client.close()
                    }
                })
            }
        })
    } 
    // 删除数据
    this.deleteOneData = function (findConditionObj, callback) {
        mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('数据库在连接数据的时候出错，错误为：')
                console.log(err)
                return
            } else {
                // 选库
                var db = client.db(this.db)
                // 选表  
                var coll = db.collection(this.coll)
                //插入数据
                coll.deleteOne(findConditionObj, (err, res) => {
                    // if(err){
                    //     console.log('数据库在删除数据的时候出错，错误为：')
                    //     console.log(err)
                    //     return
                    // }else{
                    //     console.log('删除数据成功')
                    //     console.log(res.result)

                    //返回参数 
                    callback(res, err)
                    client.close()
                    // }
                })
            }
        })
    }
    // 根据id数据删除
    this.deleteOneDataById = function (idNum,callback) {
        var conditionObj = { _id: ObjectId(idNum) }
        this.deleteOneData(conditionObj,callback) 
            
    }
    // 查询数据
    this.findData = function (findConditionObj, callback) {
        mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('数据库在连接数据的时候出错，错误为：')
                console.log(err)
                return
            } else {
                // 选库
                var db = client.db(this.db)
                // 选表  
                var coll = db.collection(this.coll)
                //插入数据
                coll.find(findConditionObj).toArray((err, res) => {
                    // if(err){
                    //     console.log('数据库在查询数据的时候出错，错误为：')
                    //     console.log(err)
                    //     return
                    // }else{
                    //     console.log('查询数据成功')
                    // 打印res
                    // console.log(res)

                    //返回参数 
                    callback(res, err)
                    client.close()
                    // }
                })
            }
        })
    }
    // 根据id数据查询
    this.findDataById = function (idNum,callback) {
        var conditionObj = { _id: ObjectId(idNum) }
        this.findData(conditionObj, callback)
    }
    // 更改数据
    this.updateOneData = function (findConditionObj, newObj, callback) {
        mongodb.MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
            if (err) {
                console.log('数据库在连接数据的时候出错，错误为：')
                console.log(err)
                return
            } else {
                // 选库
                var db = client.db(this.db)
                // 选表  
                var coll = db.collection(this.coll)
                //插入数据
                coll.updateOne(findConditionObj, { $set: newObj }, (err, res) => {
                    // if(err){
                    //     console.log('数据库在更改数据的时候出错，错误为：')
                    //     console.log(err)
                    //     return
                    // }else{
                    //     console.log('更改数据成功')
                    //     console.log(res.result)

                    //返回参数 
                    callback(res, err)
                    client.close()
                    // }
                })
            }
        })
    }
    // 根据id数据修改
    this.updateOneDataById = function (idNum, newData,callback) {
        var conditionObj = { _id: ObjectId(idNum) }
        this.updateOneData(conditionObj, newData, callback)
    }
}

const biao1 = new MongoControl('iku', 'biao1')

// 引出
module.exports=MongoControl