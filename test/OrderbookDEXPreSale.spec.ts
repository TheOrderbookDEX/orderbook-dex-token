import { DefaultOverrides } from '@theorderbookdex/abi2ts-lib';
import { describeError } from '@theorderbookdex/contract-test-helper';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { deployPreSaleScenarios } from './scenarios/deployPreSaleScenarios';

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
                        expect(await preSale.token())
                            .to.be.equal(scenario.token);
                    });

                    it('should deploy with the provided treasury', async (test) => {
                        const preSale = await test.execute();
                        expect(await preSale.treasury())
                            .to.be.equal(scenario.treasury);
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
                        expect(exchangeRate.givenAmount)
                            .to.be.equal(scenario.exchangeRate.givenAmount);
                        expect(exchangeRate.receivedAmount)
                            .to.be.equal(scenario.exchangeRate.receivedAmount);
                    });
                }
            });
        }
    });

    describe('buy', () => {
        // TODO test OrderbookDEXPreSale buy
    });

    describe('claim', () => {
        // TODO test OrderbookDEXPreSale claim
    });
});
