import { Button } from 'grommet';
import { useActions } from 'typeless';
import { InventoryEventActions } from '../interface';

export const InventorySubmitButton = ({ canEndInventory }: { canEndInventory: boolean }) => {
  const { submitInventory } = useActions(InventoryEventActions);

  return <Button label="棚卸しを完了する" onClick={submitInventory} disabled={!canEndInventory} />;
};
