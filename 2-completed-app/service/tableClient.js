const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env")
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);

const getData = async function(){
    try{
        const resArray = [];
        const res = serviceClient.listEntities();
    
        for await(const entity of res){
            resArray.push(entity)
        }
        return {code:0,data:resArray};
    }catch(Error){
        return {code:1,error:Error};
    }
 
}
const filterData = async function(option){
    const resArray = [];
    const filters = [];
    if(option.partitionKey!==null){
        filters.push(`PartitionKey eq '${option.partitionKey}'`)
    }
    if(option.rowKeyDateStart!==null &&option.rowKeyTimeStart!==null){
        let startTime = option.rowKeyDateStart + " " + option.rowKeyTimeStart;
        filters.push(`RowKey ge '${startTime}'`)
    } 
    if(option.rowKeyDateEnd!==null &&option.rowKeyTimeEnd!==null){
        let endTime = option.rowKeyDateEnd + " " + option.rowKeyTimeEnd;
        filters.push(`RowKey le '${endTime}'`)
    }
    if(option.minTemperature!==null){
        filters.push(`Temperature ge ${option.minTemperature}`)
    } 
    if(option.maxTemperature!==null){
        filters.push(`Temperature le ${option.maxTemperature}`)
    }
    if(option.minPrecipitation!==null){
        filters.push(`Precipitation ge ${option.minPrecipitation}`)
    }
    if(option.maxPrecipitation!==null){
        filters.push(`Precipitation le ${option.maxPrecipitation}`)
    }
    try{
        const res = serviceClient.listEntities({
            queryOptions:{
                filter:filters.join(" and ")
            }
        });
        for await(const entity of res){
            resArray.push(entity)
        }
    }catch(error){
        console.log(error)
    }
    
    return resArray;
}
const createEntity = async function(entity){
    try{
        await serviceClient.createEntity(entity);
    }catch(err){
        console.log(err)
    }
    
    
}
const removeEntity = async function(partitionKey,rowKey){
    try{
        await serviceClient.deleteEntity(partitionKey,rowKey);
    }catch(error){
        console.log(error)
    }
    
}
const upsertEntity = async function(entity){
    try{
        await serviceClient.upsertEntity(entity,'Merge');
    }catch(error){
        console.log(error);
    }
}
const updateEntity = async function(entity){
    try{
        await serviceClient.updateEntity(entity,'Replace');
    }catch(error){
        console.log(error)
    }
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
