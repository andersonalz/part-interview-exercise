import { Body, Controller, Get, Patch, Request } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from '../users/dto/update-user.dto';

@ApiTags('Current User')
@ApiBearerAuth()
@Controller('current_user')
export class CurrentUserController {
  constructor(private readonly usersService: UsersService) { }

  /*
   * TODO: Return current user
   */

  @Get()
  show(@Request() req) {
    return this.usersService.findOneByUsername(req.user.username);
  }

  /*
   * TODO: Update current user
   */

  @Patch()
  update(@Body() userUpdate: UpdateUserDto, @Request() req) {
    return this.usersService.update(req.user.sub, userUpdate);
  }
}
