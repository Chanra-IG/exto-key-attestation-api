import { IsNotEmptyString } from '@common';

export class VerifyBody {
  @IsNotEmptyString()
  readonly clientCertificate!: string;

  @IsNotEmptyString()
  readonly signature!: string;

  @IsNotEmptyString()
  readonly data!: string;

  @IsNotEmptyString()
  readonly key!: string;
}
