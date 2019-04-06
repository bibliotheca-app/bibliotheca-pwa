import { AuthService } from './AuthService';
import { BookRepository } from './BookRepository';
import { firebase } from './firebase';

class ServiceContainer {
  public authService = new AuthService(firebase.auth());
  public bookRepository = new BookRepository(firebase.firestore());
}

export const container = new ServiceContainer();
export const authService = container.authService;
export const bookRepository = container.bookRepository;
