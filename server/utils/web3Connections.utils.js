const { Web3 } = require('web3');
const dotenv = require('dotenv');
dotenv.config();

// Lucky Block
const luckyblockContractABI = require("../ABIs/LuckyBlock.json");
const luckyblockContractAddress = process.env.LUCKYBLOCK_CONTRACT;

// Infura
const InfuraAPI = process.env.INFURA_API;
const infuraEndpoint = 'wss://mainnet.infura.io/ws/v3/' + InfuraAPI;

//Web3
const web3 = new Web3(infuraEndpoint);

//Contracts
const luckyblockContractInstance = new web3.eth.Contract(luckyblockContractABI, luckyblockContractAddress);

async function GetBalanceOfLatestTransfers(){
    
    const foundAddresses = await GetLatestTransfers();
    
    let results = [];
    for (const address of foundAddresses) {
        if (address == "undefined")
            continue;

        const result = await getBalanceOfAddress(address);
        results.push(result);
    }

    console.log("results", results);

    return results;
}

async function GetLatestTransfers() {
    let latestAddresses = [];
    try {
        const latestBlockNumber = await web3.eth.getBlockNumber();
        const startBlock = BigInt(latestBlockNumber) - BigInt(10000);
        const endBlock = BigInt(latestBlockNumber);

        const dataPromise = new Promise((resolve, reject) => {
            const transferEvent = luckyblockContractInstance.events.Transfer({
                filter: {},
                fromBlock: startBlock,
                toBlock: endBlock
            });

            transferEvent.on('data', function(event) {
                if (event && event.returnValues && event.returnValues.to !== undefined && event.returnValues.to !== "undefined") {
                    const address = event.returnValues.to;
                    latestAddresses.push(address);
                } else {
                    console.error('Invalid event data:', event);
                }
            });

            transferEvent.on('error', function(error) {
                console.error('Error:', error);
                reject(error);
            });

            const timeout = setTimeout(() => {
                console.log('Timeout reached. Ending event stream.');
                resolve();
            }, 1000);

            transferEvent.on('end', function() {
                clearTimeout(timeout);
                resolve();
            });
        });
        
        await dataPromise;
    } catch (error) {
        console.error('Error:', error);
    }

    return latestAddresses;
}

async function getBalanceOfAddress(address){
    try {
        const balance = await luckyblockContractInstance.methods.balanceOf(address).call();
        return {address, balance };
    } catch (error) {
        console.error('Error getting balance of address:', address, "with error: ", error);
        return {address, balance: 0 };
    }
}

module.exports = 
{
    GetBalanceOfLatestTransfers
}



