import { encryptJsonArray } from "../../lib/utils/encryptDecrypt.js";
import jwt from 'jsonwebtoken';
import { upload } from "../../PINATA/pinata.js";
import { encryptJson } from "../../lib/utils/aesAlogo.js";
import { storeEncryptedCIDOnChain } from "../../lib/smartContractFunctions/smartContractFunctions.js";




export const encryptPaper = async (req, res) => {
  try {
    const { questions, quizId, startTime, date } = req.body;

    // Combine date and time into ISO string
    const combinedStartTime = new Date(`${date}T${startTime}:00Z`).toISOString();
    
    console.log(combinedStartTime);
    const encryptedHash = encryptJson(questions);
    const ipfs = await upload(encryptedHash);

    await storeEncryptedCIDOnChain(quizId, ipfs.cid, combinedStartTime);

    return res.status(200).json({ ipfs,combinedStartTime });
  } catch (error) {
    console.error('Encryption error:', error);
    return res.status(500).json({ error: 'Failed to encrypt questions' });
  }
}; 
  