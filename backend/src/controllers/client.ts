import { Request, Response, NextFunction } from 'express';
import { Client } from '../models/Client';
import {
  ErrorResponse,
  HttpCode,
  SuccessResponse,
  SuccessResponseList,
} from '../types/types';
import { ROLES } from '../models/User';

// Get all clients
export const getClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      offset = 0,
      limit = 100,
      sortBy = 'updatedAt',
      order = 'desc',
      ...filters
    } = req.query;

    const limitNum = parseInt(limit as string);
    const offsetNum = parseInt(offset as string);
    const sortOrder = order === 'desc' ? -1 : 1;

    const query: any = {};
    if (filters.name) query.name = new RegExp(filters.name as string, 'i');
    if (filters.active) {
      const actives = (filters.active as string).split('.');
      query.active = { $in: actives };
    }

    // Managers can only retrieve their own clients
    if (req.user?.role === ROLES.MANAGER) {
      query.user = req.user._id;
    }

    const clients = await Client.find(query)
      .sort({ [sortBy as string]: sortOrder })
      .skip(offsetNum)
      .limit(limitNum)
      .populate('user', 'email');

    res.status(200).json(new SuccessResponseList('Clients retrieved', clients));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve clients', 500));
  }
};

// Get a single client by ID
export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);

    if (!client) {
      return next(new ErrorResponse('Client not found', 404));
    }

    // Managers can only access their own clients
    if (
      req.user?.role === ROLES.MANAGER &&
      client.user.toString() !== (req.user?._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to access this client',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    res.status(200).json(new SuccessResponse('Client retrieved', client));
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve client', 500));
  }
};

// Create a new client
export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newClient = await Client.create({
      ...req.body,
      user: req.user?._id, // Associate the client with the manager
    });

    res.status(201).json(new SuccessResponse('Client created', newClient));
  } catch (error) {
    next(new ErrorResponse('Failed to create client', 500));
  }
};

// Update a client by ID
export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return next(new ErrorResponse('Client not found', 404));
    }

    // Managers can only update their own clients
    if (
      req.user?.role === ROLES.MANAGER &&
      client.user.toString() !== (req.user?._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to update this client',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    const updatedClient = await Client.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(new SuccessResponse('Client updated', updatedClient));
  } catch (error) {
    next(new ErrorResponse('Failed to update client', 500));
  }
};

// Delete a client by ID
export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return next(new ErrorResponse('Client not found', 404));
    }

    // Managers can only delete their own clients
    if (
      req.user?.role === ROLES.MANAGER &&
      client.user.toString() !== (req.user?._id as string).toString()
    ) {
      return next(
        new ErrorResponse(
          'You are not authorized to delete this client',
          HttpCode.UNAUTHORIZED
        )
      );
    }

    await client.deleteOne();

    res.status(200).json(new SuccessResponse('Client deleted', null));
  } catch (error) {
    next(new ErrorResponse('Failed to delete client', 500));
  }
};

// Get total number of clients
export const getTotalClients = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query =
      req.user?.role === ROLES.MANAGER ? { user: req.user._id } : {};
    const totalClients = await Client.countDocuments(query);

    res
      .status(200)
      .json(
        new SuccessResponse('Total clients retrieved', { total: totalClients })
      );
  } catch (error) {
    next(new ErrorResponse('Failed to retrieve total clients', 500));
  }
};
