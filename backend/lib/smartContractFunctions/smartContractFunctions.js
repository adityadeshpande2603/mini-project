import { JsonRpcProvider, Wallet, Contract } from "ethers";
import { abi } from "../../abi/abi.js";

// Config
const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";
const PRIVATE_KEY = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
const PROVIDER_URL = "http://127.0.0.1:8545/";

const provider = new JsonRpcProvider(PROVIDER_URL);
const wallet = new Wallet(PRIVATE_KEY, provider);
const contract = new Contract(CONTRACT_ADDRESS, abi, wallet);

// 📥 Store CID
export async function storeEncryptedCIDOnChain(paperId, cid, unlockDateTime) {
  try {
    const unlockTime = Math.floor(new Date(unlockDateTime).getTime() / 1000);
    const tx = await contract.storePaper(paperId, cid, unlockTime);
    await tx.wait();

    console.log(`✅ CID "${cid}" stored for paperId "${paperId}" with unlock time ${unlockDateTime}`);
    return tx.hash;
  } catch (err) {
    console.error(`❌ Paper "${paperId}" could not be uploaded. Error:`, err.reason || err.message || err);
    return null;
  }
}

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

// 📤 Get CID with internal time sync
export async function getCIDFromChain(paperId) {
  try {
    // Sync time before trying to read CID
    await syncChainTimeWithRealTime();

    const cid = await contract.getPaperCID(paperId);
    console.log(`📄 CID for "${paperId}": ${cid}`);
    return cid;
  } catch (err) {
    console.error("❌ Error retrieving CID:", err.reason || err);
    throw err;
  }
}
// Export contract & provider in case needed externally
export { contract, provider };