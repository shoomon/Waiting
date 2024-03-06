import { ApiProperty } from '@nestjs/swagger'

export class LabeledDto {
  @ApiProperty({
    description: 'The value property of the labeled DTO',
    type: String,
  })
  value: string

  @ApiProperty({
    description: 'The label property of the labeled DTO',
    type: String,
  })
  label: string
}
