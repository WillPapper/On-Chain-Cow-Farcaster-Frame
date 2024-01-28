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
  // Farcaster Frames will send a POST request to this endpoint when the user
  // clicks the button. If we receive a POST request, we can assume that we're
  // responding to a Farcaster Frame button click.
  // A full version of this would have auth, but we're not dealing with any
  // sensitive data or funds here
  if (req.method == "POST") {
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

      res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>On-Chain Cow!</title>
          <meta property="og:title" content="On-Chain Cow!" />
          <meta
            property="og:image"
            content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-happy-cow.png"
          />
          <meta property="fc:frame" content="vNext" />
          <meta
            property="fc:frame:image"
            content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-happy-cow.png"
          />
          <meta property="fc:frame:button:1" content="Click me as much as you can! Mint MORE!!" />
        </head>
      </html>
      
    `);
    } catch (error) {
      res.status(500).send(`Error: ${error.message}`);
    }
  } else {
    // If the request is not a POST, we know that we're not dealing with a
    // Farcaster Frame button click. Therefore, we should send the Farcaster Frame
    // content
    res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>On-Chain Cow!</title>
        <meta property="og:title" content="On-Chain Cow!" />
        <meta
          property="og:image"
          content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-neutral-cow.png"
        />
        <meta property="fc:frame" content="vNext" />
        <meta
          property="fc:frame:image"
          content="https://on-chain-cow-farcaster-frame.vercel.app/img/on-chain-cow-neutral-cow.png"
        />
        <meta
          name="fc:frame:post_url"
          content="https://on-chain-cow-farcaster-frame.vercel.app/api/on-chain-cow-farcaster-frame"
        />
        <meta property="fc:frame:button:1" content="Mint your On-Chain Cow!" />
      </head>
    </html>
    `);
  }
}
