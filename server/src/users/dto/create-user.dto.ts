export class CreateUserDto {
  userId: string;
  userEmail: string;
  userName: string;
  userProfile?: string; // 선택사항이면 ? 붙이기
}
