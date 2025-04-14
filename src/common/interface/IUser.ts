export interface IRegisterUser {
  username: string;
  fullname: string;
  password: string;
}

export interface IRegisteredUser extends Omit<IRegisterUser, 'password'> {
  id: string;
}

export interface IUserLogin extends Omit<IRegisterUser, 'fullname'> {}

export interface IAuth {
  accessToken: string;
  refreshToken: string;
}

export interface ITokenPayload extends Omit<IRegisteredUser, 'fullname'> {}
