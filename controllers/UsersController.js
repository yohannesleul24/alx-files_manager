/* eslint-disable */
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';

class UsersController {
    static async postNew(req, res) {
        const { email, password } = req.body;
    
        if (!email) return res.status(400).send({ error: 'Missing email' });

        if (!password) return res.status(400).send({ error: 'Missing password'});

        const ExistingEmail = DBClient.database.collection('users').findOne({ email: email });
        if (ExistingEmail) return res.status(400).send({ error: 'Already exist'});

        const securedPassword = sha1(password);

        const userCreated = await DBClient.database.collection('users').insertOne({ email: email, password: securedPassword });
        return res.status(201).send({ id: userCreated.insertedId, email: email });
    }

    static async getMe(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });
    
        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });
    
        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
        delete user.password;
    
        return res.status(200).send({ id: user._id, email: user.email })
    }
}

export default UsersController ;
