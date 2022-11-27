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

  //const nft_address = "0:84902af394f7817b6f853b42df97a3d78ec4d5df4e89488555590f0efaf58791";

  try {
    const signer = (await locklift.keystore.getSigner("0"))!;
    const nft = await locklift.factory.getDeployedContract("Nft", new Address(nft_address));
    const accountsFactory = await locklift.factory.getAccountsFactory("Wallet");

    console.log("-----------------------------------------------------------------");
    console.log("🔎 Getting NFT details for: " + nft_address);
    console.log("-----------------------------------------------------------------");
    const nftjson = await nft.methods.getJson({ answerId: 0 }).call();
    console.log("✅ json mmetadata for this NFT: " + JSON.stringify(nftjson.json));

    console.log("-----------------------------------------------------------------");
    const iscanivore = await nft.methods._isCanivore().call();
    console.log("✅ This NFT isCanivore: " + JSON.stringify(iscanivore.iscanivore));

    console.log("-----------------------------------------------------------------");
    const isdead = await nft.methods._isDead().call();
    console.log(`✅ This NFT isDead: ${JSON.stringify(isdead.isdead)}`);

    console.log("-----------------------------------------------------------------");
    const rewards_available = await nft.methods._claimableReward().call();
    console.log(`✅ This NFT has available reward of : ${JSON.stringify(Number(rewards_available.value0))}`);

    console.log("-----------------------------------------------------------------");
    const lastTimeFeed = await nft.methods._lastTimeFeed().call();
    console.log(`✅ This NFT last time feed : ${JSON.stringify(Number(lastTimeFeed.value0))}`);

    console.log("-----------------------------------------------------------------");
    const rewardrate = await nft.methods.rewardRate().call();
    console.log("✅ This NFT reward rate: " + JSON.stringify(Number(rewardrate.value0)));

    console.log("-----------------------------------------------------------------");
    const totalFoodTKSent = await nft.methods._totalFoodTkSent().call();
    console.log("✅ This NFT total Token Number consumed: " + JSON.stringify(Number(totalFoodTKSent._totalFoodTkSent)));

    console.log("-----------------------------------------------------------------");
    const totalCNNft = await nft.methods._totalCanivoredNFT().call();
    console.log(
      "✅ This NFT total Canivored NFTs when canivorous: " + JSON.stringify(Number(totalCNNft._totalCanivoredNFT)),
    );
    console.log("-----------------------------------------------------------------");
    const currentblocktimestamp = await nft.methods.returnCurrentBlockTimestamp().call();
    console.log("✅ The current block timestamp is: " + JSON.stringify(Number(currentblocktimestamp.value0)));
    /*
    console.log("-----------------------------------------------------------------");
    const rewardrate = await nft.methods.rewardRate().call();
    console.log(`✅ This NFT reward rate: ${JSON.stringify(Number(rewardrate.value0))}`);
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
