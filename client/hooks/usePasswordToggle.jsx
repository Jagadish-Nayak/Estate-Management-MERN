import { useState } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
library.add(faEye, faEyeSlash);

const usePasswordToggle = () => {
  const [visible, setVisible] = useState(false);

  const Icon = (
    <FontAwesomeIcon
      icon={visible ? 'eye-slash' : 'eye'}
      onClick={() => setVisible((visibility) => !visibility)}
    />
  );

  const InputType = visible ? 'text' : 'password';

  return [InputType, Icon];
};

export default usePasswordToggle;
