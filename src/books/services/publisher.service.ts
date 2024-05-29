import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Publisher} from "../entities/publisher.entity";


@Injectable()
export class PublisherService{
    constructor(
        @InjectRepository(Publisher)
        private publisherRepository: Repository<Publisher>
    ) {}
    async upsertPublisher(name: string): Promise<Publisher> {
        const result = await this.publisherRepository.upsert({ name }, ['name']);
        return result.generatedMaps[0] as Publisher;
    }
}
