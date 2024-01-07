import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { MovieEntity } from './entites/movie.entity';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService } from '../email/email.service';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(MovieEntity)
    private readonly movieRepo: Repository<MovieEntity>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async registerMovies() {
    const { data, status } = await this.httpService
      .get(this.configService.get('TMDB_URL'), {
        headers: {
          Authorization: this.configService.get('TMDB_KEY'),
        },
      })
      .toPromise();
    if (status === 200) {
      const datas = data.results;
      const movieData = [];
      datas?.map((data) =>
        movieData.push({
          language: data['original_language'],
          title: data['title'],
          overview: data['overview'],
          popularity: data['popularity'],
          poster: data['poster_path'],
          release: data['release_date'],
        }),
      );
      await this.cacheManager.del('movies');
      return await this.movieRepo.save(movieData);
    }
  }

  async getAllMovies() {
    const redisData = await this.cacheManager.get('movies');
    if (redisData) {
      return redisData;
    }
    const movies = await this.movieRepo.find();
    await this.cacheManager.set('movies', movies);
    return movies;
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  // async handleCron() {
  //   await this.emailService.sendMail({
  //     to: 'wltn203@naver.com',
  //     subject: '스케줄링 인증',
  //     text: '스케줄링 인증',
  //   });
  // }
}
