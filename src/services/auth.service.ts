import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { CreateUserDto, LoginUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import { DataStoredInToken, TokenData } from "../interfaces/auth.interface";
import { User } from "../interfaces/users.interface";
import { isEmptyObject } from "../utils/util";
import { db } from "../db";

class AuthService {
  public async register(userData: CreateUserDto): Promise<any> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");
    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      userData.email,
    ]);

    const findUser: User = user.rows[0];
    if (findUser)
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists!`
      );

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    let newUser = await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, username, created_date, last_login",
      [
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.email,
        hashedPassword,
      ]
    );
    const result = newUser.rows[0];
    return result;
  }

  public async login(
    userData: LoginUserDto
  ): Promise<{ cookie: string; findUser: User }> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
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

    const user1 = await db.query(
      "UPDATE users SET last_login = $2 WHERE id = $1 RETURNING id, first_name, last_name, email, username, created_date, last_login",
      [findUser.id, new Date()]
    );

    const findUser1: User = user1.rows[0];
    const tokenData = this.createToken(findUser1);
    const cookie = this.createCookie(tokenData);
    return { cookie, findUser: findUser1 };
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
