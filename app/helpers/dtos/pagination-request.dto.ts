export interface PaginationRequestDto {
  limit: number;
  page: number;
}

export const paginationCheck = (
  paginationData: PaginationRequestDto
): PaginationRequestDto => {
  paginationData.limit =
    paginationData.limit && +paginationData.limit != 0
      ? paginationData.limit
      : 30;
  paginationData.page =
    paginationData.page && +paginationData.page != 0 ? paginationData.page : 1;

  return paginationData;
};
