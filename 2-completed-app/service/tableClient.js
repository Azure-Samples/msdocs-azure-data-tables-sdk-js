
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { TableClient } = require("@azure/data-tables");
const env = require("../configure/env");
const serviceClient = TableClient.fromConnectionString(
  env.connectionString,
  env.tableName
);

// get all entities
const getEntities = async function () {
  const entitiesArray = [];
  const entities = serviceClient.listEntities();

  for await (const entity of entities) {
    entitiesArray.push(entity);
  }
  return entitiesArray;
};
const filterEntities = async function (option) {
  /*
    You can query data according to existing fields
    option provides some conditions to query,eg partitionKey, rowKeyDateTimeStart, rowKeyDateTimeEnd
    minTemperature, maxTemperature, minPrecipitation, maxPrecipitation
  */
  const filterEntitiesArray = [];
  const filters = [];
  if (option.partitionKey) {
    filters.push(`PartitionKey eq '${option.partitionKey}'`);
  }
  if (option.rowKeyDateTimeStart) {
    filters.push(`RowKey ge '${option.rowKeyDateTimeStart}'`);
  }
  if (option.rowKeyDateTimeEnd) {
    filters.push(`RowKey le '${option.rowKeyDateTimeEnd}'`);
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
  const entities = serviceClient.listEntities({
    queryOptions: {
      filter: filters.join(" and "),
    },
  });
  for await (const entity of entities) {
    filterEntitiesArray.push(entity);
  }

  return filterEntitiesArray;
};
const insertEntity = async function (entity) {
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
  insertEntity,
  removeEntity,
  upsertEntity,
  updateEntity,
};

module.exports = tableClient;
