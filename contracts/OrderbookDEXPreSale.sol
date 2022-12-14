// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.17;

import { IOrderbookDEXToken } from "./interfaces/IOrderbookDEXToken.sol";
import { IOrderbookDEXPreSale } from "./interfaces/IOrderbookDEXPreSale.sol";

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
     * The amount of eth collected to consider the pre-sale successful.
     *
     * If the pre-sale ends below this target, buyers won't get the tokens but will be able to cancel to get refunded.
     */
    uint256 private immutable _successThreshold;

    /**
     * The exchange rate as amount of tokens received per 1 ether during the early stage.
     */
    uint256 private immutable _earlyExchangeRate;

    /**
     * The time the early stage ends.
     */
    uint256 private immutable _earlyEndTime;

    /**
     * The maximum amount of tokens that can be sold during the early stage.
     */
    uint256 private immutable _earlyLimit;

    /**
     * The total amount sold.
     */
    uint256 private _totalSold;

    /**
     * The amount sold to an account.
     */
    mapping(address => uint256) _amountSold;

    /**
     * The total amount paid by all buyers.
     */
    uint256 private _totalPaid;

    /**
     * The amount paid by an account.
     */
    mapping(address => uint256) _amountPaid;

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
     * @param successThreshold_      the amount of eth collected to consider the pre-sale successful
     * @param earlyExchangeRate_     the exchange rate as amount of tokens received per 1 ether during the early stage
     * @param earlyEndTime_          the time the early stage ends
     * @param earlyLimit_            the maximum amount of tokens that can be sold during the early stage
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
        uint256            buyLimit_,
        uint256            successThreshold_,
        uint256            earlyExchangeRate_,
        uint256            earlyEndTime_,
        uint256            earlyLimit_
    ) {
        require(startTime_ < earlyEndTime_);
        require(earlyEndTime_ < endTime_);
        require(endTime_ < releaseTime_);
        require(exchangeRate_ > 0);
        require(earlyExchangeRate_ > 0);
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
        _successThreshold      = successThreshold_;
        _earlyExchangeRate     = earlyExchangeRate_;
        _earlyEndTime          = earlyEndTime_;
        _earlyLimit            = earlyLimit_;
    }

    function buy() external payable returns (uint256 amountBought, uint256 amountPaid_) {
        uint256 currentTime = block.timestamp;
        if (currentTime < _startTime) {
            revert NotStarted();
        }
        if (currentTime >= _endTime) {
            revert Ended();
        }

        uint256 totalSold_ = _totalSold;

        uint256 amountAvailable = _token.balanceOf(address(this)) - totalSold_;
        if (amountAvailable == 0) {
            revert SoldOut();
        }

        {
            uint256 buyLimit_ = _buyLimit - _amountSold[msg.sender];
            if (buyLimit_ == 0) {
                revert BuyLimitReached();
            }
            if (amountAvailable > buyLimit_) {
                amountAvailable = buyLimit_;
            }
        }

        uint256 earlyLimit_ = _earlyLimit;

        if (totalSold_ < earlyLimit_ && currentTime < _earlyEndTime) {
            uint256 earlyAvailable = earlyLimit_ - totalSold_;
            if (earlyAvailable > amountAvailable) {
                earlyAvailable = amountAvailable;
            }

            (uint256 bought, uint256 paid) =
                calculateBoughtTokens(msg.value, _earlyExchangeRate, earlyAvailable);

            if (bought == 0) {
                revert NotEnoughFunds();
            }

            amountBought = bought;
            amountPaid_ = paid;

            if (msg.value > paid && amountAvailable > earlyAvailable) {
                (uint256 bought2, uint256 paid2) =
                    calculateBoughtTokens(msg.value - paid, _exchangeRate, amountAvailable - bought);

                amountBought += bought2;
                amountPaid_ += paid2;
            }

        } else {
            (uint256 bought, uint256 paid) =
                calculateBoughtTokens(msg.value, _exchangeRate, amountAvailable);

            if (bought == 0) {
                revert NotEnoughFunds();
            }

            amountBought = bought;
            amountPaid_ = paid;
        }

        _amountSold[msg.sender] += amountBought;
        _totalSold += amountBought;

        _amountPaid[msg.sender] += amountPaid_;
        _totalPaid += amountPaid_;

        if (msg.value > amountPaid_) {
            payable(msg.sender).transfer(msg.value - amountPaid_);
        }
    }

    function claim() external returns (uint256) {
        uint256 currentTime = block.timestamp;
        if (currentTime < _releaseTime) {
            revert NotReleased();
        }

        if (_totalPaid < _successThreshold) {
            revert NotSuccessful();
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

    function cancel() external returns (uint256 amountReturned, uint256 amountRefunded) {
        uint256 currentTime = block.timestamp;
        if (currentTime >= _endTime) {
            if (_totalPaid >= _successThreshold) {
                revert Ended();
            }
        }

        amountReturned = _amountSold[msg.sender];
        amountRefunded = _amountPaid[msg.sender];

        if (amountRefunded == 0) {
            revert NothingToCancel();
        }

        _amountSold[msg.sender] -= amountReturned;
        _totalSold -= amountReturned;

        _amountPaid[msg.sender] -= amountRefunded;
        _totalPaid -= amountRefunded;

        payable(msg.sender).transfer(amountRefunded);
    }

    function withdraw() external returns (uint256) {
        if (msg.sender != _treasury) {
            revert Unauthorized();
        }

        uint256 currentTime = block.timestamp;
        if (currentTime < _endTime) {
            revert NotEnded();
        }

        if (_totalPaid < _successThreshold) {
            revert NotSuccessful();
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

    function successThreshold() external view returns (uint256) {
        return _successThreshold;
    }

    function earlyExchangeRate() external view returns (uint256) {
        return _earlyExchangeRate;
    }

    function earlyEndTime() external view returns (uint256) {
        return _earlyEndTime;
    }

    function earlyLimit() external view returns (uint256) {
        return _earlyLimit;
    }

    function totalSold() external view returns (uint256) {
        return _totalSold;
    }

    function amountSold(address account) external view returns (uint256) {
        return _amountSold[account];
    }

    function totalPaid() external view returns (uint256) {
        return _totalPaid;
    }

    function amountPaid(address account) external view returns (uint256) {
        return _amountPaid[account];
    }

    function amountClaimed(address account) external view returns (uint256) {
        return _amountClaimed[account];
    }

    function calculateBoughtTokens(uint256 value, uint256 rate, uint256 limit) private pure
        returns (uint256 bought, uint256 paid)
    {
            bought = value * rate / 1 ether;
            if (bought != 0) {
                if (bought > limit) {
                    bought = limit;
                }
                paid = bought * 1 ether / rate;
            }
    }
}
