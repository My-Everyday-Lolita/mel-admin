
export interface MelSharedModuleConfig {
  domains: MelSharedModuleConfigDomains;
  api: MelSharedModuleConfig;
  [key: string]: any;
}

export interface MelSharedModuleConfig {
  auth: MelSharedModuleConfigAuth;
}

export interface MelSharedModuleConfigAuth {
  realm: string;
  client_id: string;
  grant_type: string;
  scope: string;
}

export interface MelSharedModuleConfigDomains {
  registration: string;
  login: string;
  mel: string;
}

export enum SignOutBehaviors {
  NOTHING = 'nothing',
  HOME_REDIRECT = 'home_redirect',
}
