import { WebClient } from '@slack/web-api';

interface SlackUser {
  id: string;
  name: string;
}
type LookupByEmailResponse = { ok: false; error: string } | { ok: true; user: SlackUser };
export class SlackClient {
  private client: WebClient;
  constructor(token: string) {
    this.client = new WebClient(token);
  }

  lookupByEmail(email: string): Promise<LookupByEmailResponse> {
    return this.client.users.lookupByEmail({ email }) as Promise<LookupByEmailResponse>;
  }
}
