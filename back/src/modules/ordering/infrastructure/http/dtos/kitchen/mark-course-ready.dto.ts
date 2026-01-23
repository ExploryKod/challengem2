import { IsIn, IsNotEmpty } from 'class-validator';

export class MarkCourseReadyDto {
  @IsNotEmpty()
  @IsIn(['entry', 'mainCourse', 'dessert', 'drink'])
  course: 'entry' | 'mainCourse' | 'dessert' | 'drink';
}
