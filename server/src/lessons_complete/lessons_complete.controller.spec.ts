import { Test, TestingModule } from '@nestjs/testing';
import { LessonsCompleteController } from './lessons_complete.controller';
import { LessonsCompleteService } from './lessons_complete.service';

describe('LessonsCompleteController', () => {
  let controller: LessonsCompleteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonsCompleteController],
      providers: [LessonsCompleteService],
    }).compile();

    controller = module.get<LessonsCompleteController>(LessonsCompleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
