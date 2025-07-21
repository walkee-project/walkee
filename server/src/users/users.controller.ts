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
  UploadedFile,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RoutesService } from '../routes/routes.service';
import { PostsService } from '../posts/posts.service';
import { FollowsService } from '../follows/follows.service';
import { RouteLikesService } from '../route_likes/route_likes.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

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
    private readonly followsService: FollowsService,
    private readonly routeLikesService: RouteLikesService,
  ) {}

  @Post(':id/profile-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/profile-images',
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `${req.params.id}_${Date.now()}${ext}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new Error('이미지 파일만 업로드 가능합니다.'), false);
        }
        cb(null, true);
      },
    }),
  )
  uploadProfileImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('파일이 업로드되지 않았습니다.');
    }
    const url = `api/public/profile-images/${file.filename}`;
    // DB 업데이트까지 하려면 아래 주석 해제
    // await this.usersService.update(+id, { userProfile: url });
    return { url };
  }

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

  @Get('community-posts')
  async getCommunityPosts(@Query('userIdx') userIdx?: string) {
    return this.usersService.getCommunityPosts(userIdx ? Number(userIdx) : undefined);
  }
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Get(':userId/summary')
  async getUserSummary(@Param('userId') userId: number) {
    const userRoute = await this.routesService.findByUser(userId);
    const userRouteLikeRaw = await this.routeLikesService.findByUser(userId);
    const userFollows = await this.followsService.findByUser(userId);
    userRouteLikeRaw.sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    const routeIds = userRouteLikeRaw.map((like) => like.routeIdx);
    const routes = await this.routesService.findRoutesByIds(routeIds);
    const routeMap = new Map(routes.map((r) => [r.routeIdx, r]));
    const userRouteLike = routeIds
      .map((id) => routeMap.get(id))
      .filter(Boolean);

    const userPost = await this.postsService.findByUser(userId);
    return {
      userRoute,
      userRouteLikeRaw,
      userRouteLike,
      userPost,
      userFollows,
    };
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
