import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { TablesModule } from './modules/tables/tables.module';
import { IngredientsModule } from './modules/ingredients/ingredients.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
@Module({
  imports: [CategoriesModule, TablesModule, IngredientsModule, ProductsModule, OrdersModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
