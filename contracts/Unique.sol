pragma ever-solidity >=0.61.2;

pragma AbiHeader expire;
pragma AbiHeader time;
pragma AbiHeader pubkey;

import "locklift/src/console.sol";

contract Unique {
  uint256 public _produce;
  uint256 public _lastTimeFeed_;
  fixed128x18 internal _rewardRate;
  uint256 internal _TKrewardPast;
  uint256 internal _CNrewardPast;
  uint256 internal _CNrewardIndex;
  uint256 public _totalFoodTkSent;
  uint256 public _totalCanivoredNFT;
  uint256[] public _totalCanivoredNFT_tokenId;
  uint256 public _timeOfCanivoreChange;
  bool public _isDead_;
  bool public _isCanivorous_;
  uint256 public TKrewardsClaimed;
  uint256 public CNrewardsClaimed;
  //uint256 internal _rewardPerMeal;
  mapping(address => uint256) public individualTokenFeedBalanceOf;

  constructor() public {
    _CNrewardIndex = 20;
    _rewardRate = 1.1;
    _lastTimeFeed_ = now;
  }

  modifier updateRewardRate() {
    _;
    if (_isCanivore() == false) {
      if (_totalFoodTkSent > 100_000_000 * 10**6) {
        _rewardRate = 1.2;
      } else if (_totalFoodTkSent > 1_000_000_000 * 10**6) {
        _rewardRate = 1.4;
      }
    }
    if (_isCanivore() == true) {
      if (_totalCanivoredNFT > 100 * 10**9) {
        _rewardRate = 1.7;
      } else if (_totalFoodTkSent > 1_000 * 10**9) {
        _rewardRate = 1.8;
      }
    }
  }

  function _feed(uint256 _amount) internal virtual updateRewardRate {
    _isDead_ = _isDead();
    require(_isDead() == false, 39, "NFT is dead");
    if (_isDead() == false) {
      _isCanivorous_ = _isCanivore();
      _lastTimeFeed_ = now;
      if (_isCanivore() == true && _timeOfCanivoreChange < 1) {
        _timeOfCanivoreChange = now;
      }
      _isCanivore() == true ? _canivoreFeed(1) : _feed_(_amount);
    }
  }

  function _canivoreFeed(uint128 _token_id) private {
    require(_isCanivore() == true, 40, "NFT is not canivore");
    _totalCanivoredNFT++;
    _totalCanivoredNFT_tokenId.push(_token_id);
  }

  function _feed_(uint256 _amount) private {
    require(_amount > 0, 102, "amount = 0");
    require(_isCanivore() == false, 30, "NFT is canivore");
    individualTokenFeedBalanceOf[msg.sender] += _amount;
    _totalFoodTkSent += _amount;
  }

  function _isDead() public view virtual returns (bool isdead) {
    (, uint256 max) = math.minmax(_lastTimeFeed_, _timeOfCanivoreChange);

    isdead = _isCanivore() == false ? (now > (_lastTimeFeed_ + 7 days)) : (now > (uint256(max) + 3 days));
  }

  function _claimableReward() public view virtual returns (uint256) {
    if (_isCanivore() == false) {
      fixed128x18 _div_value_of_tfood_sent_ = math.divr(fixed128x18(_totalFoodTkSent), 2);

      fixed128x18 _time_div_ = math.divr(fixed128x18(_lastTimeFeed_ + 4 days), now);

      (, fixed128x18 max) = math.minmax(fixed128x18(_time_div_), 1);
      (, fixed128x18 maxnum) = math.minmax(fixed128x18(((_lastTimeFeed_ + 4 days) - now) / 980), 1);
      fixed128x18 _increasing_feed_count_ = math.divr(
        (((_div_value_of_tfood_sent_) * fixed128x18(_rewardRate))),
        fixed128x18(max * maxnum)
      );

      return uint256(_increasing_feed_count_ - fixed128x18(_TKrewardPast));
    } else if (_isCanivore() == true) {
      fixed128x18 _time_div_ = math.divr(fixed128x18(_lastTimeFeed_ + 2 days), now);

      (, fixed128x18 max) = math.minmax(fixed128x18(_time_div_), 1);
      (, fixed128x18 maxnum) = math.minmax(fixed128x18(((_lastTimeFeed_ + 2 days) - now) / 980), 1);
      fixed128x18 _increasing_canivore_feed_count_ = math.divr(
        (fixed128x18(_CNrewardIndex) * (fixed128x18(_totalCanivoredNFT) * 2 * _rewardRate)),
        fixed128x18(max * maxnum)
      );

      return uint256((_increasing_canivore_feed_count_ * 1000000) - fixed128x18(_CNrewardPast));
    }
  }

  function returnTokenCountWithoutDecimal(uint256 _tokenCount) public pure returns (uint256) {
    return _tokenCount / 1000000;
  }

  function decimal() public pure returns (uint256) {
    return 1000000;
  }

  function _claimReward() internal virtual {
    require(_isDead() == false, 39, "NFT is dead");
    _isCanivore() == false ? claimtxrewards() : claimcnrewards();
  }

  function claimtxrewards() private {
    TKrewardsClaimed += _claimableReward();
    _TKrewardPast += _claimableReward();
  }

  function claimcnrewards() private {
    CNrewardsClaimed += _claimableReward();
    _CNrewardPast += _claimableReward();
  }

  function _isCanivore() public view virtual returns (bool iscanivore) {
    iscanivore = _isCanivorous_ == true ? true : (now > (_lastTimeFeed_ + 5 days));
  }

  function _lastTimeFeed() public view returns (uint256) {
    return _lastTimeFeed_;
  }

  function rewardRate() public view returns (uint256) {
    return uint256(_rewardRate);
  }
}
