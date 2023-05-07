import { Type } from '@jovotech/output';

import { EndpointBase, EndpointType } from '../../actions/ConnectAction/Endpoint';
import { SipEndpoint } from '../../actions/ConnectAction/SipEndpoint';
import { VBCEndpoint } from '../../actions/ConnectAction/VBCEndpoint';
import { AppEndpoint } from '../../actions/ConnectAction/AppEndpoint';
import { WebSocketEndpoint } from '../../actions/ConnectAction/WebSocketEndpoint';
import { PhoneEndpoint } from '../../actions/ConnectAction/PhoneEndpoint';

export function TransformEndpoint(): PropertyDecorator {
  return Type(() => EndpointBase, {
    keepDiscriminatorProperty: true,
    discriminator: {
      property: 'type',
      subTypes: [
        { value: SipEndpoint, name: EndpointType.Sip },
        { value: VBCEndpoint, name: EndpointType.VBC },
        { value: AppEndpoint, name: EndpointType.App },
        { value: WebSocketEndpoint, name: EndpointType.WebSocket },
        { value: PhoneEndpoint, name: EndpointType.Phone },
      ],
    },
  }) as PropertyDecorator;
}
