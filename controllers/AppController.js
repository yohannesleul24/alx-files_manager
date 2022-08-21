/* eslint-disable */
import RedisClient from '../utils/redis';
import DBClient from '../utils/db';

class AppController {
  static getStatus(req, res) {
    return res.status(200).send({ redis: RedisClient.isAlive(), db: DBClient.isAlive() });
  }

  static async getStats(req, res) {
    const users = await DBClient.nbUsers();
    const files = await DBClient.nbFiles();

    return res.status(200).send({ users, files });
  }
}

export default AppController;
