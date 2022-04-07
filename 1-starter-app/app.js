// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
"use strict";

var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var cors = require("cors");
var path = require("path");
var open = require("open");

var tableClient = require("./service/tableClient");
var sampleData = require("./configure/data");

var app = express();

// log requests
app.use(logger("dev"));

app.use(express.static(path.join(__dirname, "templates")));

app.use("/static", express.static(path.join(__dirname, "templates")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var listOfKeys = [
  "Temperature",
  "Humidity",
  "Barometer",
  "WindDirection",
  "WindSpeed",
  "Precipitation",
];

app.get("/getAllRows", async function (req, res) {
  try {
    const entities = await tableClient.getEntities();
    res.send({ listOfKeys: listOfKeys, entitiesList: entities });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/removeEntity", async function (req, res) {
  try {
    await tableClient.removeEntity(req.body.partitionKey, req.body.rowKey);
    res.send({ responseText: "remove success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/insertTableEntity", async function (req, res) {
  try {
    await tableClient.insertEntity(req.body);
    res.send({ responseText: "insertTableEntity success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/upsertTableEntity", async function (req, res) {
  try {
    await tableClient.upsertEntity(req.body);
    res.send({ responseText: "upsertTableEntity success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/insertExpandableData", async function (req, res) {
  const entity = {
    partitionKey: req.body.partitionKey,
    rowKey: req.body.rowKey,
    ...req.body.propertyMap,
  };

  try {
    await tableClient.insertEntity(entity);
    res.send({ responseText: "insertExpandableData success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/upsertExpandableData", async function (req, res) {
  const entity = {
    partitionKey: req.body.partitionKey,
    rowKey: req.body.rowKey,
    ...req.body.propertyMap,
  };

  try {
    await tableClient.upsertEntity(entity);
    res.send({ responseText: "upsertExpandableData success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/insertSampleData", async function (req, res) {
  const insertData = sampleData.filter((item) => {
    return item.PartitionKey === req.body.city;
  });
  try {
    for (let entity of insertData) {
      entity.RowKey = entity.RowKey + " " + entity.ObservationTime;
      await tableClient.insertEntity(entity);
    }
    res.send({ responseText: "insertSampleData success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/updateEntity", async function (req, res) {
  const entity = {
    partitionKey: req.body.partitionKey,
    rowKey: req.body.rowKey,
    ...req.body.propertyMap,
  };
  try {
    await tableClient.updateEntity(entity);
    res.send({ responseText: "updateEntity success" });
  } catch (error) {
    res.status(error.statusCode).send({ msg: error });
  }
});

app.post("/getFilteredRows", async function (req, res) {
  try {
      const queryOptions = {...req.body};
      if(queryOptions.rowKeyDateStart){
        queryOptions.rowKeyDateTimeStart=queryOptions.rowKeyDateStart
      }
      if(queryOptions.rowKeyTimeStart){
          if(queryOptions.rowKeyDateTimeStart){
            queryOptions.rowKeyDateTimeStart += ` ${queryOptions.rowKeyTimeStart}`;
          }else{
            queryOptions.rowKeyDateTimeStart=queryOptions.rowKeyTimeStart;
          }
        
      }
      if(queryOptions.rowKeyDateEnd){
        queryOptions.rowKeyDateTimeEnd=queryOptions.rowKeyDateEnd
      }
      if(queryOptions.rowKeyTimeEnd){
          if(queryOptions.rowKeyDateTimeEnd){
            queryOptions.rowKeyDateTimeEnd += ` ${queryOptions.rowKeyTimeEnd}`;
          }else{
            queryOptions.rowKeyDateTimeEnd=queryOptions.rowKeyTimeEnd;
          }
        
      }
    const filterEntities = await tableClient.filterEntities(queryOptions);
    res.send({ listOfKeys: listOfKeys, entitiesList: filterEntities });
  } catch (error) {
      console.log(error)
    res.status(error.statusCode).send({ msg: error });
  }
});

app.listen(3000);
console.log("listening on port 3000");

open("http://localhost:3000/index.html");
