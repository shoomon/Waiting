import { ApiOperation as SwaggerApiOperation, ApiOperationOptions } from '@nestjs/swagger'

export const ApiOperation = (options: ApiOperationOptions) => {
  return (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    SwaggerApiOperation({
      ...options,
      operationId: options?.operationId || propertyName,
    })(target, propertyName, descriptor)
    return descriptor
  }
}
