import { BadRequestException, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as forge from 'node-forge';

import { C } from '@common';

import { VerifyBody } from './auth.dto';

@Injectable()
export class AuthService {
  async verify({ signature, data, clientCertificate, key }: VerifyBody) {
    // const cert = await this.verifyCertificate(clientCertificate);
    // const publicKey = forge.pki.publicKeyToPem(cert.publicKey);
    await this.verifyCertificate(clientCertificate);
    const publicKey = this.base64ToPem(key, 'PUBLIC KEY');
    console.log({ publicKey });
    const signedData = await this.verifySignedData(data, signature, publicKey);

    return { certificate: true, signedData };
  }

  /**
   * =======================
   *    PRIVATE FUNCTION
   * =======================
   */
  private async verifyCertificate(cert: string) {
    const ca = forge.pki.certificateFromPem(C.ROOT_GOOGLE_CA);
    const caStore = forge.pki.createCaStore([ca]);

    try {
      // const derKey = forge.util.decode64(cert);
      const pemKey = this.base64ToPem(cert, 'CERTIFICATE');
      console.log({ pemKey });
      const certificate = forge.pki.certificateFromPem(pemKey);
      const isValid = forge.pki.verifyCertificateChain(caStore, [certificate]);
      if (!isValid) throw new BadRequestException('Certificate is invalid');

      return certificate;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  private async verifySignedData(data: string, signature: string, publicKey: string) {
    await this.isValidPublicKey(publicKey);
    const verifier = crypto.createVerify('sha256');
    verifier.update(data, 'base64');
    return verifier.verify(publicKey, signature, 'base64');
  }

  // Function to convert Base64 to PEM
  private base64ToPem(base64Data: string, type: 'CERTIFICATE' | 'PUBLIC KEY') {
    const base64Content: string = base64Data.replace(/[^A-Za-z0-9+/]/g, '');
    const chunks: string[] = [];

    for (let i = 0; i < base64Content.length; i += 64) {
      chunks.push(base64Content.slice(i, i + 64));
    }

    const pem = `-----BEGIN ${type}-----\n${chunks.join('\n')}\n-----END ${type}-----\n`;

    return pem;
  }

  private async isValidPublicKey(publicKey: string) {
    try {
      crypto.createPublicKey(publicKey);
      return true; // No errors means the public key is valid
    } catch (error: any) {
      console.error('Invalid public key:', error?.message);
      throw new BadRequestException('Invalid public key'); // Error indicates an invalid public key
    }
  }
}
