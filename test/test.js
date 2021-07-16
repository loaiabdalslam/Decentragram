const Decentragram = artifacts.require('./Decentragram.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Decentragram', ([deployer, author, tipper]) => {
  let decentragram

  before(async () => {
    decentragram = await Decentragram.deployed()
  })

  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await decentragram.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await decentragram.name()
      assert.equal(name, 'Decentragram')
    })



    describe('images', async () => {
      let result, imageCount
      //check event
      const hash = "abc123"
      const desc = 'Image description'
      before(async () => {
        result = await decentragram.uploadImage(hash, desc, { from: author })
        imageCount = await decentragram.imageCount()
  
      })
      it('creates images', async () => {
        assert.equal(imageCount, 1)
        const eventx = result.logs[0].args
        assert.equal(eventx.id.toNumber(),imageCount.toNumber(),'id is correcet')
        assert.equal(eventx.hash,hash,'hash is correcet')
        assert.equal(eventx.desc,desc,'desc is correcet')
        assert.equal(eventx.tipAmount,0,'tipAmount is correcet')
        assert.equal(eventx.author,author,'author is correcet')

        await decentragram.uploadImage('', desc, { from: author }).should.be.rejected
        await decentragram.uploadImage('', '', { from: author }).should.be.rejected

      })

      it("lists images",async ()=>{

        const image_ = await decentragram.images(imageCount)
        assert.equal(image_.id.toNumber(),imageCount.toNumber(),'id is correcet')
        assert.equal(image_.hash,hash,'hash is correcet')
        assert.equal(image_.desc,desc,'desc is correcet')
        assert.equal(image_.tipAmount,0,'tipAmount is correcet')
        assert.equal(image_.author,author,'author is correcet')

      })
      it('allows users to tip images', async () => {
        // Track the author balance before purchase
        let oldAuthorBalance
        oldAuthorBalance = await web3.eth.getBalance(author)
        oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)
  
        result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
  
        // SUCCESS
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
        assert.equal(event.hash, hash, 'Hash is correct')
        assert.equal(event.desc, 'Image description', 'description is correct')
        assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
        assert.equal(event.author, author, 'author is correct')
  
        // Check that author received funds
        let newAuthorBalance
        newAuthorBalance = await web3.eth.getBalance(author)
        newAuthorBalance = new web3.utils.BN(newAuthorBalance)
  
        let tipImageOwner
        tipImageOwner = web3.utils.toWei('1', 'Ether')
        tipImageOwner = new web3.utils.BN(tipImageOwner)
  
        const expectedBalance = oldAuthorBalance.add(tipImageOwner)
  
        assert.equal(newAuthorBalance.toString(), expectedBalance.toString())
  
        // FAILURE: Tries to tip a image that does not exist
        await decentragram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
      })


    })


  })














/*
  describe('images', async () => {
    let result, imageCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await decentragram.uploadImage(hash, 'Image description', { from: author })
      imageCount = await decentragram.imageCount()
    })

    //check event
    it('creates images', async () => {
      // SUCESS
      assert.equal(imageCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')


      // FAILURE: Image must have hash
      await decentragram.uploadImage('', 'Image description', { from: author }).should.be.rejected;

      // FAILURE: Image must have description
      await decentragram.uploadImage('Image hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists images', async () => {
      const image = await decentragram.images(imageCount)
      assert.equal(image.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(image.hash, hash, 'Hash is correct')
      assert.equal(image.description, 'Image description', 'description is correct')
      assert.equal(image.tipAmount, '0', 'tip amount is correct')
      assert.equal(image.author, author, 'author is correct')
    })

    it('allows users to tip images', async () => {
      // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await decentragram.tipImageOwner(imageCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })

      // SUCCESS
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), imageCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.description, 'Image description', 'description is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipImageOwner
      tipImageOwner = web3.utils.toWei('1', 'Ether')
      tipImageOwner = new web3.utils.BN(tipImageOwner)

      const expectedBalance = oldAuthorBalance.add(tipImageOwner)

      assert.equal(newAuthorBalance.toString(), expectedBalance.toString())

      // FAILURE: Tries to tip a image that does not exist
      await decentragram.tipImageOwner(99, { from: tipper, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
    })
  })



  */
})