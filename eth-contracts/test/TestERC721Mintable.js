var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
            for(let i = 0; i < 5; i++) {
              this.contract.mint(account_one, { from: account_one })
            }
        })

        it('should return total supply', async function () { 
            assert.equal(await this.contract.totalSupply.call(), 5, 'There are not 5 tokens in supply')
        })

        it('should get token balance', async function () { 
            assert.equal(await this.contract.balanceOf.call(account_one), 5, 'There are not 5 tokens in balance for first address')
            assert.equal(await this.contract.balanceOf.call(account_two), 0, 'There are not 0 tokens in balance for second address')
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            assert.equal(await this.contract.tokenURI.call(1), 'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1')
        })

        it('should transfer token from one owner to another', async function () { 
            this.contract.transferFrom(account_one, account_two, 1);
            assert.equal(await this.contract.ownerOf.call(1), account_two)
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            try {
              await this.contract.mint({ from: account_two })
              assert.ok(false)
            } catch(e) {
              assert.ok(true)
            }
        })

        it('should return contract owner', async function () { 
            assert.equal(await this.contract.contractOwner.call(), account_one)
        })
    });
})
