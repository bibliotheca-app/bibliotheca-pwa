import { Form as GForm } from 'grommet';

// この修正がマージされるまでの繋ぎ
// https://github.com/grommet/grommet/pull/3101/files
export class Form extends GForm {
  constructor(props: any) {
    super(props);
  }

  update = (name: any, data: any, error: any) => {
    this.setState((state: any) => {
      const { errors, touched, value } = state;
      const nextValue = { ...value, [name]: data };
      const nextTouched = { ...touched, [name]: true };
      const nextErrors = { ...errors };
      const validations = (this as any).validations;

      if (errors[name]) {
        const nextError = error || (validations[name] && validations[name](data, nextValue));
        if (nextError) {
          nextErrors[name] = nextError;
        } else {
          delete nextErrors[name];
        }
      }

      return {
        value: nextValue,
        errors: nextErrors,
        touched: nextTouched,
      };
    });
  };
}
