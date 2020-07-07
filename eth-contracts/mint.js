const HDWalletProvider = require('truffle-hdwallet-provider')
const web3 = require('web3')
const { infuraKey, mnemonic, url } = require('./deployment.json')
const CONTRACT_ADDRESS = '0x579D702D6CaF6FcE8fC8B936E9360cdC31bC1C5B'
const OWNER_ADDRESS = '0x393E37d66c5e0D58E34EAd4A5f2505a1d2EfDa95'
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
