import { ReqRefDefaults, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { LogoutUserUseCase } from '@application/use-case/LogoutUseCase';
import { RefreshAuthenticationUseCase } from '@application/use-case/RefreshAuthenticationUseCase';
import { LoginUserUseCase } from '@application/use-case/LoginUserUseCase';

export class AuthenticationsHandler {
  constructor(private readonly module: Container) {
    this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
    this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
    this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
  }

  async postAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const loginUserUseCase = this.module.getInstance(LoginUserUseCase.name);
    const { accessToken, refreshToken } = await loginUserUseCase.execute(request.payload);
    const response = h.response({
      status: 'success',
      data: {
        accessToken,
        refreshToken,
      },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const refreshAuthenticationUseCase = this.module.getInstance(RefreshAuthenticationUseCase.name);
    const accessToken = await refreshAuthenticationUseCase.execute(request.payload);

    return h.response({
      status: 'success',
      data: {
        accessToken,
      },
    });
  }

  async deleteAuthenticationHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const logoutUserUseCase = this.module.getInstance(LogoutUserUseCase.name);
    await logoutUserUseCase.execute(request.payload);
    return h.response({
      status: 'success',
    });
  }
}
