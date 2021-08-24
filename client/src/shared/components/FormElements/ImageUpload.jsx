import React, { useRef, useState, useEffect } from "react";
import "./ImageUpload.css";
import Button from "./Button";

const ImageUpload = (props) => {
  const filePickerRef = useRef();
  const [file, setFile] = useState();
  const [previewUrl, setpreviewUrl] = useState();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setpreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const pickedHandler = (event) => {
    let pickedFile;
    let fileIsValid = isValid;
    if (event.target.files && event.target.files.length === 1) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
      setIsValid(true);
      fileIsValid = true;
    } else {
      setIsValid(false);
      fileIsValid = false;
    }
    props.onInput(props.id, pickedFile, fileIsValid);
  };

  return (
    <div className="form-control">
      <input
        type="file"
        id={props.id}
        style={{ display: "none" }}
        accept=".jpg,.png,jpeg"
        ref={filePickerRef}
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && props.errorText}
    </div>
  );
};

export default ImageUpload;
