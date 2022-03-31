// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env")
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);

const getEntities = async function(){
    // todo
 
}
const filterEntities = async function(option){
   // todo
}
const createEntity = async function(entity){
    // todo
    
}
const removeEntity = async function(partitionKey,rowKey){
   // todo
    
}
const upsertEntity = async function(entity){
    // todo
}
const updateEntity = async function(entity){
    // todo
}
const tableClient = {
    client:serviceClient,
    getEntities,
    filterEntities,
    createEntity,
    removeEntity,
    upsertEntity,
    updateEntity
}

module.exports = tableClient;
