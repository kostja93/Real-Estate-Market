const HDWalletProvider = require('truffle-hdwallet-provider')
const web3 = require('web3')
const { infuraKey, mnemonic, url } = require('./localDeployment.json')
const CONTRACT_ADDRESS = '0x02c76dbCBb89d6fE504Ed33AAfAAE2850972316d'
const OWNER_ADDRESS = '0xe53F9AbE05157005466aFE53736d489958b9e0BE'
const NETWORK = 'rinkeby'
const NUM_CREATURES = 10
const CONTRACT_ABI = require('./build/contracts/SolnSquareVerifier.json').abi
const providerUrl = url || `https://${NETWORK}.infura.io/v3/${infuraKey}`

async function main() {
  const provider = new HDWalletProvider( mnemonic, providerUrl)
  const web3Instance = new web3(provider)

  const nftContract = new web3Instance.eth.Contract(
    CONTRACT_ABI,
    CONTRACT_ADDRESS,
    { gasLimit: '1000000' }
  )

  // Creatures issued directly to the owner.
  console.log('Starting mint process')
  for (var i = 0; i < NUM_CREATURES; i++) {
    let { proof, inputs } = require(`./test/proof${i + 1}.json`)
    const addsSolution = await nftContract.methods
      .addSolution(proof.a, proof.b, proof.c, inputs)
      .send({ from: OWNER_ADDRESS })
    const result = await nftContract.methods
      .mint(OWNER_ADDRESS)
      .send({ from: OWNER_ADDRESS })
    console.log('Minted creature. Transaction: ' + result.transactionHash)
  }
}

main()
