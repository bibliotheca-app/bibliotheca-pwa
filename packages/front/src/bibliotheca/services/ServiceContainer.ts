import { BookRepository } from 'shared/lib/es';
import { AuthService } from './AuthService';
import { firebase } from './firebase';
import { InventoryEventRepository } from './InventoryEventRepository';
import { InventoryLogRepository } from './InventoryLogRepository';

class ServiceContainer {
  authService = new AuthService(firebase.auth());
  bookRepository = new BookRepository(firebase.firestore());
  inventoryEventRepository = new InventoryEventRepository(firebase.firestore());
  inventoryLogRepository = new InventoryLogRepository(firebase.firestore());
}

export const container = new ServiceContainer();
export const authService = container.authService;
export const bookRepository = container.bookRepository;
export const inventoryEventRepository = container.inventoryEventRepository;
export const inventoryLogRepository = container.inventoryLogRepository;
