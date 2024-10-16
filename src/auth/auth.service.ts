import { Injectable, UnauthorizedException } from '@nestjs/common';
import { compareSync, hashSync } from 'bcrypt';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
    ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && compareSync(password, user.encryptedPassword)) {
      return user;
    }

    return null;
  }

  signUp({ username, password }: AuthDto) {
    const encryptedPassword = hashSync(password, SALT_ROUNDS);

    return this.usersService.create({ username, encryptedPassword });
  }

  async signIn(user: any) {

    const payload = { username: user.username, password: user.password };
    const verifiedUser = await this.validateUser(payload.username, payload.password );
    if(!verifiedUser) {
      throw new UnauthorizedException('user not found');
    }
    delete verifiedUser.encryptedPassword; // if not handle in find in db
    return {
      ...verifiedUser,
      access_token: this.jwtService.sign({ username : verifiedUser.username, sub: verifiedUser.id}),
    };
  }
}
