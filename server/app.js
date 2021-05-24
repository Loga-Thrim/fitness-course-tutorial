const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const fileUpload = require("express-fileupload");
const urlMongo = "mongodb://localhost:27017";
const jwt = require("jsonwebtoken");
const UniqueStringGenerator = require('unique-string-generator');
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

const gc = new Storage({ 
    keyFilename: __dirname + "/fitness-course-314718-2edef56edd0f.json",
    projectId: 'fitness-course-314718'
})
const filesBucket = gc.bucket('video-course');

app.use(cors());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'/tmp'),
}))

mongo.connect(urlMongo, { useUnifiedTopology: true }, (err, db)=>{
    if(err) throw err;
    const dbcon = db.db("test");

    app.post("/insert-course", (req, res)=>{
        const { name, level } = req.body;
        req.files.img.mv(path.join(__dirname + "/../public/images/" + req.files.img.name), err=>{
            if(err) throw err;
            dbcon.collection("course").insertOne({name, level, img: req.files.img.name}, (err, doc)=>{
                if(err) throw err;
                res.send("success");
            })
        })
    })
    app.put("/course", (req, res)=>{
        const { id, name, level } = req.body;

        if(req.files){
            req.files.img.mv(path.join(__dirname + "/../public/images/" + req.files.img.name), (err, resultMv)=>{
                if(err) throw err;
            })
        }
        let fileName = "";
        if(req.files) fileName = req.files.img.name;
        const dataSet = {
            $set: {
                name, level, img: fileName
            }
        }
        if(!name) delete dataSet.$set.name;
        if(!level) delete dataSet.$set.level;
        if(!req.files) delete dataSet.$set.img;

        dbcon.collection("course").updateOne({_id: ObjectId(id)}, dataSet, (err, doc)=>{
            if(err) throw err;
            res.json({status: "success"});
        })
    })
    app.get("/get-course", (req, res)=>{
        dbcon.collection("course").find({}).toArray((err, result)=>{
            if(err) throw err;
            res.json({courses: result});
        })
    })
    app.post("/insert-level", (req, res)=>{
        const { name, price, level } = req.body;
        const id = "60a154ea250f774d8c38f677";

        const fileName = UniqueStringGenerator.UniqueStringId() + "." + 
        req.files.video.name.split(".").slice(-1)[0];

        req.files.video.mv(path.join(__dirname + "/../public/videos/" + fileName), err=>{
            if(err) throw err;

            dbcon.collection("course").update({_id: ObjectId(id)}, {$push: {level: {
                name, price, level, video: fileName
            }}}, (err, doc)=>{
                if(err) throw err;
                res.json({status: "success"})
            })
        })
    })
    app.get("/get-one-course/:id", (req, res)=>{
        const id = req.params.id;
        dbcon.collection("course").findOne({_id: ObjectId(id)}, (err, result)=>{
            if(err) throw err;
            res.json({course: result});
        })
    })
    app.post("/savehistory", (req, res)=>{
        const { dataLevel, total } = req.body;
        const objQuery = {
            $push: {
                level: {
                    total,
                    date: "2021:05:07",
                    time: "20:54",
                    nameCourse: "สร้างซิกแพ็ค",
                    level: dataLevel
                }
            }
        }
        dbcon.collection("user").updateOne({name: "Frame"}, objQuery, (err, doc)=>{
            if(err) throw err;
            res.end()
        })
    })
    app.post("/login", (req, res)=>{
        const { username, password } = req.body;
        dbcon.collection("user").findOne({username, password}, (err, result)=>{
            if(err) throw err;
            
            if(result){
                const { _id, name, weight, height, phoneNumber } = result;
                const token = jwt.sign({
                    _id, name, weight, height, phoneNumber
                }, 'dc7fea60godframedark86547812548965');

                res.json({token});
            } else{
                res.json({token: ""});
            }
        })
    })
    app.post("/login-check", (req, res)=>{
        const { token } = req.body;
        jwt.verify(token, 'dc7fea60godframedark86547812548965', function(err, decoded) {
            if(err) throw err;
            dbcon.collection("user").findOne({_id: ObjectId(decoded._id)}, (err, result)=>{
                if(err) throw err;
                const { name, weight, height, phoneNumber } = result;
                res.json({
                    status: "success",
                    name, weight, height, phoneNumber
                })
            })
        });
    })
    app.post("/upload-videos", async (req, res)=>{
        const { videos } = req.files;

        async function mvFile(i){
            return new Promise((resolve, reject)=>{
                const fileName = UniqueStringGenerator.UniqueStringId() + "." + 
                videos[i].name.split(".").slice(-1)[0];
                videos[i].mv(__dirname + "/videos/" + fileName, err=>{
                    if(err) throw err;
                    filesBucket.upload(__dirname + "/videos/" + fileName, (err, file)=>{
                        if(err) throw err;
                        fs.unlinkSync(__dirname + "/videos/" + fileName);
                        resolve(fileName);
                    })
                })
            })
        }
        let arr = [];
        for(let i=0;i<videos.length;++i){
            const fileName = await mvFile(i);
            await arr.push(ObjectId(fileName));

            if(i == videos.length - 1){
                dbcon.collection("course").update({_id: arr}, {$push: {level: {
                    name, price, level, video: fileName
                }}}, (err, doc)=>{
                    if(err) throw err;
                    res.json({status: "success"})
                })
                res.json({fileName: arr});
            }
        }
    })

    app.get("/verify-bucket", (req, res)=>{
        const storage = new Storage();
        async function listBuckets() {
          try {
            const results = await storage.getBuckets();
  
            const [buckets] = results;
  
            console.log('Buckets:');
            buckets.forEach(bucket => {
              console.log(bucket.name);
            });
          } catch (err) {
            console.error('ERROR:', err);
          }
        }
        listBuckets();
    })
})

app.listen(5000, ()=>{
    console.log("> App on port 5000");
})