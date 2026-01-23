import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { IMenuRepository } from '../../../application/ports/menu.repository.port';
import { Menu } from '../../../domain/entities/menu.entity';
import { MenuOrmEntity } from '../orm-entities/menu.orm-entity';
import { MenuMapper } from '../mappers/menu.mapper';

@Injectable()
export class MenuRepository implements IMenuRepository {
  constructor(
    @InjectRepository(MenuOrmEntity)
    private readonly repository: Repository<MenuOrmEntity>,
  ) {}

  async save(menu: Menu): Promise<Menu> {
    const orm = MenuMapper.toOrm(menu);
    const saved = await this.repository.save(orm);
    return this.findById(saved.id) as Promise<Menu>;
  }

  async findAll(): Promise<Menu[]> {
    const entities = await this.repository.find({
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async findById(id: number): Promise<Menu | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['items'],
    });
    return entity ? MenuMapper.toDomain(entity) : null;
  }

  async findByRestaurantId(restaurantId: number): Promise<Menu[]> {
    const entities = await this.repository.find({
      where: { restaurantId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async findActiveByRestaurantId(restaurantId: number): Promise<Menu[]> {
    const entities = await this.repository.find({
      where: { restaurantId, isActive: true },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
    return entities.map(MenuMapper.toDomain);
  }

  async update(id: number, data: Partial<Menu>): Promise<Menu | null> {
    const existing = await this.repository.findOne({ where: { id } });
    if (!existing) return null;

    await this.repository.update(id, {
      ...(data.title && { title: data.title }),
      ...(data.description && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.imageUrl && { imageUrl: data.imageUrl }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    });

    return this.findById(id);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
