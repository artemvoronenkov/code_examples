import React, { ChangeEvent, Fragment, useRef } from "react";

import styled from "styled-components";

import { defaultAcceptedMimeTypes } from "constants/documents";
import Button from "components/common/Button";

const UploadButton = styled(Button)`
  height: 32px;
  min-width: 126px;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface IOwnProps {
  acceptedExtensions?: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const UploadInput = ({
  acceptedExtensions,
  multiple = true,
  onChange,
}: IOwnProps) => {
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const accept = acceptedExtensions || defaultAcceptedMimeTypes;

  const handleButtonClick = () => {
    if (hiddenFileInput && hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event);
    // Makes it possible to open the same file several times
    event.target.value = "";
  };

  return (
    <Fragment>
      <UploadButton
        mode="primary"
        className="uploadInputButton"
        onClick={handleButtonClick}
      >
        Upload File
      </UploadButton>

      <HiddenInput
        type="file"
        ref={hiddenFileInput}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </Fragment>
  );
};

export default UploadInput;
