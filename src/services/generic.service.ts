import { Document, Model, FilterQuery, UpdateQuery } from 'mongoose';

interface IService<T extends Document> {
    getAll(filters: FilterQuery<T>, data: string, fields: string): Promise<T[]>;
    create(data: any): Promise<T>;
    update(id: string, data: UpdateQuery<T>): Promise<T | null>;
    findAndUpdate(criteria: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null>;
    getById(id: string, data: string, fields: string): Promise<T | null>;
    deleteById(id: string): Promise<T | null>;
    getData(criteria: FilterQuery<T>, data: string, fields: string): Promise<T | null>;
    updateStatus(id: string, changeStatus: string): Promise<T | null>;
    findAndUpdateStatus(criteria: FilterQuery<T>, changeStatus: string): Promise<T | null>;
}

class GenericService<T extends Document> implements IService<T> {
    constructor(private readonly Model: Model<T>) {}

    async getAll(filters: FilterQuery<T>, data: string, fields: string): Promise<T[]> {
        return this.Model.find(filters).populate(data).select(fields);
    }

    async create(data: any): Promise<T> {
        return this.Model.create(data);
    }

    async update(id: string, data: UpdateQuery<T>): Promise<T | null> {
        return this.Model.findByIdAndUpdate(id, data);
    }

    async findAndUpdate(criteria: FilterQuery<T>, data: UpdateQuery<T>): Promise<T | null> {
        return this.Model.findOneAndUpdate(criteria, data);
    }

    async getById(id: string, data: string, fields: string): Promise<T | null> {
        return this.Model.findById(id).populate(data).select(fields);
    }

    async deleteById(id: string): Promise<T | null> {
        return this.Model.findByIdAndDelete(id);
    }

    async getData(criteria: FilterQuery<T>, data: string, fields: string): Promise<T | null> {
        return this.Model.findOne(criteria).populate(data).select(fields);
    }

    async updateStatus(id: string, changeStatus: string): Promise<T | null> {
        if (!['Active', 'Inactive'].includes(changeStatus)) {
            throw new Error('Invalid status value');
        }
        return this.Model.findByIdAndUpdate(id, { status: changeStatus });
    }

    async findAndUpdateStatus(criteria: FilterQuery<T>, changeStatus: string): Promise<T | null> {
        if (!['Active', 'Inactive'].includes(changeStatus)) {
            throw new Error('Invalid status value');
        }
        return this.Model.findOneAndUpdate(criteria, { status: changeStatus });
    }
}

export default GenericService;
