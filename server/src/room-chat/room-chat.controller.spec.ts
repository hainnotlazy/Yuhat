import { Test, TestingModule } from '@nestjs/testing';
import { RoomChatController } from './room-chat.controller';

describe('RoomChatController', () => {
  let controller: RoomChatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoomChatController],
    }).compile();

    controller = module.get<RoomChatController>(RoomChatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
