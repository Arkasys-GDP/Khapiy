import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { items, tableId, ...orderData } = createOrderDto;

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: items.map((item) => item.productId) },
      },
    });

    if (products.length !== items.length) {
      throw new NotFoundException('One or more products not found');
    }

    const total = items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      return acc + product.price.toNumber() * item.quantity;
    }, 0);

    return this.prisma.order.create({
      data: {
        ...orderData,
        total,
        table: tableId ? { connect: { id: tableId } } : undefined,
        orderItems: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId);
            return {
              quantity: item.quantity,
              unitPrice: product.price,
              aiNotes: item.aiNotes,
              product: {
                connect: { id: item.productId },
              },
            };
          }),
        },
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });
  }

  async findAll(): Promise<Order[]> {
    return this.prisma.order.findMany({
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    await this.findOne(id);
    const { items, tableId, ...orderData } = updateOrderDto;
  
    let total: number | undefined;
    let products: any[] = [];
  
    if (items) {
      products = await this.prisma.product.findMany({
        where: {
          id: { in: items.map((item) => item.productId) },
        },
      });
  
      if (products.length !== items.length) {
        throw new NotFoundException('One or more products not found');
      }
  
      total = items.reduce((acc, item) => {
        const product = products.find((p) => p.id === item.productId);
        return acc + product.price.toNumber() * item.quantity;
      }, 0);
  
      // Delete existing items and create new ones
      await this.prisma.orderItem.deleteMany({
        where: { orderId: id },
      });
    }
  
    return this.prisma.order.update({
      where: { id },
      data: {
        ...orderData,
        total,
        table: tableId ? { connect: { id: tableId } } : undefined,
        orderItems: items
          ? {
              create: items.map((item) => {
                const product = products.find((p) => p.id === item.productId);
                return {
                  quantity: item.quantity,
                  unitPrice: product.price,
                  aiNotes: item.aiNotes,
                  product: {
                    connect: { id: item.productId },
                  },
                };
              }),
            }
          : undefined,
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
        },
        table: true,
      },
    });
  }

  async remove(id: number): Promise<Order> {
    await this.findOne(id);

    await this.prisma.orderItem.deleteMany({
        where: { orderId: id }
    });
    
    return this.prisma.order.delete({
      where: { id },
    });
  }
}

