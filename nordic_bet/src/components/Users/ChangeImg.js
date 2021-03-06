import { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import server from "../Global/config";
import axios from "axios";


const FileInput = () => {
  const [files, setFiles] = useState();

  function handleOnChange(e) {
    setFiles(e.target.files[0]);
  }

  useEffect(() => {
    const instance = axios.create({ baseURL: server });
    const userId = localStorage.getItem("user_id");

    const uploadImage = async () => {
      const formData = new FormData();

      formData.append("files", files);


      instance
        .post("/upload", formData)
        .then((response) => {

          const imageId = response.data[0].id;

          instance
            .put(`/users/${userId}`, { profilepicture: imageId })
            .then((response) => {
              response = window.location.reload();

            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          //handle error
        });
    };
    if (files) {
      uploadImage();
    }
  }, [files]);

  //useEffect som hämtar nuvarande användare samt när den användaren är inne i "Profile" och vill byta bild så puttar den bilden in i DB/Strapi och ändrar på sidan.

  return (
    <>
      <input
        accept="image/*"
        type="file"
        id="select-image"
        style={{ display: "none" }}
        onChange={handleOnChange}
      />
      <label htmlFor="select-image" className="d-flex justify-content-start">
        <Button
          variant="contained"
          className="btn btn-secondary d-flex justify-content-start"
          component="span"
        >
          <i className="fa fa-fw fa-camera"></i>
          Byt bild
        </Button>
      </label>
    </>
  );
};

export default FileInput;
