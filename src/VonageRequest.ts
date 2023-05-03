import { CapabilityType, InputType, JovoInput, JovoRequest } from '@jovotech/framework';
import { InputTypeLike, UnknownObject } from '@jovotech/cli-core';

export class VonageRequest extends JovoRequest {
  $type = 'vonage';
  to!: string;
  from!: string;
  uuid!: string;
  timestamp!: string;
  conversation_uuid!: string;
  dtmf?: {
    digits: string;
    time_out: boolean;
  };
  speech?: {
    timeout_reason?: 'end_on_silence_timeout' | 'max_duration' | 'start_timeout';
    error?: string;
    recording_url?: string;
    results: {
      confidence: number;
      text: string;
    }[];
  };

  getDeviceCapabilities(): CapabilityType[] | undefined {
    return [];
  }

  getEntities(): JovoInput['entities'] {
    return;
  }

  getInputAudio(): JovoInput['audio'] {
    return;
  }

  getInputText(): JovoInput['text'] {
    return this.speech?.results[0].text ?? this.dtmf?.digits;
  }

  getInputType(): InputTypeLike | 'DTMF' | undefined {
    if (!this.speech && !this.dtmf) return InputType.Launch;
    if (this.dtmf) return 'DTMF';
    return InputType.Text;
  }

  getIntent(): JovoInput['intent'] {
    return;
  }

  getLocale(): string | undefined {
    // search for the locale from call?

    return;
  }

  getSessionData(): UnknownObject | undefined {
    return;
  }

  getSessionId(): string | undefined {
    return this.conversation_uuid;
  }

  getUserId(): string | undefined {
    return this.from;
  }

  isNewSession(): boolean | undefined {
    return undefined;
  }

  setIntent(intent: string): void {
    this.nlu = { intentName: intent };
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  setSessionData(): void {
    return;
  }

  setUserId(): void {
    return;
  }

  getRequestId(): string | undefined {
    return this.uuid;
  }
}
