import { PipeTransform, Injectable, ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';
import { isNil } from 'lodash';
import { DtoBox, IDto } from '../bases/dto-box.base';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNil(value) || isNil(metadata.metatype)) {
      throw new UnprocessableEntityException('Query data is required');
    } else {
      const box: DtoBox<IDto> = new metadata.metatype(value);
      const { error } = box.validate();
      if (!isNil(error)) {
        let errorMessage = '';
        if (isNil(error.details)) {
          errorMessage = error.message;
        } else {
          error.details.forEach((v, i) => {
            errorMessage += (i === 0 ? '' : ' or ') + v.message;
          });
        }
        throw new UnprocessableEntityException(errorMessage || 'Validation failed');
      }
      // else{ ok }
      return box;
    }
  }
}
