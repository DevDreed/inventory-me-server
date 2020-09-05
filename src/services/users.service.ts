import * as bcrypt from "bcrypt";
import HttpException from "../exceptions/HttpException";
import { User } from "../interfaces/users.interface";
import { isEmptyObject } from "../utils/util";
import { db } from "../db";

class UserService {
  public async findAllUser(): Promise<any> {
    const users = await db.query(
      "SELECT id, first_name, last_name, email, username, created_date, last_login FROM users"
    );
    return users.rows;
  }

  public async findUserById(userId: string): Promise<User> {
    const user = await db.query(
      "SELECT  id, first_name, last_name, email, username, created_date, last_login FROM users WHERE id = $1",
      [userId]
    );
    const findUser: any = user.rows[0];
    if (!findUser) throw new HttpException(409, "You're not user");

    return findUser;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (isEmptyObject(userData))
      throw new HttpException(400, "You're not userData");

    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    const findUser: any = user.rows[0];
    if (!findUser)
      throw new HttpException(409, `User with id ${userId} doesn't exists`);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await db.query(
      `UPDATE users SET first_name = $2, last_name= $3, username= $4, email= $5, password= $6, updated_date = NOW() 
       WHERE id = $1 
       RETURNING id, first_name, last_name, email, username, created_date, last_login`,
      [
        userId,
        userData.first_name,
        userData.last_name,
        userData.username,
        userData.email,
        hashedPassword,
      ]
    );

    return newUser.rows[0];
  }

  public async deleteUser(userId: string): Promise<string> {
    const user = await db.query("SELECT * FROM users WHERE id = $1", [userId]);
    const findUser: any = user.rows[0];
    if (!findUser) throw new HttpException(409, "You're not user");

    const deletedUserData: User[] = await db.query(
      "DELETE FROM users WHERE id = $1",
      [userId]
    );
    return "deleteUserData";
  }
}

export default UserService;
