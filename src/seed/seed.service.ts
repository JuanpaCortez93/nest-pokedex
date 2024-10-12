import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokedexResponse } from './interfaces/pokedex.-responseinterface';

@Injectable()
export class SeedService {
  async executeSeed() {
    const { data } = await axios.get<PokedexResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=151',
    );

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      console.log({ no, name });
    });

    return data.results;
  }
}
