//import ora from "ora";
import prompts from "prompts";

async function main() {
  //const spinner = ora();
  const json = {
    type: "Basic NFT",
    name: "Evolution",
    description: "Evolve the world of everscale NFT and create living tokens",
    preview: {
      source: "https://everscale.network/images/Backgrounds/Main/main-hero.png",
      mimetype: "image/png",
    },
    files: [
      {
        source: "https://everscale.network/images/Backgrounds/Main/main-hero.png",
        mimetype: "image/png",
      },
    ],
    external_url: "https://github.com/xcrispy",
  };

  const response = await prompts([
    {
      type: "text",
      name: "ownerPubkey",
      message: "Owner key",
      initial: "",
    },
  ]);

  const ownerPubkey = response.ownerPubkey;
  // const ownerPubkey = "172af540e43a524763dd53b26a066d472a97c4de37d5498170564510608250c3";
  // spinner.start(`Deploy Collection`);
  try {
    const Nft = await locklift.factory.getContractArtifacts("Nft");
    const Index = await locklift.factory.getContractArtifacts("Index");
    const IndexBasis = await locklift.factory.getContractArtifacts("IndexBasis");
    const signer = (await locklift.keystore.getSigner("0"))!;
    const { contract: collection, tx } = await locklift.factory.deployContract({
      contract: "Collection",
      publicKey: signer.publicKey,
      initParams: {},
      constructorParams: {
        codeNft: Nft.code,
        codeIndex: Index.code,
        codeIndexBasis: IndexBasis.code,
        ownerPubkey: `0x` + ownerPubkey,
        json: JSON.stringify(json),
        mintingFee: 0,
      },
      value: locklift.utils.toNano(1),
    });
    // spinner.succeed(`Deploy Collection`);

    console.log("-----------------------------------------------------------------");
    console.log(`✅ Collection successfully deployed at: ${collection.address.toString()}`);
  } catch (err) {
    // spinner.fail(`Failed`);
    console.log("❌ Error: " + JSON.stringify(err));
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
