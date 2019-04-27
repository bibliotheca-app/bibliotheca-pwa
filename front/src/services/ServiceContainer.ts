import { AuthService } from './AuthService';
import { BookRepository } from './BookRepository';
import { firebase } from './firebase';
import { InventoryEventRepository } from './InventoryEventRepository';

class ServiceContainer {
  authService = new AuthService(firebase.auth());
  bookRepository = new BookRepository(firebase.firestore());
  inventoryEventRepository = new InventoryEventRepository(firebase.firestore());
}

export const container = new ServiceContainer();
export const authService = container.authService;
export const bookRepository = container.bookRepository;
export const inventoryEventRepository = container.inventoryEventRepository;
