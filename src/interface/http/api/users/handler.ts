import { ReqRefDefaults, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { Container } from 'instances-container';

import { AddUserUseCase } from '@application/use-case/AddUserUseCase';

export class UsersHandler {
  constructor(private readonly module: Container) {
    this.postUserHandler = this.postUserHandler.bind(this);
  }

  async postUserHandler(request: Request<ReqRefDefaults>, h: ResponseToolkit<ReqRefDefaults>): Promise<ResponseObject> {
    const addUserUseCase = this.module.getInstance(AddUserUseCase.name);
    const addedUser = await addUserUseCase.execute(request.payload);

    const response = h.response({
      status: 'success',
      data: {
        addedUser,
      },
    });

    response.code(201);

    return response;
  }
}
