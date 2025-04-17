import { Container } from 'instances-container';
import { ReqRefDefaults, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { AddUserUseCase } from '@application/use-case/AddUserUseCase';
import { IResponse } from '@common/interface/IResponse';
import { IRegisteredUser, IRegisterUser } from '@common/interface/IUser';

export class UsersHandler {
  constructor(private readonly module: Container) {
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const addUserUseCase = this.module.getInstance(AddUserUseCase.name) as AddUserUseCase;
    const registeredUser = await addUserUseCase.execute(request.payload as IRegisterUser);

    const responsePayload: IResponse<{ addedUser: IRegisteredUser }> = {
      status: 'success',
      data: {
        addedUser: {
          id: registeredUser.getId,
          fullname: registeredUser.getFullname,
          username: registeredUser.getUsername,
        },
      },
    };

    const response = h.response(responsePayload);

    response.code(201);

    return response;
  }
}
