import { TestBed } from '@angular/core/testing';
import { CredentialsInterceptor } from './credentials.interceptor';

describe('CredentialsInterceptor', () => {
  let interceptor: CredentialsInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [CredentialsInterceptor] });
    interceptor = TestBed.get(CredentialsInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
