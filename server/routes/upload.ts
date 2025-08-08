import { Router, Request, Response } from "express";
import multer from "multer";
import { Storage } from "@google-cloud/storage";
import { nanoid } from "nanoid";
import { extname } from "path";

// Extend Request interface to include file
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Extend session to include user
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: string;
      email?: string;
    };
  }
}

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// Initialize Google Cloud Storage
const storage = new Storage();

router.post('/image', upload.single('file'), async (req: MulterRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    if (!req.session?.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
    if (!bucketId) {
      return res.status(500).json({ message: 'Object storage not configured' });
    }

    const bucket = storage.bucket(bucketId);
    
    // Generate unique filename
    const fileExtension = extname(req.file.originalname);
    const fileName = `product-images/${nanoid()}${fileExtension}`;
    
    const file = bucket.file(fileName);
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
      resumable: false,
    });

    stream.on('error', (error: Error) => {
      console.error('Upload stream error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Failed to upload file' });
      }
    });

    stream.on('finish', async () => {
      try {
        // Make the file publicly readable
        await file.makePublic();
        
        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketId}/${fileName}`;
        
        res.json({
          url: publicUrl,
          fileName: fileName,
          size: req.file!.size,
          mimetype: req.file!.mimetype,
        });
      } catch (error) {
        console.error('Error making file public:', error);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to make file public' });
        }
      }
    });

    // Start the upload
    stream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload error:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large. Maximum size is 5MB.' });
      }
    }
    
    res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Upload failed' 
    });
  }
});

export default router;