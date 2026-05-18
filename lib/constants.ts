
const constants = {
  saltRounds: 11,
  deletedEmailHash: 'sha-256',
  usernameRegex: /^[a-zA-Z0-9 _-]+$/,
  minUsernameLength: 3,
  maxUsernameLength: 30,
  minPasswordLength: 5,
  maxPasswordLength: 63,
  emailValidateRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  emailMaxLength: 254, // RFC
};

export default constants;
