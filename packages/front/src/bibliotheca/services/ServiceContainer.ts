import { BookRepository, DeletedBookRepository } from 'shared/lib/es';
import { AuthService } from './AuthService';
import { firebase } from './firebase';
import { InventoryEventRepository } from './InventoryEventRepository';
import { InventoryLogRepository } from './InventoryLogRepository';

class ServiceContainer {
  authService = new AuthService(firebase.auth());
  bookRepository = new BookRepository(firebase.firestore());
  deletedBookRepository = new DeletedBookRepository(firebase.firestore(), this.bookRepository);
  inventoryEventRepository = new InventoryEventRepository(firebase.firestore());
  inventoryLogRepository = new InventoryLogRepository(firebase.firestore());
}

export const container = new ServiceContainer();
export const authService = container.authService;
export const bookRepository = container.bookRepository;
export const inventoryEventRepository = container.inventoryEventRepository;
export const inventoryLogRepository = container.inventoryLogRepository;
export const deletedBookRepository = container.deletedBookRepository;
