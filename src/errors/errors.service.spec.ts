import { Test, TestingModule } from '@nestjs/testing';
import { ErrorsService } from './service/errors.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('ErrorsService', () => {
  let service: ErrorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ErrorsService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<ErrorsService>(ErrorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
