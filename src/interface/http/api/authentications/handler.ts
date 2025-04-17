import { ReqRefDefaults, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { LogoutUserUseCase } from '@application/use-case/LogoutUseCase';
import { RefreshAuthenticationUseCase } from '@application/use-case/RefreshAuthenticationUseCase';
import { LoginUserUseCase } from '@application/use-case/LoginUserUseCase';
import { IAuth, IUserLogin } from '@common/interface/IUser';
import { IBaseResponse, IResponse } from '@common/interface/IResponse';

export class AuthenticationsHandler {
  constructor(private readonly module: Container) {
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const loginUserUseCase = this.module.getInstance(LoginUserUseCase.name) as LoginUserUseCase;
    const userLogin = await loginUserUseCase.execute(request.payload as IUserLogin);

    const responsePayload: IResponse<IAuth> = {
      status: 'success',
      data: {
        accessToken: userLogin.getAccessToken,
        refreshToken: userLogin.getRefreshToken,
      },
    };
    const response = h.response(responsePayload);
    response.code(201);

    return response;
  }

  async putAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const refreshAuthenticationUseCase = this.module.getInstance(RefreshAuthenticationUseCase.name) as RefreshAuthenticationUseCase;
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload as Pick<IAuth, 'refreshToken'>);

    const responsePayload: IResponse<{ accessToken: string }> = {
      status: 'success',
      data: { accessToken },
    };

    return h.response(responsePayload);
  }

  async deleteAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const logoutUserUseCase = this.module.getInstance(LogoutUserUseCase.name) as LogoutUserUseCase;
    await logoutUserUseCase.execute(request.payload as Pick<IAuth, 'refreshToken'>);

    const responsePayload: IBaseResponse = {
      status: 'success',
    };

    return h.response(responsePayload);
  }
}
