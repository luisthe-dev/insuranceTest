import { PaginationRequestDto } from './pagination-request.dto';

export interface PaginationResponseDto {
  total: number;
  count: number;
  current_page: number;
  total_page: number;
}

export interface ResponsePaginationData {
  total_count: number;
}

export const buildPaginatedResponse = (
  pageData: ResponsePaginationData,
  paginationData: PaginationRequestDto,
): PaginationResponseDto => {
  return {
    total: pageData.total_count,
    count: +paginationData.limit,
    current_page: +paginationData.page,
    total_page: Math.ceil(+pageData.total_count / +paginationData.limit),
  };
};
