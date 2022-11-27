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

    console.log("-----------------------------------------------------------------");
    console.log("🔎 Getting NFT reward details for: " + nft_address);
    console.log("-----------------------------------------------------------------");
    const tkrewardclaimed = await nft.methods.TKrewardsClaimed().call();
    console.log(
      "✅ This NFT total reward claimed for token feeding: " + JSON.stringify(Number(tkrewardclaimed.TKrewardsClaimed)),
    );

    console.log("-----------------------------------------------------------------");
    const cnrewardclaimed = await nft.methods.CNrewardsClaimed().call();
    console.log(
      "✅ This NFT total reward claimed for canivore feeding: " +
        JSON.stringify(Number(cnrewardclaimed.CNrewardsClaimed)),
    );
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
