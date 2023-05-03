import { CapabilityType, JovoDevice } from '@jovotech/framework';
import { Vonage } from './Vonage';

export type VonageCapabilityType = CapabilityType;

export class VonageDevice extends JovoDevice<Vonage, VonageCapabilityType> {}
