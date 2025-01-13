import { AppDataSource } from "../data-source";
import { CreateUserDto } from "../dtos/user/createUser.dto";
import { User, UserStatus } from "../models/user.model";
import * as bcrypt from "bcrypt";
import {
  PaginatedServiceResponseBuild,
  ResponsesHelper,
  ServiceCodeMap,
  ServiceResponseBuild,
} from "../helpers/responses";
import { Repository } from "typeorm";
import { LoginUserDto } from "../dtos/user/loginUser.dto";
import { UtilsHelper } from "../helpers/utils";
import { PaginationRequestDto } from "../helpers/dtos/pagination-request.dto";
import { UpdateUserDto } from "../dtos/user/updateUser.dto";

export default class UserService {
  responseHelper: ResponsesHelper;
  userRepository: Repository<User>;
  utilsHelper: UtilsHelper;

  constructor() {
    this.responseHelper = new ResponsesHelper();
    this.utilsHelper = new UtilsHelper();
    this.userRepository = new Repository(User, AppDataSource.manager);
  }

  createUser = async (
    userData: CreateUserDto
  ): Promise<ServiceResponseBuild> => {
    const emailExists = await this.userRepository.findOne({
      where: { email: userData.email },
    });

    if (emailExists) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Email Already Exists",
        false,
        ServiceCodeMap.BAD_REQUEST
      );
    }

    const userExists = await this.userRepository.findOne({
      where: { userName: userData.userName },
    });

    if (userExists) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Username Is Already In Use",
        false,
        ServiceCodeMap.BAD_REQUEST
      );
    }

    const newUser = this.userRepository.create({
      fullName: userData.fullName,
      userName: userData.userName,
      email: userData.email,
      password: await bcrypt.hash(userData.password, 10),
      status: UserStatus.VERIFIED,
    });

    const user = await this.userRepository.save(newUser, { reload: true });

    return this.responseHelper.buildServiceResponse(
      user.buildResponseUser(),
      "User Created Successfully",
      true,
      ServiceCodeMap.CREATED
    );
  };

  loginUser = async (userData: LoginUserDto): Promise<ServiceResponseBuild> => {
    const user = await this.userRepository.findOne({
      where: { userName: userData.userName },
    });

    if (!user) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Invalid Login Information",
        false,
        ServiceCodeMap.BAD_REQUEST
      );
    }

    const passwordConfirm = await bcrypt.compare(
      userData.password,
      user.password
    );

    if (!passwordConfirm) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Invalid Login Information",
        false,
        ServiceCodeMap.BAD_REQUEST
      );
    }

    const userToken = this.utilsHelper.generateToken(user);

    return this.responseHelper.buildServiceResponse(
      {
        user: user.buildResponseUser(),
        access_token: userToken,
      },
      "User Logged In Successfully"
    );
  };

  getSelf = async (userToken: string): Promise<ServiceResponseBuild> => {
    userToken = userToken.replace("Bearer ", "");

    try {
      const userData = this.utilsHelper.verifyToken(userToken);

      if (!userData)
        return this.responseHelper.buildServiceResponse(
          {},
          "Unauthorized",
          false,
          ServiceCodeMap.UNAUTHORIZED
        );

      //@ts-ignore
      const user = await this.userRepository.findOneBy({ id: userData?.id });

      return this.responseHelper.buildServiceResponse(
        user?.buildResponseUser(),
        "User Information Fetched Successfully"
      );
    } catch (error) {
      return this.responseHelper.buildServiceResponse(
        {},
        "Unauthorized",
        false,
        ServiceCodeMap.UNAUTHORIZED
      );
    }
  };

  getUsers = async (
    paginationData: PaginationRequestDto
  ): Promise<PaginatedServiceResponseBuild> => {
    const userActivity = await this.userRepository.find({
      order: {
        id: "DESC",
      },
      skip: paginationData.limit * (paginationData.page - 1),
      take: paginationData.limit,
    });

    const total_count = await this.userRepository.count();

    return this.responseHelper.buildPaginatedServiceResponse(
      userActivity,
      total_count,
      "User Activity Fetched Successfully"
    );
  };

  getUser = async (userId: number): Promise<ServiceResponseBuild> => {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user)
      return this.responseHelper.buildServiceResponse(
        {},
        "User Not Found",
        false,
        ServiceCodeMap.NOT_FOUND
      );

    return this.responseHelper.buildServiceResponse(
      user.buildResponseUser(),
      "User Fetched Successfully"
    );
  };

  updateUser = async (userToken: string, updateData: UpdateUserDto): Promise<ServiceResponseBuild> => {
    const userData = await this.getSelf(userToken);

    if (userData.status == "failed") return userData;

    const user = { ...userData.data, ...updateData };

    this.userRepository.save(user, { reload: true });

    return this.responseHelper.buildServiceResponse(
      user,
      "User Updated Successfully"
    );
  };

  editUser = async (userId: number, updateData: UpdateUserDto): Promise<ServiceResponseBuild> => {
    const userData = await this.getUser(userId);

    if (userData.status == "failed") return userData;

    const user = { ...userData.data, ...updateData };

    this.userRepository.save(user, { reload: true });

    return this.responseHelper.buildServiceResponse(
      user,
      "User Updated Successfully"
    );
  };

  deleteUser = async (userId: number): Promise<ServiceResponseBuild> => {

    this.userRepository.delete(userId);

    return this.responseHelper.buildServiceResponse(
      {},
      "User Deleted Successfully"
    );
  };
}
