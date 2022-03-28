'use strict'

var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');
var path = require('path');

var tableClient = require('./service/tableClient')
var sampleData = require("./configure/data")

var app = express();

// log requests
app.use(logger('dev'));

app.use(express.static(path.join(__dirname, 'templates')));

app.use('/static', express.static(path.join(__dirname, 'templates')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());


var listOfKeys=["Temperature","Humidity","Barometer","WindDirection","WindSpeed","Precipitation"];

app.get('/getAllRows',async function(req,res){
    try{
        tableClient.getData()
    .then(res1=>{
        if(res1.code===0){
            res.send({code:res1.code,listOfKeys:listOfKeys,entitiesList:res1.data})
        }else{
            res.send({code:res1.code,msg:res1.error})
        }
    })
    }catch(err){
      console.log(err)
    }
    
})
app.post('/removeEntity',function(req,res){
    tableClient.removeEntity(req.body.partitionKey,req.body.rowKey).then(()=>{
        res.send({code:0})
    }
    )
    
})
app.post('/insertTableEntity',function(req,res){
    tableClient.createEntity(req.body).then(()=>{
        res.send({code:0})
    }
    )
    
})
app.post('/upsertTableEntity',function(req,res){
    tableClient.upsertEntity(req.body).then(()=>{
        res.send({code:0})
    }
    )
    
})
app.post('/insertExpandableData',function(req,res){
    const entity = {
        partitionKey:req.body.partitionKey,
        rowKey:req.body.rowKey,
        ...req.body.propertyMap
    }

    tableClient.createEntity(entity).then(()=>{
        res.send({code:0})
    }
    )
    
})
app.post('/upsertExpandableData',function(req,res){
    const entity = {
        partitionKey:req.body.partitionKey,
        rowKey:req.body.rowKey,
        ...req.body.propertyMap
    }

    tableClient.upsertEntity(entity).then(()=>{
        res.send({code:0})
    }
    )
    
})
app.post('/insertSampleData',async function(req,res){
    const insertData = sampleData.filter((item)=>{
        return item.partitionKey===req.body.city;
    })

    for (let entity of insertData){
        entity.rowKey = entity.rowKey + " " + entity.ObservationTime;
        await tableClient.createEntity(entity);
    }
    res.send({code:0})


})
app.post('/updateEntity',async function(req,res){
    const entity = {
        partitionKey:req.body.partitionKey,
        rowKey:req.body.rowKey,
        ...req.body.propertyMap
    }

    tableClient.updateEntity(entity).then(()=>{
        res.send({code:0})
    })

})

app.post('/getFilteredRows',async function(req,res){
    
    tableClient.filterData(req.body)
    .then(res1=>{
        res.send({code:0,listOfKeys:listOfKeys,entitiesList:res1})
    })
    
})
app.listen(3000);
console.log('listening on port 3000');

