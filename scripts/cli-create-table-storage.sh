LOCATION='eastus'
RESOURCE_GROUP_NAME='rg-msdocs-tables-sdk-demo'
STORAGE_ACCOUNT_NAME='stmsdocstablessdkdemo123'# Change 123 to a unique three digit value - names must be unique across Azure
TABLE_NAME='WeatherData'

# Create a resource group
az group create \
    --location $LOCATION \
    --name $RESOURCE_GROUP_NAME

# Create an Azure Storage
az storage account create \
    --resource-group $RESOURCE_GROUP_NAME \
    --location $LOCATION \
    --name $STORAGE_ACCOUNT_NAME

# This gets the Table Key 
az storage account keys list \
    --resource-group $RESOURCE_GROUP_NAME \
    --account-name $STORAGE_ACCOUNT_NAME

## Create the table for the application to use
az storage table create \
    --name $TABLE_NAME \
    --account-name $STORAGE_ACCOUNT_NAME

# This gets the primary Table connection string
az storage account show-connection-string \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $STORAGE_ACCOUNT_NAME