/* eslint-disable */
import DBClient from '../utils/db';
import RedisClient from '../utils/redis';
import { v4 as uuidv4 } from 'uuid';

const { ObjectId } = require('mongodb');
const fs = require('fs');

class FilesController {
    static async postUpload(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });

        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });

        const { name, type, parentId, isPublic, data } = req.body;

        const fileData = req.body;

        if (!name) return res.status(400).send({ error: 'Missing name'});

        const fileType = ['folder', 'file', 'image'];

        if (!type || !fileType.includes(type)){
            return res.status(400).send({ error: 'Missing type'});
        }

        if (!data && type === 'folder') {
            return res.status(400).send({ error: 'Missing data'});
        }

        if (parentId) {
            const parentFolder = await DBClient.database.collection('files').findOne({ _id: ObjectId(prentId)});
            if (!parentFolder) return res.status(400).send({ error: 'Parent is not a folder' });
            if (parentFolder.type !== 'folder') {
                return res.status(400).send({ error: 'Parent is not a folder'});
            }
        }

        fileData.userId = user._id;

        if (type === 'folder') {
            const dataAdded = DBClient.database.collection('files').insertOne({ ...fileData });
            return res.status(201).send({
                id: dataAdded._id,
                userId: dataAdded.userId,
                name: dataAdded.name,
                type: dataAdded.type,
                isPublic: dataAdded.isPublic,
                parentId: dataAdded.parentId,
              });
        } else {
            const path = process.env.FOLDER_PATH || '/tmp/files_manager';
            const fileNewId = uuidv4();

            const buff = Buffer.from(fileData, 'base64');
            const pathFile = `${path}/${fileNewId}`;

            await fs.mkdir(pathDir, { recursive: true }, (error) => {
                if (error) return res.status(400).send({ error: error.message });
                return true;
            });

            await fs.writeFile(pathFile, buff, (error) => {
                if (error) return res.status(400).send({ error: error.message });
                return true;
            });

            fileData.localPath = pathFile;
            const createdData = await DBClient.database.collection('files').insertOne({ ...fileData });

            return res.status(201).send({
                id: createdData._id,
                userId: createdData.userId,
                name: createdData.name,
                type: createdData.type,
                isPublic: createdData.isPublic,
                parentId: createdData.parentId,
            });
        }
    }

    static async getShow(req, res) {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });

        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });
    
        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
    
        const FileId = req.params.id || '';
    
        const Document = await DBClient.database.collection('files').findOne({ _id: ObjectId(FileId), userId: user._id });
        if (!Document) return res.status(404).send({ error: 'Not found' });
    
        return res.send({
          id: Document._id,
          userId: Document.userId,
          name: Document.name,
          type: Document.type,
          isPublic: Document.isPublic,
          parentId: Document.parentId,
        });

    }

    static async getIndex() {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });

        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
    }

    static async putPublish() {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });

        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
    }

    static async putUnpublish() {
        const token = req.header('X-Token') || null;
        if (!token) return res.status(401).send({ error: 'Unauthorized' });

        const redisToken = await RedisClient.get(`auth_${token}`);
        if (!redisToken) return res.status(401).send({ error: 'Unauthorized' });

        const user = await DBClient.database.collection('users').findOne({ _id: ObjectId(redisToken) });
        if (!user) return res.status(401).send({ error: 'Unauthorized' });
    }
}

export default FilesController;
