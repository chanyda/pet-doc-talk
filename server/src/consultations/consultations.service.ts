import { Injectable } from "@nestjs/common";
import { ConsultationsRepository } from "./consultations.repository";
import { CreateConsultationDto } from "./dtos/requests/create-consultation.dto";
import { ConsultationDto } from "./dtos/responses/consultation.dto";
import { PetsService } from "src/pets/pets.service";

@Injectable()
export class ConsultationsService {
    constructor(
        private readonly consultationsRepository: ConsultationsRepository,
        private readonly petsService: PetsService,
    ) {}

    async create(userId: number, createConsultationDto: CreateConsultationDto): Promise<ConsultationDto> {
        // findById 함수에서 사용자의 펫이 아닌 경우, 오류를 뱉으므로 해당 레벨에서는 별도로 오류 처리를 하지 않음
        const pet = await this.petsService.findById(createConsultationDto.petId, userId);
        console.log(pet);

        return this.consultationsRepository.create(userId, createConsultationDto);

        // TODO: 채팅방 생성하면 처음 인사 메세지를 생성해준다.
        // (인사 메세지 예: 안녕하세요 AI 수의사입니다. ㅇㅇ이에 대해 궁금한 게 있으시면 물어보세요!)
        // 따라서 petExists 함수가 아닌 findById로 펫 정보를 가져옴
    }
}
