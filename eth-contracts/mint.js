const HDWalletProvider = require("truffle-hdwallet-provider")
const web3 = require('web3')
const { infuraKey, mnemonic, url } = require('./localDeployment.json')
const MNEMONIC = mnemonic
const INFURA_KEY = infuraKey
const FACTORY_CONTRACT_ADDRESS = false;
const NFT_CONTRACT_ADDRESS = "0x21d401f50f5a3b6FFeD4e16f69b4312e00C52830"
const OWNER_ADDRESS = "0xe53F9AbE05157005466aFE53736d489958b9e0BE"
const NETWORK = 'rinkeby'
const NUM_CREATURES = 10
const NUM_LOOTBOXES = 4
const DEFAULT_OPTION_ID = 0
const LOOTBOX_OPTION_ID = 2
const providerUrl = url || `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`

if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}

const NFT_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_to",
        "type": "address"
      }
    ],
    "name": "mintTo",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

const FACTORY_ABI = [{
    "constant": false,
    "inputs": [
      {
        "name": "_optionId",
        "type": "uint256"
      },
      {
        "name": "_toAddress",
        "type": "address"
      }
    ],
    "name": "mint",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
}]

async function main() {
    const provider = new HDWalletProvider(MNEMONIC, providerUrl)
    const web3Instance = new web3(provider)

    if (NFT_CONTRACT_ADDRESS) {
        const nftContract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        console.log("String to mint")
        // Creatures issued directly to the owner.
        for (var i = 0; i < NUM_CREATURES; i++) {
            //const result = await nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS })
            nftContract.methods.mintTo(OWNER_ADDRESS).send({ from: OWNER_ADDRESS }).then(() => {
                console.log("Minted creature. Transaction: " + result.transactionHash)
            }).catch(err => console.error(err))
        }
    } else if (FACTORY_CONTRACT_ADDRESS) {
        const factoryContract = new web3Instance.eth.Contract(FACTORY_ABI, FACTORY_CONTRACT_ADDRESS, { gasLimit: "1000000" })

        // Creatures issued directly to the owner.
        for (var i = 0; i < NUM_CREATURES; i++) {
            const result = await factoryContract.methods.mint(DEFAULT_OPTION_ID, OWNER_ADDRESS).send({ from: OWNER_ADDRESS })
            console.log("Minted creature. Transaction: " + result.transactionHash)
        }

        // Lootboxes issued directly to the owner.
        for (var i = 0; i < NUM_LOOTBOXES; i++) {
            const result = await factoryContract.methods.mint(LOOTBOX_OPTION_ID, OWNER_ADDRESS).send({ from: OWNER_ADDRESS })
            console.log("Minted lootbox. Transaction: " + result.transactionHash)
        }
    } else {
      console.error('Add NFT_CONTRACT_ADDRESS or FACTORY_CONTRACT_ADDRESS to the environment variables')
    }
}

main()

