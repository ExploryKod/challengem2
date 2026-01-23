import { Menu } from '../../../domain/entities/menu.entity';
import { MenuItem } from '../../../domain/entities/menu-item.entity';
import { MenuOrmEntity } from '../orm-entities/menu.orm-entity';
import { MenuItemOrmEntity } from '../orm-entities/menu-item.orm-entity';

export class MenuMapper {
  static toDomain(orm: MenuOrmEntity): Menu {
    const menu = new Menu();
    menu.id = orm.id;
    menu.restaurantId = orm.restaurantId;
    menu.title = orm.title;
    menu.description = orm.description;
    menu.price = Number(orm.price);
    menu.imageUrl = orm.imageUrl;
    menu.isActive = orm.isActive;
    menu.createdAt = orm.createdAt;
    menu.updatedAt = orm.updatedAt;
    menu.items = orm.items?.map(MenuMapper.itemToDomain) ?? [];
    return menu;
  }

  static itemToDomain(orm: MenuItemOrmEntity): MenuItem {
    const item = new MenuItem();
    item.id = orm.id;
    item.menuId = orm.menuId;
    item.mealType = orm.mealType;
    item.quantity = orm.quantity;
    return item;
  }

  static toOrm(domain: Menu): MenuOrmEntity {
    const orm = new MenuOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.restaurantId = domain.restaurantId;
    orm.title = domain.title;
    orm.description = domain.description;
    orm.price = domain.price;
    orm.imageUrl = domain.imageUrl;
    orm.isActive = domain.isActive ?? true;
    orm.items = domain.items?.map(MenuMapper.itemToOrm) ?? [];
    return orm;
  }

  static itemToOrm(domain: MenuItem): MenuItemOrmEntity {
    const orm = new MenuItemOrmEntity();
    if (domain.id) {
      orm.id = domain.id;
    }
    orm.menuId = domain.menuId;
    orm.mealType = domain.mealType;
    orm.quantity = domain.quantity;
    return orm;
  }
}
