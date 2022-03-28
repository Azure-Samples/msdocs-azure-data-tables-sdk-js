const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env")
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);

const getData = async function(){
    // todo
 
}
const filterData = async function(option){
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
    getData,
    filterData,
    createEntity,
    removeEntity,
    upsertEntity,
    updateEntity
}

module.exports = tableClient;
