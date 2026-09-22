export class ApiResponse {
  constructor(statusCode, data = {}, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode < 400;
    this.message = message;
    this.data = data;
  }

  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json(new ApiResponse(statusCode, data, message));
  }

  static created(res, message = 'Resource created successfully', data = {}) {
    return res.status(201).json(new ApiResponse(201, data, message));
  }
}
