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
  if (req.method == "POST") {
    try {
      console.log("req.body", req.body);
      // A full version of this would have auth, but we're not dealing with any
      // sensitive data or funds here. If you'd like, you could validate the
      // Farcaster signature here
      const fid = req.body.untrustedData.fid;
      const addressFromFid = await getAddrByFid(fid);
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
          to: addressFromFid,
        },
      });

      res.status(200).setHeader("Content-Type", "text/html").send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width" />
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
          <meta
            property="fc:frame:button:1"
            content="Click me as much as you can! Mint MORE COWS!!"
          />
          <meta
            name="fc:frame:post_url"
            content="https://on-chain-cow-farcaster-frame.vercel.app/api/on-chain-cow-farcaster-frame"
          />
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
    res.status(200).setHeader("Content-Type", "text/html").send(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width" />
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
        <meta property="fc:frame:button:1" content="Mint your On-Chain Cow!" />
        <meta
          name="fc:frame:post_url"
          content="https://on-chain-cow-farcaster-frame.vercel.app/api/on-chain-cow-farcaster-frame"
        />
      </head>
    </html>
    `);
  }
}

// Based on https://github.com/coinbase/build-onchain-apps/blob/b0afac264799caa2f64d437125940aa674bf20a2/template/app/api/frame/route.ts#L13
async function getAddrByFid(fid: number) {
  console.log("Extracting address for FID: ", fid);
  const options = {
    method: "GET",
    url: `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
    headers: {
      accept: "application/json",
      api_key: process.env.NEYNAR_API_KEY || "",
    },
  };
  console.log("Fetching response from Neynar API");
  const resp = await fetch(options.url, { headers: options.headers });
  console.log("Response: ", resp);
  const responseBody = await resp.json(); // Parse the response body as JSON
  console.log("responseBody", responseBody);
  if (responseBody.users) {
    const userVerifications = responseBody.users[0];
    console.log("userVerifications", userVerifications);
    if (userVerifications.verifications) {
      console.log("Returning user address", userVerifications.verifications[0]);
      return userVerifications.verifications[0];
    }
  }
  return "0x0000000000000000000000000000000000000000";
}

getAddrByFid(155);
