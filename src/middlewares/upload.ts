import multer, { MulterError } from 'multer';
import fs from 'fs';
import path from 'path';
import { Request } from 'express';

const createDestinationDirectory = (destination: string) => {
    const directory = path.resolve(destination);
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
    console.log(directory, 'directory');
};

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        const destination = './uploads/user';
        createDestinationDirectory(destination);
        cb(null, destination);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now();
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
}).single('profileImage');

export default upload;
