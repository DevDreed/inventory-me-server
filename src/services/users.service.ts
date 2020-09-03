import * as bcrypt from "bcrypt";
import { CreateUserDto } from "../dtos/users.dto";
import HttpException from "../exceptions/HttpException";
import { User } from "../interfaces/users.interface";
import { isEmptyObject } from "../utils/util";
import { pool as db } from "../db";

class UserService {
  public async findAllUser(): Promise<any> {
    const users = await db.query("SELECT * FROM users");
    console.dir(users);
    return users;
    // const allUsers: User[] = users;
    // return allUsers;
  }

  public async findUserById(userId: number): Promise<User> {
    const user = await db.query("SELECT * FROM users WHERE uuid = $1", [
      userId,
    ]);
    const findUser: any = user.rows[0];
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async createUser(userData: CreateUserDto): Promise<User> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const user = await db.query("SELECT * FROM users WHERE email = $1", [
      userData.email,
    ]);
    const findUser: any = user.rows[0];
    if (findUser)
      throw new HttpException(
        409,
        `You're email ${userData.email} already exists`
      );

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await db.query(
      "INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.email,
        hashedPassword,
      ]
    );

    return newUser.rows[0];
  }

  // public async updateUser(userId: number, userData: User): Promise<User[]> {
  //   if (isEmptyObject(userData))
  //     throw new HttpException(400, "You're not userData");

  //   const user = await db.query("SELECT * FROM users WHERE email = $1", [
  //     userData.email,
  //   ]);
  //   const findUser: any = user.rows[0];
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   const hashedPassword = await bcrypt.hash(userData.password, 10);
  //   const updateUserData: User[] = this.users.map((user: User) => {
  //     if (user.id === findUser.id)
  //       user = { id: userId, ...userData, password: hashedPassword };
  //     return user;
  //   });

  //   return updateUserData;
  // }

  // public async deleteUser(userId: number): Promise<User[]> {
  //   const user = await db.query("SELECT * FROM users WHERE email = $1", [
  //     userData.email,
  //   ]);
  //   const findUser: any = user.rows[0];
  //   if (!findUser) throw new HttpException(409, "You're not user");

  //   const deleteUserData: User[] = this.users.filter(user => user.id !== findUser.id);
  //   return deleteUserData;
  // }
}

export default UserService;
