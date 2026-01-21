import { Table } from '../../../domain/entities/table.entity';
import { TableOrmEntity } from '../orm-entities/table.orm-entity';

export class TableMapper {
  static toDomain(ormEntity: TableOrmEntity): Table {
    const table = new Table();
    table.id = ormEntity.id;
    table.restaurantId = ormEntity.restaurantId;
    table.title = ormEntity.title;
    table.capacity = ormEntity.capacity;
    return table;
  }

  static toOrm(domain: Table): TableOrmEntity {
    const ormEntity = new TableOrmEntity();
    ormEntity.id = domain.id;
    ormEntity.restaurantId = domain.restaurantId;
    ormEntity.title = domain.title;
    ormEntity.capacity = domain.capacity;
    return ormEntity;
  }
}
