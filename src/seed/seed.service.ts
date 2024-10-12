import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokedexResponse } from './interfaces/pokedex.-responseinterface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly httpAdapter: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.httpAdapter.get<PokedexResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    );

    const pokemonToInsert = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      pokemonToInsert.push({ name, no });
    });

    this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }
}
