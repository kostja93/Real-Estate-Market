let SolnSquareVerifier = artifacts.require('SolnSquareVerifier')
let SquareVerifier = artifacts.require('SquareVerifier')

contract('Test SolnSquareVerifier', accounts => {
  // Test if a new solution can be added for contract - SolnSquareVerifier
  it('adds a solution', async () => {
    const verifier = await SquareVerifier.new({ from: accounts[0] })
    const contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] })
    let solutionAdded = false;
    contract.getPastEvents('SolutionAdded').then(() => solutionAdded = true )
    await contract.addSolution(9, accounts[1], { from: accounts[1] })
    assert.ok(solutionAdded)
  })

  // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
  it('mints a token', async () => {
    const verifier = await SquareVerifier.new({ from: accounts[0] })
    const contract = await SolnSquareVerifier.new(verifier.address, { from: accounts[0] })
    await contract.mint(accounts[0], { from: accounts[0]})
    assert.equal(await contract.totalSupply(), 1)
  })
})
