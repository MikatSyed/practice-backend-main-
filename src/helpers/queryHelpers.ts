type IOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string | undefined;
  sortOrder: string | undefined;
};

const calculatePagination = (options: IOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy;
  const sortOrder = options.sortOrder;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const queryHelpers = {
  calculatePagination,
};
