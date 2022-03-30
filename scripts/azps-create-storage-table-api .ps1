$location = 'eastus'
$resourceGroupName = 'rg-msdocs-tables-sdk-demo'
$storageAccountName = 'storagetablesdemo123'  # Change 123 to a unique three digit value - names must be unique across Azure
$storageTableName = 'WeatherData'

# Create a resource group
New-AzResourceGroup `
    -Location $location `
    -Name $resourceGroupName

#Create an Azure Storage Account
$storageAccount = New-AzStorageAccount `
    -ResourceGroupName $resourceGroupName `
    -Name $storageAccountName `
    -Location $location `
    -SkuName "Standard_RAGRS" 

#Get Azure Storage Account Context
$ctx = $storageAccount.Context

#Create the table for the application to use
New-AzStorageTable `
    -Name $storageTableName `
    -Context $ctx

# This gets the table connection string 
$ctx.ConnectionString