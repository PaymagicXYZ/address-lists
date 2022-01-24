type ExtensionValue = string | number | boolean | null;

export interface AddressInfo {
  readonly address: string;
  readonly chainId: number;
  readonly name: string;
  readonly logoURI?: string;
  readonly tags?: string[];
  readonly extensions?: {
    readonly [key: string]: { [key: string]: ExtensionValue } | ExtensionValue;
  };
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface Tags {
  readonly [tagId: string]: {
    readonly name: string;
    readonly description: string;
  };
}

export interface AddressList {
  readonly name: string;
  readonly description: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly addresses: TokenInfo[];
  readonly keywords?: string[];
  readonly tags?: Tags;
  readonly logoURI?: string;
}
