import { EndpointBase, EndpointType } from './Endpoint';
import { Equals, IsString } from '@jovotech/output';

export class VBCEndpoint extends EndpointBase<EndpointType.VBC | 'vbc'> {
  @Equals(EndpointType.VBC)
  declare type: EndpointType.VBC | 'vbc';

  @IsString()
  extension!: string;
}
