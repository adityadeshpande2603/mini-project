import { PinataSDK } from "pinata";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Needed for `__dirname` in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent folder
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// console.log("JWT loaded:", process.env.PINATA_JWT); // Confirm if it’s working

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "black-major-mule-847.mypinata.cloud",
});

export const upload = async (data) => {
  try {
    const content = { encryptedData: data };
    const result = await pinata.upload.public.json(content);
    console.log("✅ Upload success:", result);
    return result;
  } catch (error) {
    console.log("❌ Upload error:", error);
    return null;
  }
};


// await main();