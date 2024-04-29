import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly db: PrismaService) {}

  create(createCarDto: CreateCarDto) {
    return this.db.cars.create({
      data: {
        license_plate_number: createCarDto.license_plate_number,
        brand: createCarDto.brand,
        model: createCarDto.model,
        daily_cost: createCarDto.daily_cost,
      }
    });
  }

  findAll() {
    return this.db.cars.findMany();
  }

  async findOne(id: number) {
    const car = await this.db.rentals.findMany({
      where: {
        car_id: id
      }
    });
    const today = new Date(Date.now());
    let available = true;

    if (car.length === 0){
      throw new NotFoundException("There is no car with this id!");
    }
    for(let i = 0; i < car.length; i++){
      if (car[i].end_date > today){
        available = false;
      }
    }
    if (available){
      const rent = await this.db.rentals.create({
        data: {
          car_id: id,
          start_date: today,
          end_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
        }
      });
      return rent
    } else {
      throw new ConflictException("This car is already being rented!");
    }
  }

  update(id: number, updateCarDto: UpdateCarDto) {
    return `This action updates a #${id} car`;
  }

  remove(id: number) {
    return `This action removes a #${id} car`;
  }
}
