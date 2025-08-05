import { describeError } from '~/web/utils/behaviors/describe-error';
import { showAlert } from '~/web/utils/behaviors/show-alert';

export function processError(error: unknown): void {
  const [title, subtitle] = describeError(error);

  showAlert('error', title, subtitle);
}
