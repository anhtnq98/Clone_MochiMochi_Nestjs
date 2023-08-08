import { Test, TestingModule } from '@nestjs/testing';
import { LessonsCompleteService } from './lessons_complete.service';

describe('LessonsCompleteService', () => {
  let service: LessonsCompleteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonsCompleteService],
    }).compile();

    service = module.get<LessonsCompleteService>(LessonsCompleteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
