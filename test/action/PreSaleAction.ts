import { TestSetupAction, TestSetupActionProperties } from '@theorderbookdex/contract-test-helper';
import { PreSaleContext } from '../scenario/PreSaleScenario';

export type PreSaleActionProperties = TestSetupActionProperties;

export abstract class PreSaleAction extends TestSetupAction<PreSaleContext> {
}
