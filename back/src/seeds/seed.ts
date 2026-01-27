import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { SeedModule } from './seed.module';
import { SeedService } from './seed.service';

@Module({
  imports: [AppModule, SeedModule],
})
class SeedAppModule {}

async function bootstrap() {
  process.env.DATABASE_SYNCHRONIZE = 'true';
  const app = await NestFactory.createApplicationContext(SeedAppModule);
  const seedService = app.get(SeedService);
  await seedService.seed();
  await app.close();
}

void bootstrap();
