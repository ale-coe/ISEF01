import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuestionsService } from './services/questions.service';
import { GetQuestionsDto } from './dto/get-questions.dto';
import { InsertQuestionDto, UpdateQuestionDto } from './dto/question.dto';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Get()
  getQuestions(@Query() query: GetQuestionsDto) {
    return this.questionsService.getQuestions(query);
  }

  @Post()
  insertQuestion(@Body() question: InsertQuestionDto) {
    return this.questionsService.insertQuestion(question);
  }

  @Put(':id/edit')
  putInEditMode(@Param('id') id: number) {
    return this.questionsService.putInEditMode(id);
  }

  @Put(':id/update')
  updateQuestion(@Body() question: UpdateQuestionDto) {
    return this.questionsService.updateQuestion(question);
  }

  @Delete(':id')
  deleteQuestion(@Param('id') id: number) {
    return this.questionsService.deleteQuestion(id);
  }
}
