import { ResultPipe } from './result.pipe';

describe('ResultPipe', () => {
  let pipe: ResultPipe;

  beforeEach(() => {
    pipe = new ResultPipe();
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });
});
