import { AuthService } from './AuthService';
import { BookRepository } from './BookRepository';
import { firebase } from './firebase';
import { InventoryBookRepository } from './InventoryBookRepository';
import { InventoryEventRepository } from './InventoryEventRepository';

class ServiceContainer {
  authService = new AuthService(firebase.auth());
  bookRepository = new BookRepository(firebase.firestore());
  inventoryEventRepository = new InventoryEventRepository(firebase.firestore());
  inventoryBookRepository = new InventoryBookRepository(
    firebase.firestore(),
    this.inventoryEventRepository,
  );
}

export const container = new ServiceContainer();
export const authService = container.authService;
export const bookRepository = container.bookRepository;
export const inventoryEventRepository = container.inventoryEventRepository;
export const inventoryBookRepository = container.inventoryBookRepository;
