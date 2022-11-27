import { Address, WalletTypes, zeroAddress } from "locklift/.";
import prompts from "prompts";

async function main() {
  const response = await prompts([
    {
      type: "text",
      name: "nft_address",
      message: "Provide NFT address",
      initial: zeroAddress.toString(),
    },
  ]);

  const nft_address = response.nft_address;

  // const nft_address = "0:84902af394f7817b6f853b42df97a3d78ec4d5df4e89488555590f0efaf58791";

  try {
    const signer = (await locklift.keystore.getSigner("0"))!;
    const nft = await locklift.factory.getDeployedContract("Nft", new Address(nft_address));

    console.log("-----------------------------------------------------------------");
    const claimrewards = nft.methods.claimRewards({}).sendExternal({ publicKey: signer.publicKey });

    const Trace = await locklift.tracing.trace(claimrewards);
    await Trace.traceTree?.beautyPrint();

    console.log("✅ Detials: " + JSON.stringify((await claimrewards).transaction));
    console.log("-----------------------------------------------------------------");
    console.log("✅ Successfully claimed: " + nft_address + " rewards");
    /*
    const nftjson = await nft.methods.getJson({ answerId: 0 }).call();
    console.log("✅ json mmetadata for this NFT: " + nftjson);
    console.log("-----------------------------------------------------------------");
    const iscanivore = await nft.methods._isCanivore().call();
    console.log("✅ This NFT isCanivore: " + iscanivore);
    console.log("-----------------------------------------------------------------");
    const isdead = await nft.methods._isDead().call();
    console.log(`✅ This NFT isDead: ${isdead.toString()}`);
    console.log("-----------------------------------------------------------------");
    const rewards_available = await nft.methods._claimableReward().call();
    console.log(`✅ This NFT has available rewerd of : ${rewards_available.toString()}`);
    const lastTimeFeed = await nft.methods._lastTimeFeed().call();
    console.log(`✅ This NFT has available rewerd of : ${lastTimeFeed.toString()}`);
    */
  } catch (err) {
    console.log("❌ Error: " + JSON.stringify(err));
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
