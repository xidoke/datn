import { Test, TestingModule } from '@nestjs/testing';
import { FileAssetController } from './file-asset.controller';

describe('FileAssetController', () => {
  let controller: FileAssetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileAssetController],
    }).compile();

    controller = module.get<FileAssetController>(FileAssetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
