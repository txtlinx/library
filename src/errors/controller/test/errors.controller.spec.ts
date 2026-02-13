import { Test, TestingModule } from '@nestjs/testing';
import { ErrorsController } from '../errors.controller';
import { ErrorsService } from '../../service/errors.service';
import { PrismaService } from '../../../../prisma/prisma.service';

describe('ErrorsController', () => {
  let controller: ErrorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErrorsController],
      providers: [ErrorsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<ErrorsController>(ErrorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
