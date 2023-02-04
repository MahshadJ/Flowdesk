import {ErrorProps} from './types';

function Error ({error}: ErrorProps): any {
    if(error.length) {
      return (
        <h4>{error}</h4>
      );
    }
  }

export default Error;
