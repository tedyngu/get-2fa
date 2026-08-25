const OTPAuth = require('otpauth');

let secret = 'JBSWY3DPEHPK3PXP';
let totp = new OTPAuth.TOTP({
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: OTPAuth.Secret.fromBase32(secret)
});

console.log(totp.generate());
