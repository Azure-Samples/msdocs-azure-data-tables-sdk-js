const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env");
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);

// get all entities
const getEntities = async function () {
  const entitiesArray = [];
  const res = serviceClient.listEntities();

  for await (const entity of res) {
    entitiesArray.push(entity);
  }
  return entitiesArray;
};
const filterEntities = async function (option) {
  const filterEntitiesArray = [];
  const filters = [];
  if (option.partitionKey) {
    filters.push(`PartitionKey eq '${option.partitionKey}'`);
  }
  if (option.rowKeyDateStart && option.rowKeyTimeStart) {
    let rowKeyDateTimeStart =
      option.rowKeyDateStart + " " + option.rowKeyTimeStart;
    filters.push(`RowKey ge '${rowKeyDateTimeStart}'`);
  }
  if (option.rowKeyDateEnd && option.rowKeyTimeEnd) {
    let rowKeyDateTimeEnd = option.rowKeyDateEnd + " " + option.rowKeyTimeEnd;
    filters.push(`RowKey le '${rowKeyDateTimeEnd}'`);
  }
  if (option.minTemperature !== null) {
    filters.push(`Temperature ge ${option.minTemperature}`);
  }
  if (option.maxTemperature !== null) {
    filters.push(`Temperature le ${option.maxTemperature}`);
  }
  if (option.minPrecipitation !== null) {
    filters.push(`Precipitation ge ${option.minPrecipitation}`);
  }
  if (option.maxPrecipitation !== null) {
    filters.push(`Precipitation le ${option.maxPrecipitation}`);
  }
  const res = serviceClient.listEntities({
    queryOptions: {
      filter: filters.join(" and "),
    },
  });
  for await (const entity of res) {
    filterEntitiesArray.push(entity);
  }

  return filterEntitiesArray;
};
const createEntity = async function (entity) {
  await serviceClient.createEntity(entity);
};
const removeEntity = async function (partitionKey, rowKey) {
  await serviceClient.deleteEntity(partitionKey, rowKey);
};
const upsertEntity = async function (entity) {
  await serviceClient.upsertEntity(entity, "Merge");
};
const updateEntity = async function (entity) {
  await serviceClient.updateEntity(entity, "Replace");
};
const tableClient = {
  client: serviceClient,
  getEntities,
  filterEntities,
  createEntity,
  removeEntity,
  upsertEntity,
  updateEntity,
};

module.exports = tableClient;
