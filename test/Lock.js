const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TimeLockQuestionPaper", function () {
  
  let paper
  let deployer, buyer

  beforeEach(async () => {
    // Setup accounts
    [deployer, buyer] = await ethers.getSigners()

    // Deploy contract
    const Paper = await ethers.getContractFactory("TimeLockQuestionPaper")
    paper = await Paper.deploy()
  })
  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await paper.owner()).to.equal(deployer.address)
    })

    describe("storePaper",()=>{

      beforeEach(async () => {
        // Setup accounts
        // const id = ethers.utils.formatBytes32String("1");
        const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        setPaper = await paper.connect(deployer).storePaper("1", "abcd", unlockTime);
    
      await setPaper.wait();
       
      })

      it("set Paper", async ()=>{
        const questionPaper=await paper.papers("1");
        expect(questionPaper.cid).to.equal("abcd")
      })

    



    })

    
  })
    describe("getPaper",()=>{

      beforeEach(async () => {
        // Setup accounts
        // const id = ethers.utils.formatBytes32String("1");
        const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
        setPaper = await paper.connect(deployer).storePaper("1", "abcd", unlockTime);
    
      await setPaper.wait();

      getPaper = await paper.connect(deployer).getPaperCID("1");
       
      })

      it("get Paper", async ()=>{
        const questionPaper=await paper.papers("1");
        expect(questionPaper.cid).to.equal("abcd")
      })

    



    })

    
  })