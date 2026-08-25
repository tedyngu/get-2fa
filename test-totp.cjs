const OTPAuth = require('otpauth');
const totpGen = require('totp-generator');

let secret = 'JBSWY3DPEHPK3PXP';
let totp = new OTPAuth.TOTP({
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: OTPAuth.Secret.fromBase32(secret)
});

console.log("OTPAuth:", totp.generate());
console.log("totp-gen: ", totpGen(secret));
