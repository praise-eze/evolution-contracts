import { Address, WalletTypes, zeroAddress } from "locklift/.";
import prompts from "prompts";

async function main() {
  const response = await prompts([
    {
      type: "text",
      name: "collectionAddr",
      message: "Provide collection address",
      initial: zeroAddress.toString(),
    },
    /* {
      type: "text",
      name: "name",
      message: "Provide the nft name",
      initial: "",
    },
    {
      type: "text",
      name: "description",
      message: "Provide the nft description",
      initial: "",
    },
    {
      type: "text",
      name: "url",
      message: "Provide the image url",
      initial: "",
    },
    {
      type: "text",
      name: "externalUrl",
      message: "Provide the external url",
      initial: "",
    }, */
  ]);

  /* const nft_url = response.url;
  const nft_name = response.name;
  const nft_description = response.description;
  const externalUrl = response.externalUrl; */
  const collectionAddress = response.collectionAddr;

  const nft_url = "test";
  const nft_name = "lol";
  const nft_description = "nice";
  const externalUrl = "response.externalUrl";
  //const collectionAddress = "0:06a34e3d6a44963857a507dc5deca1e41c06c00066f943de37c3b438b2c44481";

  let item = {
    type: "Basic NFT",
    name: nft_name,
    description: nft_description,
    preview: {
      source: nft_url,
      mimetype: "image/png",
    },
    files: [
      {
        source: nft_url,
        mimetype: "image/png",
      },
    ],
    external_url: externalUrl,
  };

  let payload = JSON.stringify(item);

  try {
    const signer = (await locklift.keystore.getSigner("0"))!;
    const collection = await locklift.factory.getDeployedContract("Collection", new Address(collectionAddress));
    const accountsFactory = await locklift.factory.getAccountsFactory("Wallet");
    const { account: account, tx } = await accountsFactory.deployNewAccount({
      publicKey: signer.publicKey,
      initParams: {
        _randomNonce: 0,
      },
      constructorParams: {},
      value: locklift.utils.toNano(5),
    });
    const userBalance = await locklift.provider.getBalance(account.address);
    console.log("-----------------------------------------------------------------");
    console.log("Address: " + account.address + "");
    console.log("Balance of account: " + locklift.utils.fromNano(userBalance) + " ever");
    const run = account.runTarget(
      {
        contract: collection,
        value: locklift.utils.toNano(1.5),
      },
      collection =>
        collection.methods.mintNft({
          json: payload,
        }),
    );
    console.log("-----------------------------------------------------------------");
    const Trace = await locklift.tracing.trace(run);
    await Trace.traceTree?.beautyPrint();
    //  console.log(JSON.stringify(run.transaction));
    console.log("-----------------------------------------------------------------");
    const totalSupply = await collection.methods.totalSupply({ answerId: 0 }).call();
    console.log("✅ Total supply of all NFT in the collection contract: " + totalSupply.count);
    console.log("-----------------------------------------------------------------");
    const nftId = await collection.methods.currentTokenId().call();
    console.log("✅ The token id minted: " + nftId.value0);
    console.log("-----------------------------------------------------------------");
    const nftAddr = await collection.methods.nftAddress({ answerId: 0, id: Number(nftId.value0) }).call();
    console.log(`✅ Nft succesfully minted at: ${nftAddr.nft.toString()}`);
    console.log("-----------------------------------------------------------------");
    const allNFTs = await collection.methods.allNFTCreated().call();
    console.log(`✅ All created NFT in the collection: ${JSON.stringify(allNFTs.value0)}`);
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
