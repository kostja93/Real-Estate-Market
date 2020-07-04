let SolnSquareVerifier = artifacts.require('SolnSquareVerifier')
let SquareVerifier = artifacts.require('SquareVerifier')

contract('Test SolnSquareVerifier', accounts => {
  // Test if a new solution can be added for contract - SolnSquareVerifier
  it('adds a solution', async () => {
    const verifier = await SquareVerifier.new({ from: accounts[0] })
    const contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] })
    const { proof, inputs } = require('./proof1.json')
    let solutionAdded = false;
    contract.getPastEvents('SolutionAdded').then(() => solutionAdded = true )
    await contract.addSolution(proof.a, proof.b, proof.c, inputs, { from: accounts[1] })
    assert.ok(solutionAdded)
  })

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it('mints a token', async () => {
    const verifier = await SquareVerifier.new({ from: accounts[0] })
    const contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] })
    await contract.mint(accounts[0], { from: accounts[0]})
    assert.equal(await contract.totalSupply(), 1)
  })

  it('fails to mint token without solution', async () => {
    const verifier = await SquareVerifier.new({ from: accounts[0] })
    const contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] })
    try {
      await contract.mint(accounts[0], { from: accounts[0]})
    } catch(e) {
      assert.ok(true)
    }
  })
})
