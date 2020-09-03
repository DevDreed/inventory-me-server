import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { CreateUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { User } from "../interfaces/users.interface";
import { isEmptyObject } from "../utils/util";
import { pool as db } from "../db";
import { dir } from "console";

class AuthService {
  public async register(userData: CreateUserDto): Promise<any> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");
    dir("getting here");
    db.connect((err: { stack: any; }, client: { query: (arg0: string, arg1: (err: any, result: any) => void) => void; }, release: () => void) => {
      if (err) {
        return console.error("Error acquiring client", err.stack);
      }
      client.query("SELECT NOW()", (err: { stack: any; }, result: { rows: any; }) => {
        release();
        if (err) {
          return console.error("Error executing query", err.stack);
        }
        console.log(result.rows);
      });
    });
    const users = await db.query("SELECT NOW()");
    dir(users);
    return users;
  }

  public async login(
    userData: CreateUserDto
  ): Promise<{ cookie: string; findUser: User }> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const user = await db.query("SELECT * FROM users WHERE user_email = $1", [
      userData.email,
    ]);
    const findUser: User = user.rows[0];
    if (!findUser)
      throw new HttpException(409, `You're email ${userData.email} not found`);

    const isPasswordMatching: boolean = await bcrypt.compare(
      userData.password,
      findUser.password
    );
    if (!isPasswordMatching)
      throw new HttpException(409, "You're password not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);
    delete findUser.password;
    return { cookie, findUser };
  }

  public async logout(userData: User): Promise<User> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      userData.email,
    ]);
    const findUser: any = user.rows[0];
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public createToken(user: User): TokenData {
    const dataStoredInToken: DataStoredInToken = { id: user.id };
    const secret: string = process.env.JWT_SECRET;
    const expiresIn: number = 60 * 60;

    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
  }
}

export default AuthService;
