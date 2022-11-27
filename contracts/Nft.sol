pragma ever-solidity >=0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "./modules/TIP4_1/TIP4_1Nft.sol";
import "./modules/TIP4_3/TIP4_3Nft.sol";
import "./modules/TIP4_2/TIP4_2Nft.sol";
import "./interfaces/ITokenBurned.sol";
import "./abstract/GameManager.sol";
import "./libraries/JSONAttributes.sol";
import "./Unique.sol";

contract Nft is TIP4_1Nft, TIP4_2Nft, TIP4_3Nft, GameManager, Unique {
  constructor(
    address owner,
    address gameManager,
    address sendGasTo,
    uint128 remainOnNft,
    string json,
    uint128 indexDeployValue,
    uint128 indexDestroyValue,
    TvmCell codeIndex
  )
    public
    TIP4_1Nft(owner, sendGasTo, remainOnNft)
    TIP4_2Nft(json)
    TIP4_3Nft(indexDeployValue, indexDestroyValue, codeIndex)
    GameManager(gameManager)
  {
    tvm.accept();
  }

  function getJson() external view responsible override returns (string json) {
    return { value: 0, flag: 64, bounce: false } (_json);
  }

  /* 
  /// See interfaces/ITIP4_2JSON_Metadata.sol
  function getJson() external view responsible override returns (string json) {
    return
      { value: 0, flag: 64, bounce: false } (
        /// @dev Add attributes from contract storage to json
        /// Use JSONAttributes library to build json with dynamic attributes
        JSONAttributes.buildAdd(
          /// @dev Defualt `Nft` json
          _json,
          [
            /// @dev Array of attribute types
            ATTRIBUTE_TYPE.ANY,
            ATTRIBUTE_TYPE.STRING
          ],
          [
            /// @dev Array of attribute `trait_type`
            "Points",
            "Rarity"
          ],
          [
            /// @dev Array of attribute `value`
            /// All data must be formatted into a string
            format("{}", _points),
            _rarity
          ]
        )
      );
  }
*/
  function feed(uint256 _amount) external {
    tvm.accept();
    _feed(_amount * decimal());
  }

  function claimRewards() external {
    tvm.accept();
    _claimReward();
  }

  function returnCurrentBlockTimestamp() public view returns (uint256) {
    return now;
  }

  function _beforeTransfer(
    address to,
    address sendGasTo,
    mapping(address => CallbackParams) callbacks
  ) internal virtual override(TIP4_1Nft) {
    //TIP4_3Nft._beforeTransfer(to, sendGasTo, callbacks);
  }

  function _afterTransfer(
    address to,
    address sendGasTo,
    mapping(address => CallbackParams) callbacks
  ) internal virtual override(TIP4_1Nft) {
    // TIP4_3Nft._afterTransfer(to, sendGasTo, callbacks);
  }

  function _beforeChangeOwner(
    address oldOwner,
    address newOwner,
    address sendGasTo,
    mapping(address => CallbackParams) callbacks
  ) internal virtual override(TIP4_1Nft) {
    // TIP4_3Nft._beforeChangeOwner(oldOwner, newOwner, sendGasTo, callbacks);
  }

  function _afterChangeOwner(
    address oldOwner,
    address newOwner,
    address sendGasTo,
    mapping(address => CallbackParams) callbacks
  ) internal virtual override(TIP4_1Nft) {
    // TIP4_3Nft._afterChangeOwner(oldOwner, newOwner, sendGasTo, callbacks);
  }

  function burn(address dest) external virtual onlyManager {
    tvm.accept();
    ITokenBurned(_collection).onTokenBurned(_id, _owner, _manager);
    selfdestruct(dest);
  }
}
