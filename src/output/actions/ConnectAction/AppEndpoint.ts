import { EndpointBase, EndpointType } from './Endpoint';
import { Equals, IsString } from '@jovotech/output';

/**
 * App - Connect the call to a RTC capable application
 */
export class AppEndpoint extends EndpointBase<EndpointType.App | 'app'> {
  @Equals(EndpointType.App)
  declare type: EndpointType.App | 'app';

  /**
   * The username of the user to connect to. This username must have been added as a user.
   */
  @IsString()
  user!: string;
}
