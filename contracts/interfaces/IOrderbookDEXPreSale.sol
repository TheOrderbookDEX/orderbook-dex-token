// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IOrderbookDEXToken } from "./IOrderbookDEXToken.sol";

/**
 * The Orderbook DEX Token pre-sale.
 */
interface IOrderbookDEXPreSale {
    /**
     * Error thrown when the pre-sale hasn't started yet.
     */
    error NotStarted();

    /**
     * Error thrown when the pre-sale has ended.
     */
    error Ended();

    /**
     * Error thrown when there are no more tokens for sale.
     */
    error SoldOut();

    /**
     * Error thrown when not enough funds where provided to buy tokens.
     */
    error NotEnoughFunds();

    /**
     * Error thrown when the tokens hasn't been released yet.
     */
    error NotReleased();

    /**
     * Error thrown when there are no tokens to claim.
     */
    error NothingToClaim();

    /**
     * Error thrown when no more tokens can be bought because the buy limit has been reached.
     */
    error BuyLimitReached();

    /**
     * Error thrown when a function is called by someone not authorized o do so.
     */
    error Unauthorized();

    /**
     * Error thrown when the pre-sale hasn't ended yet.
     */
    error NotEnded();

    /**
     * Error thrown when there are no eth to withdraw.
     */
    error NothingToWithdraw();

    /**
     * Error thrown when there are no tokens to cancel.
     */
    error NothingToCancel();

    /**
     * Error thrown when the pre-sale wasn't successful.
     */
    error NotSuccessful();

    /**
     * Buy tokens.
     *
     * Amount of tokens bought is determined by eth sent and tokens available.
     *
     * Can only be called between start time and end time.
     *
     * @return amountBought the amount of tokens bought
     * @return amountPaid   the amount of eth paid
     */
    function buy() external payable returns (uint256 amountBought, uint256 amountPaid);

    /**
     * Claim tokens.
     *
     * Can only be called after release time.
     *
     * @return amountClaimed the amount of tokens claimed
     */
    function claim() external returns (uint256 amountClaimed);

    /**
     * Cancel buy.
     *
     * Can only be called before end time.
     *
     * @return amountReturned the amount of tokens returned
     * @return amountRefunded the amount of eth refunded
     */
    function cancel() external returns (uint256 amountReturned, uint256 amountRefunded);

    /**
     * Withdraw eth from the pre-sale contract.
     *
     * This can only be called by the treasury and after the pre-sale has ended.
     *
     * @return amountWithdrawn the amount withdrawn
     */
    function withdraw() external returns (uint256 amountWithdrawn);

    /**
     * The Orderbook DEX token.
     *
     * @return token The Orderbook DEX token
     */
    function token() external view returns (IOrderbookDEXToken token);

    /**
     * The Orderbook DEX treasury.
     *
     * @return treasury The Orderbook DEX treasury
     */
    function treasury() external view returns (address treasury);

    /**
     * The time the pre-sale starts.
     *
     * @return startTime the time the pre-sale starts
     */
    function startTime() external view returns (uint256 startTime);

    /**
     * The time the pre-sale ends.
     *
     * @return endTime the time the pre-sale ends
     */
    function endTime() external view returns (uint256 endTime);

    /**
     * The time bought tokens are released.
     *
     * @return releaseTime the time bought tokens are released
     */
    function releaseTime() external view returns (uint256 releaseTime);

    /**
     * The exchange rate as amount of tokens received per 1 ether.
     *
     * @return exchangeRate the exchange rate as amount of tokens received per 1 ether
     */
    function exchangeRate() external view returns (uint256 exchangeRate);

    /**
     * The total amount sold.
     *
     * @return totalSold the total amount sold
     */
    function totalSold() external view returns (uint256 totalSold);

    /**
     * The amount sold to an account.
     *
     * @param  account    the account
     * @return amountSold the amount sold to the account
     */
    function amountSold(address account) external view returns (uint256 amountSold);

    /**
     * The total amount paid by all buyers.
     *
     * @return totalPaid the total amount paid by all buyers
     */
    function totalPaid() external view returns (uint256 totalPaid);

    /**
     * The amount paid by an account.
     *
     * @param  account    the account
     * @return amountPaid the amount paid by the account
     */
    function amountPaid(address account) external view returns (uint256 amountPaid);

    /**
     * The amount claimed by an account.
     *
     * @param  account       the account
     * @return amountClaimed the amount claimed by the account
     */
    function amountClaimed(address account) external view returns (uint256 amountClaimed);

    /**
     * The amount of tokens available at release per 1e18 tokens bought.
     *
     * @return availableAtRelease the amount of tokens available at release per 1e18 tokens bought
     */
    function availableAtRelease() external view returns (uint256 availableAtRelease);

    /**
     * The duration of each vesting period.
     *
     * @return vestingPeriod the duration of each vesting period
     */
    function vestingPeriod() external view returns (uint256 vestingPeriod);

    /**
     * The amount of tokens vested after one period per 1e18 tokens bought.
     *
     * @return vestedAmountPerPeriod the amount of tokens vested after one period per 1e18 tokens bought
     */
    function vestedAmountPerPeriod() external view returns (uint256 vestedAmountPerPeriod);

    /**
     * The maximum amount of tokens an address can buy.
     *
     * @return buyLimit the maximum amount of tokens an address can buy
     */
    function buyLimit() external view returns (uint256 buyLimit);

    /**
     * The amount of eth collected to consider the pre-sale successful.
     *
     * If the pre-sale ends below this target, buyers won't get the tokens but will be able to cancel to get refunded.
     *
     * @return successThreshold the amount of eth collected to consider the pre-sale successful
     */
    function successThreshold() external view returns (uint256 successThreshold);
}
