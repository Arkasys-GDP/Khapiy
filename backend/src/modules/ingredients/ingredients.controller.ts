import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { IngredientsService } from './ingredients.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Ingredient } from './entities/ingredient.entity';

@ApiTags('ingredients')
@Controller('ingredients')
export class IngredientsController {
  constructor(private readonly ingredientsService: IngredientsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ingredient' })
  @ApiResponse({ status: 201, description: 'The ingredient has been successfully created.', type: Ingredient })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createIngredientDto: CreateIngredientDto) {
    return this.ingredientsService.create(createIngredientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all ingredients' })
  @ApiResponse({ status: 200, description: 'Return all ingredients.', type: [Ingredient] })
  findAll() {
    return this.ingredientsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an ingredient by id' })
  @ApiResponse({ status: 200, description: 'Return the ingredient.', type: Ingredient })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an ingredient' })
  @ApiResponse({ status: 200, description: 'The ingredient has been successfully updated.', type: Ingredient })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateIngredientDto: UpdateIngredientDto) {
    return this.ingredientsService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an ingredient' })
  @ApiResponse({ status: 200, description: 'The ingredient has been successfully deleted.', type: Ingredient })
  @ApiResponse({ status: 404, description: 'Ingredient not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ingredientsService.remove(id);
  }
}

