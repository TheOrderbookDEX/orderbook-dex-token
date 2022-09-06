// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.15;

import { IOrderbookDEXToken } from "./interfaces/IOrderbookDEXToken.sol";
import { IOrderbookDEXPreSale } from "./interfaces/IOrderbookDEXPreSale.sol";

// TODO pre-sale stages

/**
 * The Orderbook DEX Token pre-sale.
 */
contract OrderbookDEXPreSale is IOrderbookDEXPreSale {
    /**
     * The Orderbook DEX token.
     */
    IOrderbookDEXToken private immutable _token;

    /**
     * The Orderbook DEX treasury.
     */
    address payable private immutable _treasury;

    /**
     * The time the pre-sale starts.
     */
    uint256 private immutable _startTime;

    /**
     * The time the pre-sale ends.
     */
    uint256 private immutable _endTime;

    /**
     * The time bought tokens are released.
     */
    uint256 private immutable _releaseTime;

    /**
     * The exchange rate as amount of tokens received per 1 ether.
     */
    uint256 private immutable _exchangeRate;

    /**
     * The amount of tokens available at release per 1e18 tokens bought.
     */
    uint256 private immutable _availableAtRelease;

    /**
     * The duration of each vesting period.
     */
    uint256 private immutable _vestingPeriod;

    /**
     * The amount of tokens vested after one period per 1e18 tokens bought.
     */
    uint256 private immutable _vestedAmountPerPeriod;

    /**
     * The maximum amount of tokens an address can buy.
     */
    uint256 private immutable _buyLimit;

    /**
     * The total amount sold.
     */
    uint256 private _totalSold;

    /**
     * The amount sold to an account.
     */
    mapping(address => uint256) _amountSold;

    /**
     * The amount claimed by an account.
     */
    mapping(address => uint256) _amountClaimed;

    /**
     * Constructor.
     *
     * @param token_                 The Orderbook DEX token
     * @param treasury_              The Orderbook DEX treasury
     * @param startTime_             the time the pre-sale starts
     * @param endTime_               the time the pre-sale ends
     * @param releaseTime_           the time bought tokens are released
     * @param exchangeRate_          the exchange rate
     * @param availableAtRelease_    the amount of tokens available at release per 1e18 tokens bought
     * @param vestingPeriod_         the duration of each vesting period
     * @param vestedAmountPerPeriod_ the amount of tokens vested after one period per 1e18 tokens bought
     * @param buyLimit_              the maximum amount of tokens an address can buy
     */
    constructor(
        IOrderbookDEXToken token_,
        address payable    treasury_,
        uint256            startTime_,
        uint256            endTime_,
        uint256            releaseTime_,
        uint256            exchangeRate_,
        uint256            availableAtRelease_,
        uint256            vestingPeriod_,
        uint256            vestedAmountPerPeriod_,
        uint256            buyLimit_
    ) {
        require(startTime_ < endTime_);
        require(endTime_ < releaseTime_);
        require(exchangeRate_ > 0);
        require(vestingPeriod_ > 0);
        require(vestedAmountPerPeriod_ > 0);
        require(buyLimit_ > 0);

        _token                 = token_;
        _treasury              = treasury_;
        _startTime             = startTime_;
        _endTime               = endTime_;
        _releaseTime           = releaseTime_;
        _exchangeRate          = exchangeRate_;
        _availableAtRelease    = availableAtRelease_;
        _vestingPeriod         = vestingPeriod_;
        _vestedAmountPerPeriod = vestedAmountPerPeriod_;
        _buyLimit              = buyLimit_;
    }

    function buy() external payable returns (uint256 amountBought, uint256 amountPaid) {
        uint256 currentTime = block.timestamp;
        if (currentTime < _startTime) {
            revert NotStarted();
        }
        if (currentTime >= _endTime) {
            revert Ended();
        }

        uint256 amountAvailable = _token.balanceOf(address(this)) - _totalSold;
        if (amountAvailable == 0) {
            revert SoldOut();
        }

        uint256 buyLimit_ = _buyLimit - _amountSold[msg.sender];
        if (buyLimit_ == 0) {
            revert BuyLimitReached();
        }

        uint256 exchangeRate_ = _exchangeRate;
        amountBought = msg.value * exchangeRate_ / 1 ether;
        if (amountBought == 0) {
            revert NotEnoughFunds();
        }

        if (amountBought > amountAvailable) {
            amountBought = amountAvailable;
        }
        if (amountBought > buyLimit_) {
            amountBought = buyLimit_;
        }

        amountPaid = amountBought * 1 ether / exchangeRate_;

        _amountSold[msg.sender] += amountBought;
        _totalSold += amountBought;

        if (msg.value > amountPaid) {
            payable(msg.sender).transfer(msg.value - amountPaid);
        }
    }

    function claim() external returns (uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime < _releaseTime) {
            revert NotReleased();
        }

        uint256 availableRatio = _availableAtRelease
            + (currentTime - _releaseTime) / _vestingPeriod * _vestedAmountPerPeriod;
        uint256 amountSold_ = _amountSold[msg.sender];
        uint256 available = amountSold_ * availableRatio / 1e18;
        if (available > amountSold_) {
            available = amountSold_;
        }
        available -= _amountClaimed[msg.sender];

        if (available == 0) {
            revert NothingToClaim();
        }

        _amountClaimed[msg.sender] += available;

        _token.transfer(msg.sender, available);

        return available;
    }

    function withdraw() external returns (uint256) {
        if (msg.sender != _treasury) {
            revert Unauthorized();
        }

        uint256 currentTime = block.timestamp;
        if (currentTime < _endTime) {
            revert NotEnded();
        }

        uint256 amountWithdrawn = address(this).balance;
        if (amountWithdrawn == 0) {
            revert NothingToWithdraw();
        }

        _treasury.transfer(amountWithdrawn);
        return amountWithdrawn;
    }

    function token() external view returns (IOrderbookDEXToken) {
        return _token;
    }

    function treasury() external view returns (address) {
        return _treasury;
    }

    function startTime() external view returns (uint256) {
        return _startTime;
    }

    function endTime() external view returns (uint256) {
        return _endTime;
    }

    function releaseTime() external view returns (uint256) {
        return _releaseTime;
    }

    function exchangeRate() external view returns (uint256) {
        return _exchangeRate;
    }

    function availableAtRelease() external view returns (uint256) {
        return _availableAtRelease;
    }

    function vestingPeriod() external view returns (uint256) {
        return _vestingPeriod;
    }

    function vestedAmountPerPeriod() external view returns (uint256) {
        return _vestedAmountPerPeriod;
    }

    function buyLimit() external view returns (uint256) {
        return _buyLimit;
    }

    function totalSold() external view returns (uint256) {
        return _totalSold;
    }

    function amountSold(address account) external view returns (uint256) {
        return _amountSold[account];
    }

    function amountClaimed(address account) external view returns (uint256) {
        return _amountClaimed[account];
    }
}
