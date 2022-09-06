import { DefaultOverrides, getBalance, getBlockTimestamp } from '@theorderbookdex/abi2ts-lib';
import { describeError } from '@theorderbookdex/contract-test-helper';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { IOrderbookDEXToken } from '../src/interfaces/IOrderbookDEXToken';
import { buyPreSaleScenarios } from './scenarios/buyPreSaleScenarios';
import { claimPreSaleScenarios } from './scenarios/claimPreSaleScenarios';
import { deployPreSaleScenarios } from './scenarios/deployPreSaleScenarios';
import { withdrawPreSaleScenarios } from './scenarios/withdrawPreSaleScenarios';
import { ETHER } from './utils/eth-units';
import { transactionCost } from './utils/ethereum';
import { min } from './utils/math';

chai.use(chaiAsPromised);

DefaultOverrides.gasLimit = 5000000;

describe('OrderbookDEXPreSale', () => {
    describe('deploy', () => {
        for (const scenario of deployPreSaleScenarios) {
            scenario.describe(({ it }) => {
                if (scenario.expectedError) {
                    it('should fail', async (test) => {
                        await expect(test.execute())
                            .to.be.rejected;
                    });

                    it(`should fail with ${describeError(scenario.expectedError)}`, async (test) => {
                        await expect(test.executeStatic())
                            .to.be.rejectedWith(scenario.expectedError as typeof Error);
                    });

                } else {
                    it('should deploy with the provided token', async (test) => {
                        const preSale = await test.execute();
                        expect((await preSale.token()).toUpperCase())
                            .to.be.equal(scenario.token.toUpperCase());
                    });

                    it('should deploy with the provided treasury', async (test) => {
                        const preSale = await test.execute();
                        expect((await preSale.treasury()).toUpperCase())
                            .to.be.equal(scenario.treasury.toUpperCase());
                    });

                    it('should deploy with the provided start time', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.startTime())
                            .to.be.equal(test.startTime);
                    });

                    it('should deploy with the provided end time', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.endTime())
                            .to.be.equal(test.endTime);
                    });

                    it('should deploy with the provided release time', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.releaseTime())
                            .to.be.equal(test.releaseTime);
                    });

                    it('should deploy with the provided exchange rate', async (test) => {
                        const preSale = await test.execute();
                        const exchangeRate = await preSale.exchangeRate();
                        expect(exchangeRate)
                            .to.be.equal(scenario.exchangeRate);
                    });

                    it('should deploy with the provided amount available at release', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.availableAtRelease())
                            .to.be.equal(scenario.availableAtRelease);
                    });

                    it('should deploy with the provided vesting period', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.vestingPeriod())
                            .to.be.equal(scenario.vestingPeriod);
                    });

                    it('should deploy with the provided vested amount per period', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.vestedAmountPerPeriod())
                            .to.be.equal(scenario.vestedAmountPerPeriod);
                    });

                    it('should deploy with the provided buy limit', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.buyLimit())
                            .to.be.equal(scenario.buyLimit);
                    });
                }
            });
        }
    });

    describe('buy', () => {
        for (const scenario of buyPreSaleScenarios) {
            scenario.describe(({ it }) => {
                if (scenario.expectedError) {
                    it('should fail', async (test) => {
                        await expect(test.execute())
                            .to.be.rejected;
                    });

                    it(`should fail with ${describeError(scenario.expectedError)}`, async (test) => {
                        await expect(test.executeStatic())
                            .to.be.rejectedWith(scenario.expectedError as typeof Error);
                    });

                } else {
                    it('should return amount bought', async (test) => {
                        const { preSale, mainAccount } = test;
                        const token = IOrderbookDEXToken.at(await preSale.token());
                        const available = await token.balanceOf(preSale) - await preSale.totalSold();
                        const buyLimit = await preSale.buyLimit() - await preSale.amountSold(mainAccount);
                        const [ amountBought ] = await test.executeStatic();
                        const expectedAmountBought = min(scenario.value * scenario.exchangeRate / ETHER, available, buyLimit);
                        expect(amountBought)
                            .to.be.equal(expectedAmountBought);
                    });

                    it('should return amount paid', async (test) => {
                        const [ amountBought, amountPaid ] = await test.executeStatic();
                        expect(amountPaid)
                            .to.be.equal(amountBought * ETHER / scenario.exchangeRate);
                    });

                    it('should increase eth balance by amount paid', async (test) => {
                        const { preSale } = test;
                        const [ , amountPaid ] = await test.executeStatic();
                        const expectedBalance = await getBalance(preSale.address) + amountPaid;
                        await test.execute();
                        expect(await getBalance(preSale.address))
                            .to.be.equal(expectedBalance);
                    });

                    it('should return unused funds to buyer', async (test) => {
                        const { mainAccount } = test;
                        const [ , amountPaid ] = await test.executeStatic();
                        const prevBalance = await getBalance(mainAccount);
                        const tx = await test.execute();
                        const txCost = transactionCost(tx);
                        expect(await getBalance(mainAccount))
                            .to.be.equal(prevBalance - txCost - amountPaid);
                    });

                    it('should increase total amount sold', async (test) => {
                        const { preSale } = test;
                        const [ amountBought ] = await test.executeStatic();
                        const expectedTotalSold = await preSale.totalSold() + amountBought;
                        await test.execute();
                        expect(await preSale.totalSold())
                            .to.be.equal(expectedTotalSold);
                    });

                    it('should increase amount sold for buyer', async (test) => {
                        const { preSale, mainAccount } = test;
                        const [ amountBought ] = await test.executeStatic();
                        const expectedAmountSold = await preSale.amountSold(mainAccount) + amountBought;
                        await test.execute();
                        expect(await preSale.amountSold(mainAccount))
                            .to.be.equal(expectedAmountSold);
                    });

                    it('should increase total amount paid', async (test) => {
                        const { preSale } = test;
                        const [ , amountPaid ] = await test.executeStatic();
                        const expectedTotalPaid = await preSale.totalPaid() + amountPaid;
                        await test.execute();
                        expect(await preSale.totalPaid())
                            .to.be.equal(expectedTotalPaid);
                    });

                    it('should increase amount paid for buyer', async (test) => {
                        const { preSale, mainAccount } = test;
                        const [ , amountPaid ] = await test.executeStatic();
                        const expectedAmountPaid = await preSale.amountPaid(mainAccount) + amountPaid;
                        await test.execute();
                        expect(await preSale.amountPaid(mainAccount))
                            .to.be.equal(expectedAmountPaid);
                    });
                }
            });
        }
    });

    describe('claim', () => {
        for (const scenario of claimPreSaleScenarios) {
            scenario.describe(({ it }) => {
                if (scenario.expectedError) {
                    it('should fail', async (test) => {
                        await expect(test.execute())
                            .to.be.rejected;
                    });

                    it(`should fail with ${describeError(scenario.expectedError)}`, async (test) => {
                        await expect(test.executeStatic())
                            .to.be.rejectedWith(scenario.expectedError as typeof Error);
                    });

                } else {
                    it('should return amount claimed', async (test) => {
                        const { preSale, mainAccount } = test;
                        const amountBought = await preSale.amountSold(mainAccount);
                        const timestamp = BigInt(await getBlockTimestamp());
                        const releaseTime = await preSale.releaseTime();
                        const availableAtRelease = await preSale.availableAtRelease();
                        const vestingPeriod = await preSale.vestingPeriod();
                        const vestedAmountPerPeriod = await preSale.vestedAmountPerPeriod();
                        const availableRatio = availableAtRelease + (timestamp - releaseTime) / vestingPeriod * vestedAmountPerPeriod;
                        const amountAvailable = min(amountBought * availableRatio / ETHER, amountBought);
                        const amountClaimedBefore = await preSale.amountClaimed(mainAccount);
                        const amountClaimed = await test.executeStatic();
                        expect(amountClaimed)
                            .to.be.equal(amountAvailable - amountClaimedBefore);
                    });

                    it('should transfer amount claimed to buyer', async (test) => {
                        const { preSale, mainAccount } = test;
                        const token = IOrderbookDEXToken.at(await preSale.token());
                        const amountClaimed = await test.executeStatic();
                        const expectedBalance = await token.balanceOf(mainAccount) + amountClaimed;
                        await test.execute();
                        expect(await token.balanceOf(mainAccount))
                            .to.be.equal(expectedBalance);
                    });

                    it('should increase amount claimed for buyer', async (test) => {
                        const { preSale, mainAccount } = test;
                        const amountClaimed = await test.executeStatic();
                        const expectedAmountClaimed = await preSale.amountClaimed(mainAccount) + amountClaimed;
                        await test.execute();
                        expect(await preSale.amountClaimed(test.mainAccount))
                            .to.be.equal(expectedAmountClaimed);
                    });
                }
            });
        }
    });

    describe('cancel', () => {
        // TODO test cancel pre-sale
    });

    describe('withdraw', () => {
        for (const scenario of withdrawPreSaleScenarios) {
            scenario.describe(({ it }) => {
                if (scenario.expectedError) {
                    it('should fail', async (test) => {
                        await expect(test.execute())
                            .to.be.rejected;
                    });

                    it(`should fail with ${describeError(scenario.expectedError)}`, async (test) => {
                        await expect(test.executeStatic())
                            .to.be.rejectedWith(scenario.expectedError as typeof Error);
                    });

                } else {
                    it('should return amount withdrawn', async (test) => {
                        const { preSale } = test;
                        const expectedAmountWithdrawn = await getBalance(preSale.address);
                        const amountWithdrawn = await test.executeStatic();
                        expect(amountWithdrawn)
                            .to.be.equal(expectedAmountWithdrawn);
                    });

                    it('should transfer amount withdrawn to sender', async (test) => {
                        const { mainAccount } = test;
                        const amountWithdrawn = await test.executeStatic();
                        const prevBalance = await getBalance(mainAccount);
                        const tx = await test.execute();
                        const txCost = transactionCost(tx);
                        expect(await getBalance(mainAccount))
                            .to.be.equal(prevBalance - txCost + amountWithdrawn);
                    });
                }
            });
        }
    });
});
