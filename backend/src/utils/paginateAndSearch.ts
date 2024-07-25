import { Document, Model } from 'mongoose';

interface PaginateResult<T> {
  // totalItems: number;
  items: T[];
}

export const paginateAndSearch = async <T extends Document>(
  model: Model<T>,
  searchField: keyof T,
  searchValue: string,
  limit: number,
  page: number,
  sort: any = { createdAt: -1 }
): Promise<PaginateResult<T>> => {
  const limitNum = Number(limit);
  const pageNum = Number(page);
  const skipNum = (pageNum - 1) * limitNum;

  const searchQuery = searchValue
    ? {
        [searchField]: { $regex: new RegExp(searchValue, 'i') },
      }
    : {};

  // const totalItems = await model.countDocuments(searchQuery as any);
  const items = await model
    .find(searchQuery as any)
    .skip(skipNum)
    .limit(limitNum)
    .sort(sort);

  return { items };
};
