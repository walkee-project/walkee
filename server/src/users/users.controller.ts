import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoutesService } from '../routes/routes.service';
import { PostsService } from '../posts/posts.service';
import { PostLikesService } from '../post_likes/post_likes.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    userIdx: number;
    userProvider: string;
    userId: string;
    userEmail: string;
    userName: string;
    userProfile?: string;
    userPoint: number;
  };
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly routesService: RoutesService,
    private readonly postsService: PostsService,
    private readonly postLikesService: PostLikesService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Request() req: RequestWithUser) {
    console.log('req.user:', req.user);

    const user = req.user; // 이미 DB 유저 객체가 들어있음

    if (!user) {
      throw new BadRequestException('유효하지 않은 사용자 정보입니다.');
    }

    return user;
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':userId/summary')
  async getUserSummary(@Param('userId') userId: number) {
    const routeCount = await this.routesService.countByUser(userId);
    const likeCount = await this.postLikesService.countByUser(userId);
    const postCount = await this.postsService.countByUser(userId);
    return { routeCount, likeCount, postCount };
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
