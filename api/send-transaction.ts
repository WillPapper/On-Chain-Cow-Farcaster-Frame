// This function will automatically trigger at 1 AM UTC on the first of every
// month. See vercel.json for the cron schedule.
// 1 AM is used instead of midnight to give humans an hour to mint the NFTs if
// desired for on-chain provenance

import { VercelRequest, VercelResponse } from "@vercel/node";
import { SyndicateClient } from "@syndicateio/syndicate-node";

const syndicate = new SyndicateClient({
  token: () => {
    const apiKey = process.env.SYNDICATE_API_KEY;
    if (typeof apiKey === "undefined") {
      // If you receive this error, you need to define the SYNDICATE_API_KEY in
      // your Vercel environment variables. You can find the API key in your
      // Syndicate project settings under the "API Keys" tab.
      throw new Error(
        "SYNDICATE_API_KEY is not defined in environment variables."
      );
    }
    return apiKey;
  },
});

export default async function (req: VercelRequest, res: VercelResponse) {
  try {
    // Mint the On-Chain Cow NFT. We're not passing in any arguments, since the
    // amount will always be 1
    const mintTx = await syndicate.transact.sendTransaction({
      projectId: "abcab73a-55d2-4441-a93e-edf95d183b34",
      contractAddress: "0xBeFD018F3864F5BBdE665D6dc553e012076A5d44",
      chainId: 84532,
      functionSignature: "mint(address to)",
      args: {
        // TODO: Change to the user's connected Farcaster address. This is going
        // to WillPapper.eth for now
        to: "0x3Cbd57dA2F08b3268da07E5C9038C11861828637",
      },
    });

    res.status(200).json({
      message: "On-Chain Cow minted!",
      transactions: {
        onChainCow: mintTx.transactionId,
      },
    });
  } catch (error) {
    res.status(500).send(`Error: ${error.message}`);
  }
}
