// SPDX-License-Identifier: BUSL-1.1

pragma solidity ^0.8.0;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IOrderbookDEXTeamTreasury } from "./IOrderbookDEXTeamTreasury.sol";
import { IOrderbookDEXSeed } from "./IOrderbookDEXSeed.sol";
import { IOrderbookDEXPreSale } from "./IOrderbookDEXPreSale.sol";
import { IOrderbookDEXPublicSale } from "./IOrderbookDEXPublicSale.sol";

/**
 * The Orderbook DEX token.
 */
interface IOrderbookDEXToken is IERC20 {
    /**
     * Burn tokens.
     *
     * @param amount the amount of tokens to burn
     */
    function burn(uint256 amount) external;

    /**
     * Burn tokens from allowance.
     *
     * @param account the account who own the tokens to burn
     * @param amount  the amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) external;

    /**
     * The Orderbook DEX Team Treasury.
     *
     * @return treasury The Orderbook DEX Team Treasury
     */
    function treasury() external view returns (IOrderbookDEXTeamTreasury treasury);

    /**
     * The tokens initially issued to The Orderbook DEX Team Treasury.
     *
     * @return treasuryTokens the tokens initially issued to The Orderbook DEX Team Treasury
     */
    function treasuryTokens() external view returns (uint256 treasuryTokens);

    /**
     * The Orderbook DEX seed investors token distribution.
     *
     * @return seed The Orderbook DEX seed investors token distribution
     */
    function seed() external view returns (IOrderbookDEXSeed seed);

    /**
     * The tokens initially issued to seed investors.
     *
     * @return seedTokens the tokens initially issued to seed investors
     */
    function seedTokens() external view returns (uint256 seedTokens);

    /**
     * The Orderbook DEX pre-sale.
     *
     * @return preSale The Orderbook DEX pre-sale
     */
    function preSale() external view returns (IOrderbookDEXPreSale preSale);

    /**
     * The tokens initially issued for the pre-sale.
     *
     * @return preSaleTokens the tokens initially issued for the pre-sale
     */
    function preSaleTokens() external view returns (uint256 preSaleTokens);

    /**
     * The Orderbook DEX public sale.
     *
     * @return publicSale The Orderbook DEX public sale
     */
    function publicSale() external view returns (IOrderbookDEXPublicSale publicSale);

    /**
     * The tokens initially issued for the public sale.
     *
     * @return publicSaleTokens the tokens initially issued for the public sale
     */
    function publicSaleTokens() external view returns (uint256 publicSaleTokens);
}
