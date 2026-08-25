const OTPAuth = require('otpauth');
let totp = new OTPAuth.TOTP({
  secret: 'JBSWY3DPEHPK3PXP'
});
console.log(totp.generate({ timestamp: Date.now() + 60000 }));
