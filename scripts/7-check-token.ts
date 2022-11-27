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
    {
      type: "text",
      name: "amount",
      message: "Amount to divide by 1,000,000 (6 decimals)",
      initial: "",
    },
  ]);
  const arg = response.amount;
  const nft_address = response.nft_address;

  try {
    const signer = (await locklift.keystore.getSigner("0"))!;
    const nft = await locklift.factory.getDeployedContract("Nft", new Address(nft_address));

    console.log("-----------------------------------------------------------------");
    const tokenvalue = await nft.methods.returnTokenCountWithoutDecimal({ _tokenCount: arg }).call();
    console.log("🧮 " + arg + " with 6 decimal (from contract) is: " + JSON.stringify(Number(tokenvalue.value0)));
    console.log("-----------------------------------------------------------------");
    console.log("🧮 " + arg + " with 6 decimal (normal division) is: " + arg / 10 ** 6);
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
