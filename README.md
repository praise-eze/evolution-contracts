# Evolution

This is the contract repo for evolution

To use these contracts:

```
"scripts": {
    "test": "npx locklift test --network local",
    "docker-start":"docker run -d --name local-node -e USER_AGREEMENT=yes -p80:80 tonlabs/local-node",
    "build":"rm -rf ./build && npx locklift build",
    "docker-stop": "docker kill /local-node && docker rm /local-node",
    "docker-reload": "npm run docker-stop && npm run docker-start",

    "l-deploy-collection":"npx locklift run --disable-build --network local --script scripts/1-deploy-collection.ts",
    "l-mint-nft":"npx locklift run --disable-build --network local --script scripts/2-mint-nft.ts",
    "l-view-nft-data":"npx locklift run --disable-build --network local --script scripts/3-view-nft-data.ts",
    "l-feed-nft":"npx locklift run --disable-build --network local --script scripts/4-tk-cn-feed-nft.ts",
    "l-rewards-claimed":"npx locklift run --disable-build --network local --script scripts/5-rewards-claimed-data.ts",
    "l-claim-rewards":"npx locklift run --disable-build --network local --script scripts/6-claim-rewards.ts",
    "l-convert-token":"npx locklift run --disable-build --network local --script scripts/7-check-token.ts",


    "m-deploy-collection":"npx locklift run --disable-build --network mainborrow --script scripts/1-deploy-collection.ts",
    "m-mint-nft":"npx locklift run --disable-build --network mainborrow --script scripts/2-mint-nft.ts",
    "m-view-nft-data":"npx locklift run --disable-build --network mainborrow --script scripts/3-view-nft-data.ts",
    "m-feed-nft":"npx locklift run --disable-build --network mainborrow --script scripts/4-tk-cn-feed-nft.ts",
    "m-rewards-claimed":"npx locklift run --disable-build --network mainborrow --script scripts/5-rewards-claimed-data.ts",
    "m-claim-rewards":"npx locklift run --disable-build --network mainborrow --script scripts/6-claim-rewards.ts",
    "m-convert-token":"npx locklift run --disable-build --network mainborrow --script scripts/7-check-token.ts",

    "d-deploy-collection":"npx locklift run --disable-build --network test --script scripts/1-deploy-collection.ts",
    "d-mint-nft":"npx locklift run --disable-build --network test --script scripts/2-mint-nft.ts",
    "d-view-nft-data":"npx locklift run --disable-build --network test --script scripts/3-view-nft-data.ts",
    "d-feed-nft":"npx locklift run --disable-build --network test --script scripts/4-tk-cn-feed-nft.ts",
    "d-rewards-claimed":"npx locklift run --disable-build --network test --script scripts/5-rewards-claimed-data.ts",
    "d-claim-rewards":"npx locklift run --disable-build --network test --script scripts/6-claim-rewards.ts",
    "d-convert-token":"npx locklift run --disable-build --network test --script scripts/7-check-token.ts"
  }
```

alway remember to configure your env, there is an example showcase in `.env.example`
use `npm run {comand-in-scripts}` eg : `npm run d-feed-nft`

### Project Background

Evoulution is the personification of NFT, giving NFTs some human like attritubes in a gamified way.

The current setup gamified NFT contains NFT with properties, this particular types treat NFT like animals that are been cared for.

This NFT contain the attribure like

- feed
- dead

#### NFT story

When the NFT is minted,
The NFT has two state `isCanivorous` = true or false. When isCanivorous is false,
feeding occur by calling the `feed(uint256 _amount)` function and passing in an appropiate amount, the amount will be the number of FEED tokens you will send to the contract to feed the NFT (to call this function, you will need to have FEED tokens (the feed token consuming logic have been abstract from the MVP)), when feeding is done, depending on the amount feed, the NFT will produce rewards(produce).  
When isCanivorous is true, instead of taking in FEED tokens, the NFT becomes wild and decides to feed on other NFTs (the nft consuming logic have been abstract from the MVP), you call `feed(uint256 _amount)` and pass in 0 as amount,when feeding is done, depending on the amount feed, the NFT will produce rewards(produce).

Conditions for isCanivorous change

All NFTs start out normal (there is a 10% chance of an abnormal NFT), when an NFT has not been feed for 5 days, it will become canivorous.

pros/cons of canivore NFTs

- They produce more rewards(produce) when feed.
- They have better multipliers.
- They have shorter life span when not feed (they only live for 3 days without food).
- They consume NFTs.
- They require more attention.

Conditions for living

For the NFT to survive, it must be feed appropiately.  
When the NFT is not canivorous, it can live for 7 days. When it becomes canivorous, it can only live for 3 days.

An NFT turn canivorous after the first 5 days without food, this process is irrevisble.

When an NFT die, they lose all their properties and is just a normal JPEG

Rewards
The rewards are the produce of the NFT, They are produced over time and will increase depending on how well you are feeding your NFT, it takes 4 day after feeding to recieve max rewards when NFT is not canivorous and 2 days after feeding to recieve max rewards when NFT is canivorous.

This is the simple break down of the story behind the NFT, it is still a bit more complex (maths, more attributes and whatnot) but this the the MVP

#### Note

Note : due to lack of time and simplicity, other token standard where abstracted and replaced with a mock representation(state vars) placeholder which is good and convinient for setup and testing

#### conclusion

This project is a gamified NFT project and MVP was built without UI (webpage)
