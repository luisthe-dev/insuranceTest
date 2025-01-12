import {
  buildPaginatedResponse,
  PaginationResponseDto,
  ResponsePaginationData,
} from './dtos/pagination-response.dto';
import { PaginationRequestDto } from './dtos/pagination-request.dto';

export interface ServiceResponseBuild {
  status: 'successful' | 'failed';
  message?: string;
  data?: any;
}

export interface ControllerResponseBuild {
  status: 'successful' | 'failed';
  message?: string;
  data?: any;
}

export interface PaginatedServiceResponseBuild {
  status: 'successful' | 'failed';
  message?: string;
  pagination: ResponsePaginationData;
  data: any;
}

export interface PaginatedControllerResponse {
  status: 'successful' | 'failed';
  message?: string;
  pagination: PaginationResponseDto;
  data: any[];
}

export class ResponsesHelper {
  buildServiceResponse(
    data: any = {},
    message?: string,
    status: boolean = true,
  ): ServiceResponseBuild {
    return {
      status: status ? 'successful' : 'failed',
      message: message,
      data: data,
    };
  }

  buildPaginatedServiceResponse(
    data: any = [],
    total_count: number,
    message?: string,
    status: boolean = true,
  ): PaginatedServiceResponseBuild {
    return {
      pagination: {
        total_count: total_count
      },
      status: status ? 'successful' : 'failed',
      message: message,
      data: data,
    };
  }

  buildControllerResponse(
    serviceResponse: ServiceResponseBuild,
  ): ControllerResponseBuild {
    return {
      status: serviceResponse.status,
      message: serviceResponse.message,
      data: serviceResponse.data,
    };
  }

  buildPaginatedControllerResponse(
    serviceResponse: PaginatedServiceResponseBuild,
    paginationData: PaginationRequestDto,
  ): PaginatedControllerResponse {
    return {
      pagination: buildPaginatedResponse(
        serviceResponse.pagination,
        paginationData,
      ),
      status: serviceResponse.status,
      message: serviceResponse.message,
      data: serviceResponse.data,
    };
  }
}
