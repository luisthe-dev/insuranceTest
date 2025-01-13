import {
  buildPaginatedResponse,
  PaginationResponseDto,
  ResponsePaginationData,
} from "./dtos/pagination-response.dto";
import { PaginationRequestDto } from "./dtos/pagination-request.dto";
import { Response } from "express";

export interface ServiceResponseBuild {
  status: "successful" | "failed";
  message?: string;
  data?: any;
  code?: ServiceCodeMap;
}

export enum ServiceCodeMap {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  SERVER_ERROR = 500,
}

export interface ControllerResponseBuild {
  status: "successful" | "failed";
  message?: string;
  data?: any;
}

export interface PaginatedServiceResponseBuild {
  status: "successful" | "failed";
  message?: string;
  pagination: ResponsePaginationData;
  data: any;
  code?: ServiceCodeMap;
}

export interface PaginatedControllerResponse {
  status: "successful" | "failed";
  message?: string;
  pagination: PaginationResponseDto;
  data: any[];
}

export class ResponsesHelper {
  buildServiceResponse(
    data: any = {},
    message?: string,
    status: boolean = true,
    statusCode: ServiceCodeMap = 200
  ): ServiceResponseBuild {
    return {
      status: status ? "successful" : "failed",
      code: statusCode,
      message: message,
      data: data,
    };
  }

  buildPaginatedServiceResponse(
    data: any = [],
    total_count: number,
    message?: string,
    status: boolean = true,
    statusCode: ServiceCodeMap = 200
  ): PaginatedServiceResponseBuild {
    return {
      pagination: {
        total_count: total_count,
      },
      status: status ? "successful" : "failed",
      code: statusCode,
      message: message,
      data: data,
    };
  }

  buildControllerResponse(
    serviceResponse: ServiceResponseBuild,
    res: Response
  ) {
    res.status(serviceResponse.code ?? ServiceCodeMap.SERVER_ERROR).json({
      status: serviceResponse.status,
      message: serviceResponse.message,
      data: serviceResponse.data,
    });
  }

  buildPaginatedControllerResponse(
    serviceResponse: PaginatedServiceResponseBuild,
    paginationData: PaginationRequestDto,
    res: Response
  ) {
    res.status(serviceResponse.code ?? ServiceCodeMap.SERVER_ERROR).json({
      status: serviceResponse.status,
      message: serviceResponse.message,
      pagination: buildPaginatedResponse(
        serviceResponse.pagination,
        paginationData
      ),
      data: serviceResponse.data,
    });
  }
}
