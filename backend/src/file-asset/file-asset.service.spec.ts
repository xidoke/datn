import { Test, TestingModule } from '@nestjs/testing';
import { FileAssetService } from './file-asset.service';

describe('FileAssetService', () => {
  let service: FileAssetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileAssetService],
    }).compile();

    service = module.get<FileAssetService>(FileAssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
