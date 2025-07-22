import { Request, Response, NextFunction } from 'express';
import { Model, Document, FilterQuery } from 'mongoose';
import { ErrorResponse } from '../middleware/error';
import { successResponse, paginateResponse } from '../utils/response';

export class BaseController<T extends Document> {
  constructor(private model: Model<T>) {}

  // Create a new document
  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = await this.model.create(req.body);
      successResponse(res, doc, 'Resource created successfully', 201);
    } catch (error) {
      next(error);
    }
  };

  // Get all documents with pagination
  getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const sort = (req.query.sort as string) || '-createdAt';
      const select = (req.query.select as string)?.split(',').join(' ');

      const query: FilterQuery<T> = {};

      // Add filters from query parameters
      Object.keys(req.query).forEach(key => {
        if (!['page', 'limit', 'sort', 'select'].includes(key)) {
          query[key] = req.query[key];
        }
      });

      const total = await this.model.countDocuments(query);
      const docs = await this.model
        .find(query)
        .select(select)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit);

      paginateResponse(res, docs, page, limit, total);
    } catch (error) {
      next(error);
    }
  };

  // Get single document by ID
  getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = await this.model.findById(req.params.id);

      if (!doc) {
        throw new ErrorResponse('Resource not found', 404);
      }

      successResponse(res, doc);
    } catch (error) {
      next(error);
    }
  };

  // Update document
  update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = await this.model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!doc) {
        throw new ErrorResponse('Resource not found', 404);
      }

      successResponse(res, doc, 'Resource updated successfully');
    } catch (error) {
      next(error);
    }
  };

  // Delete document
  delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const doc = await this.model.findByIdAndDelete(req.params.id);

      if (!doc) {
        throw new ErrorResponse('Resource not found', 404);
      }

      successResponse(res, null, 'Resource deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  // Get documents by field
  getByField = async (
    field: keyof T,
    value: any,
    options: {
      select?: string;
      sort?: string;
      populate?: string | string[];
    } = {}
  ): Promise<T[]> => {
    try {
      let query = this.model.find({ [field]: value });

      if (options.select) {
        query = query.select(options.select);
      }

      if (options.sort) {
        query = query.sort(options.sort);
      }

      if (options.populate) {
        if (Array.isArray(options.populate)) {
          options.populate.forEach(path => {
            query = query.populate(path);
          });
        } else {
          query = query.populate(options.populate);
        }
      }

      return await query.exec();
    } catch (error) {
      throw error;
    }
  };

  // Check if document exists
  exists = async (field: keyof T, value: any): Promise<boolean> => {
    try {
      const count = await this.model.countDocuments({ [field]: value });
      return count > 0;
    } catch (error) {
      throw error;
    }
  };

  // Bulk create documents
  bulkCreate = async (docs: Partial<T>[]): Promise<T[]> => {
    try {
      return await this.model.insertMany(docs);
    } catch (error) {
      throw error;
    }
  };

  // Bulk update documents
  bulkUpdate = async (filter: FilterQuery<T>, update: Partial<T>): Promise<number> => {
    try {
      const result = await this.model.updateMany(filter, update, { new: true });
      return result.modifiedCount;
    } catch (error) {
      throw error;
    }
  };

  // Bulk delete documents
  bulkDelete = async (filter: FilterQuery<T>): Promise<number> => {
    try {
      const result = await this.model.deleteMany(filter);
      return result.deletedCount;
    } catch (error) {
      throw error;
    }
  };
}