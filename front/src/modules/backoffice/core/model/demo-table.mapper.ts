import { BackofficeDomainModel } from '@taotask/modules/backoffice/core/model/backoffice.domain-model';
import { DemoTable } from '@taotask/modules/shared/demo/demo-tables.store';

export const mapDemoToBackofficeTable = (table: DemoTable): BackofficeDomainModel.Table => ({
  id: table.id,
  restaurantId: table.restaurantId,
  title: table.title,
  capacity: table.capacity,
});
