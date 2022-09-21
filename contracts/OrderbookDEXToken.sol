// SPDX-License-Identifier: BUSL-1.1

pragma solidity 0.8.17;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { ERC20Burnable } from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import { IOrderbookDEXToken } from "./interfaces/IOrderbookDEXToken.sol";
import { IOrderbookDEXTeamTreasury } from "./interfaces/IOrderbookDEXTeamTreasury.sol";
import { IOrderbookDEXSeed } from "./interfaces/IOrderbookDEXSeed.sol";
import { IOrderbookDEXPreSale } from "./interfaces/IOrderbookDEXPreSale.sol";
import { IOrderbookDEXPublicSale } from "./interfaces/IOrderbookDEXPublicSale.sol";

/**
 * The Orderbook DEX token.
 *
 * Total supply is fully minted and assigned on construction.
 *
 * Token is burnable. This will be used when deploying the protocol on other chains to remint tokens
 * there that are burned in chains where the protocol is already deployed, keeping the total supply
 * the same accross all chains.
 */
contract OrderbookDEXToken is ERC20, ERC20Burnable, IOrderbookDEXToken {
    uint256 constant TREASURY_TOKENS    = 1050000000 ether;
    uint256 constant SEED_TOKENS        =   15000000 ether;
    uint256 constant PRE_SALE_TOKENS    =  390000000 ether;
    uint256 constant PUBLIC_SALE_TOKENS =   45000000 ether;

    /**
     * The Orderbook DEX Team Treasury.
     */
    IOrderbookDEXTeamTreasury immutable _treasury;

    /**
     * The Orderbook DEX seed investors token distribution.
     */
    IOrderbookDEXSeed immutable _seed;

    /**
     * The Orderbook DEX pre-sale.
     */
    IOrderbookDEXPreSale immutable _preSale;

    /**
     * The Orderbook DEX public sale.
     */
    IOrderbookDEXPublicSale immutable _publicSale;

    /**
     * Constructor.
     *
     * @param treasury_   The Orderbook DEX Team Treasury
     * @param seed_       The Orderbook DEX seed investors token distribution
     * @param preSale_    The Orderbook DEX pre-sale
     * @param publicSale_ The Orderbook DEX public sale
     */
    constructor(
        IOrderbookDEXTeamTreasury treasury_,
        IOrderbookDEXSeed         seed_,
        IOrderbookDEXPreSale      preSale_,
        IOrderbookDEXPublicSale   publicSale_
    )
        ERC20("The Orderbook DEX Token", "OBD")
    {
        _treasury   = treasury_;
        _seed       = seed_;
        _preSale    = preSale_;
        _publicSale = publicSale_;

        _mint(address(treasury_),   treasuryTokens());
        _mint(address(seed_),       seedTokens());
        _mint(address(preSale_),    preSaleTokens());
        _mint(address(publicSale_), publicSaleTokens());
    }

    function burn(uint256 amount) public override (ERC20Burnable, IOrderbookDEXToken) {
        ERC20Burnable.burn(amount);
    }

    function burnFrom(address account, uint256 amount) public override (ERC20Burnable, IOrderbookDEXToken) {
        ERC20Burnable.burnFrom(account, amount);
    }

    function treasury() external view returns (IOrderbookDEXTeamTreasury) {
        return _treasury;
    }

    function treasuryTokens() public pure returns (uint256) {
        return TREASURY_TOKENS;
    }

    function seed() external view returns (IOrderbookDEXSeed) {
        return _seed;
    }

    function seedTokens() public pure returns (uint256) {
        return SEED_TOKENS;
    }

    function preSale() external view returns (IOrderbookDEXPreSale) {
        return _preSale;
    }

    function preSaleTokens() public pure returns (uint256) {
        return PRE_SALE_TOKENS;
    }

    function publicSale() external view returns (IOrderbookDEXPublicSale) {
        return _publicSale;
    }

    function publicSaleTokens() public pure returns (uint256) {
        return PUBLIC_SALE_TOKENS;
    }
}
