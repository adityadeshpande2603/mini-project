import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { abi } from "../../abi/abi.js";

// Config
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY
const PROVIDER_URL = process.env.PROVIDER_URL;

const provider = new JsonRpcProvider(PROVIDER_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);
let drift;

// 📥 Store CID


// ⏳ Sync Chain Time with Real Time
async function syncChainTimeWithRealTime() {
  const now = Math.floor(Date.now() / 1000);
  const chainTime = (await provider.getBlock("latest")).timestamp;
  const diff = now - chainTime;

  if (diff > 0) {
    await provider.send("evm_increaseTime", [diff + 1]);
    await provider.send("evm_mine");
    console.log(`⏩ Chain time fast-forwarded by ${diff + 1} seconds`);
  } else {
    console.log("✅ Chain time is already synced or ahead");
  }
}

export async function storeEncryptedCIDOnChain(paperId, cid, unlockDateTime) {
  try {
   console.log(unlockDateTime);
    const unlockTime = Math.floor(new Date(unlockDateTime).getTime() / 1000);
    const now = Math.floor(Date.now() / 1000);

   

    

  console.log("nowww",now)
 
  
    console.log("unlockTime",unlockTime);
  
    const tx = await contract.storePaper(paperId, cid, unlockTime);
    await tx.wait();

    console.log(`✅ CID "${cid}" stored for paperId "${paperId}" with unlock time ${adjustedUnlockTime}`);
    return tx.hash;
  } catch (err) {
    console.error(`❌ Paper "${paperId}" could not be uploaded. Error:`, err.reason || err.message || err);
    return null;
  }
}

// 📤 Get CID with internal time sync
export async function getCIDFromChain(paperId) {
  try {
  

    const now = Math.floor((Date.now() + (5.5 * 60 * 60 * 1000))/1000);
   
    // console.log(chainTime-now)
   
    console.log("now",now)
 
  

    console.log("now:", now);


    const cid = await contract.getPaperCID(paperId,now+2);
    console.log(`📄 CID for "${paperId}": ${cid}`);
    return cid;
  } catch (err) {
    console.error("❌ Error retrieving CID:", err.reason || err);

    
    throw err;
  }
}
export async function storeStudentResponse(paperId, cid, studentId) {
  try {
  
    const tx = await contract.storeStudentResponse(paperId, cid, studentId);
    await tx.wait();
  
  } catch (err) {
    console.error("❌ storing response:", err.reason || err);

    
    throw err;
  }
}
export async function getStudentResponse(paperId, studentId) {
  try {
  
    const cid = await contract.getStudentResponseCID(paperId,studentId);
    return cid
  
  } catch (err) {
    console.error("❌ Error retrieving CID:", err.reason || err);

    
    throw err;
  }
}
// Export contract & provider in case needed externally
export { contract, provider };