import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async findAll() {
    return await this.pokemonModel.find();
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
      if (!pokemon)
        throw new NotFoundException(`Pokemon with id ${term} not found`);
      return pokemon;
    }

    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
      return pokemon;
    }

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
      return pokemon;
    }

    throw new BadRequestException('Invalid search term');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase().trim();
    }

    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });

      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const pokemon = await this.pokemonModel.deleteOne({ _id: id });
    if (pokemon.deletedCount !== 0) {
      return pokemon;
    }

    throw new NotFoundException(`Pokemon with id ${id} does not exist`);
  }

  private handleExceptions(error: any) {
    if (error.errorResponse.code === 11000) {
      throw new BadRequestException(
        `Pokemon number already exists in DB: ${JSON.stringify(error.errorResponse.keyValue)}`,
      );
    } else {
      throw new InternalServerErrorException(
        `An error ocurred: ${error.errorResponse}`,
      );
    }
  }
}
