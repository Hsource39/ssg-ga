import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import theme from "../style/theme";
import swal from "sweetalert";
import axios from "axios";
import cryptojs from "crypto-js";
import {
  changeUsername,
  changeProfileImage,
  deleteProfileImage,
  deleteUser,
} from "../actions";
import {
  validCheckUsername,
  validCheckPassword,
  validCheckDuplicatePassword,
} from "../utils/validCheck";

const Container = styled.div`
  display: grid;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 770px;
  color: white;
  min-height: 770px;

  @media ${(props) => props.theme.minimum} {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: 0.1fr 0.5fr 0.5fr;
    grid-template-areas: "Profile" "Edit" "Delete";
  }
  @media ${(props) => props.theme.mobile} {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: 0.5fr 0.5fr 0.5fr;
    grid-template-areas: "Profile" "Edit" "Delete";
  }
  @media ${(props) => props.theme.tablet} {
    grid-template-columns: repeat(1, 1fr);
    grid-template-rows: 0.5fr 0.5fr 0.5fr;
    grid-template-areas: "Profile" "Edit" "Delete";
  }
  @media ${(props) => props.theme.desktop} {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: 1fr 0.1fr;
    grid-template-areas: "Profile Edit" ". Delete";
  }
`;

const ProfileArea = styled.div`
  grid-area: Profile;
  display: flex;
  height: 20em;
  flex-direction: column;
  place-self: center;
  justify-content: center;
  align-items: center;
  margin: 2em 5em 2em 5em;
  @media ${(props) => props.theme.minimum} {
    width: 20em;
  }
  @media ${(props) => props.theme.mobile} {
    width: 20em;
  }
  @media ${(props) => props.theme.tablet} {
    width: auto;
  }
  @media ${(props) => props.theme.desktop} {
    width: auto;
  }
`;
const ImageWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid #cfd8dc;

  width: 11rem;
  height: 11rem;

  border-radius: 50%;
  overflow: hidden;
`;
const Profile = styled.img`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const Label = styled.div`
  display: flex;
  justify-content: center;
  border-radius: 10px;
  width: 5em;
  height: 2.5em;
  font-size: 1em;
  text-decoration: underline;
  color: white;
  &:hover {
    color: #ff71ce;
    font-weight: bold;
  }
  &:focus {
    outline: none;
  }
  margin: 1em;
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  font-size: 1.5em;
  margin: 0.8em 0.4em 1em 0.4em;
`;

const Text = styled.span`
  grid-area: Text;
  display: flex;
  place-self: center;
  font-size: 0.9em;
  @media ${(props) => props.theme.minimum} {
    width: auto;
  }
  @media ${(props) => props.theme.mobile} {
    width: auto;
  }
  @media ${(props) => props.theme.tablet} {
    width: auto;
  }
  @media ${(props) => props.theme.desktop} {
    width: 10em;
  }
`;

const DefaultValue = styled.div`
  grid-area: Middle;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3em;
`;

const SingleInput = styled.div`
  display: grid;

  @media ${(props) => props.theme.minimum} {
    grid-template-columns: 1fr;
    grid-template-rows: 0.5fr 0.5fr 0.5fr;
    grid-template-areas: "Text" "Middle" "DuBtn";
  }
  @media ${(props) => props.theme.mobile} {
    grid-template-columns: 1fr;
    grid-template-rows: 0.5fr 0.5fr 0.5fr;
    grid-template-areas: "Text" "Middle" "DuBtn";
  }
  @media ${(props) => props.theme.tablet} {
    grid-template-columns: 1fr 2fr 0.8fr;
    grid-template-areas: "Text Middle DuBtn";
  }
  @media ${(props) => props.theme.desktop} {
    grid-template-columns: 1fr 2fr 0.8fr;
    grid-template-areas: "Text Middle DuBtn";
  }
`;

const EditArea = styled.div`
  grid-area: Edit;
  display: flex;
  flex-direction: column;
  height: 20em;
  margin: 5em 5em 10em 5em;
`;

const InputArea = styled.div`
  display: flex;
  flex-direction: column;

  @media ${(props) => props.theme.minimum} {
    width: 20em;
  }
  @media ${(props) => props.theme.mobile} {
    width: 20em;
  }
  @media ${(props) => props.theme.tablet} {
    width: 35em;
  }
  @media ${(props) => props.theme.desktop} {
    width: 35em;
  }
`;

const Input = styled.input`
  grid-area: Middle;
  display: flex;
  justify-self: center;
  align-self: center;
  text-align: center;
  border: 1.5px solid #cfd8dc;
  border-radius: 8px;
  width: 20em;
  height: 3em;
  margin: 0.4em;
`;

const DuBtn = styled.span`
  grid-area: DuBtn;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 10px;
  width: 7em;
  font-size: 0.8em;
  text-decoration: underline;
  color: white;
  &:hover {
    color: #ff71ce;
    font-weight: bold;
  }
  &:focus {
    outline: none;
  }
  margin: 0.6em;
  @media ${(props) => props.theme.minimum} {
    place-self: center;
    justify-content: center;
    align-items: center;
    margin: 1.5em;
  }
  @media ${(props) => props.theme.mobile} {
    place-self: center;
    justify-content: center;
    align-items: center;
    margin: 1.5em;
  }
`;
const BtnContainer = styled.div`
  display: grid;
  @media ${(props) => props.theme.minimum} {
    grid-template-columns: 2fr 0.8fr;
    grid-template-rows: 1fr;
    grid-template-areas: "Middle Middle";
  }
  @media ${(props) => props.theme.mobile} {
    grid-template-columns: 1fr 2fr 0.8fr;
    grid-template-areas: " . Middle . ";
  }
  @media ${(props) => props.theme.tablet} {
    grid-template-columns: 1fr 2fr 0.8fr;
    grid-template-areas: " . Middle . ";
  }
  @media ${(props) => props.theme.desktop} {
    grid-template-columns: 1fr 2fr 0.8fr;
    grid-template-areas: " . Middle . ";
  }
`;

const BtnArea = styled.div`
  grid-area: Middle;
  display: flex;
  justify-content: center;
  align-self: center;
  margin: 1.9em 1em 0.4em 1em;
  @media ${(props) => props.theme.mobile} {
    justify-content: flex-start;
  }
`;

const Btn = styled.button`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 2.3em;
  font-size: 1em;
  color: #ff71ce;
  background-color: #212121;
  border: 2px solid #ff71ce;
  &:hover {
    opacity: 0.9;
    font-weight: bold;
  }
  &:focus {
    outline: none;
  }
  margin: 0.3em;
  @media ${(props) => props.theme.minimum} {
    width: 6em;
  }
  @media ${(props) => props.theme.mobile} {
    width: 8em;
  }
  @media ${(props) => props.theme.tablet} {
    width: 8em;
  }
  @media ${(props) => props.theme.desktop} {
    width: 8em;
  }
`;
const UserDeleteArea = styled.div`
  grid-area: Delete;
  display: grid;
  margin: 20em 0.5em 0em 5em;
  @media ${(props) => props.theme.minimum} {
    width: 75vw;
    margin: 40em 0.5em 10em 5em;
  }
  @media ${(props) => props.theme.mobile} {
    width: 20em;
    margin: 30em 0.5em 10em 5em;
  }
  @media ${(props) => props.theme.tablet} {
    width: 35em;
  }
  @media ${(props) => props.theme.desktop} {
  }
`;

const UserDeleteBtn = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  border-radius: 10px;
  width: 15em;
  height: 2.5em;
  font-size: 0.9em;
  text-decoration: underline;
  color: white;
  &:hover {
    color: #ff71ce;
    font-weight: bold;
  }
  &:focus {
    outline: none;
  }
  margin: 0.5em 0.4em 2.5em 1.9em;
`;

export default function UserEdit() {
  const dispatch = useDispatch();
  const history = useHistory();

  const userInfoInit = {
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    confirmUserPassword: "",
  };

  const [inputValues, setInputValues] = useState(userInfoInit);
  const [duplicateUsernameCheck, setduplicateUsernameCheck] = useState(true);
  const [userCheckPw, setUserCheckPw] = useState(false);
  const [newProfile, setProfile] = useState(false);
  const fileInput = useRef(null);
  const state = useSelector((state) => state.userReducer);
  const profile = useSelector((state) => state.profileReducer);
  const { id, username, email } = state.userData;
  const { image } = profile;

  const validCheckUsernameValue = validCheckUsername(inputValues.username);
  const validCheckPwValue = validCheckPassword(inputValues.newPassword);
  const validCheckDuplicatePwValue = validCheckDuplicatePassword(
    inputValues.newPassword,
    inputValues.confirmNewPassword
  );

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const pressEnter = (e) => {
    if (e.key === "Enter") handleUserInfoEdit();
  };

  const handleUploadProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("image", fileInput.current.files[0]);
      if (fileInput.current.files.length !== 0) {
        let response = await axios.post(
          `${process.env.REACT_APP_END_POINT}/user/image`,
          formData
        );
        if (response.status === 200) {
          setProfile(true);
          dispatch(changeProfileImage(response.data.data.url));
        }
      }
    } catch (error) {
      swal({
        title: "Error!",
        text: "??????????????? ????????? ?????????????????????.",
        icon: "error",
        button: "??????",
      });
    }
  };

  const handleCheckUsername = async () => {
    if (inputValues.username !== "") {
      if (validCheckUsernameValue) {
        try {
          const res = await axios.post(
            `${process.env.REACT_APP_END_POINT}/user/validation`,
            {
              username: inputValues.username,
            },
            {
              withCredentials: true,
            }
          );

          if (res.status === 200) {
            swal({
              title: "Available!",
              text: "?????? ????????? ???????????????.",
              icon: "success",
              button: "??????",
            });
            setduplicateUsernameCheck(false);
          }
        } catch (err) {
          swal({
            title: "Already in use!",
            text: "?????? ??????????????????.",
            icon: "warning",
            button: "??????",
          });
        }
      } else {
        swal({
          title: "Not valid",
          text: "???????????? ?????? ???????????????.",
          icon: "warning",
          button: "??????",
        }).then(() => {
          swal("????????? 4~8??? ??????, ??????, ?????? ??????????????? ?????????.");
        });
      }
    } else {
      swal({
        title: "Name plz!",
        text: "????????? ??????????????????.",
        icon: "warning",
        button: "??????",
      });
    }
  };

  const handleCancel = () => {
    setInputValues(userInfoInit);
    dispatch(changeProfileImage("alt-profile.jpg"));
    history.push("/mypage");
  };

  const handleUserInfoEdit = async () => {
    const { currentPassword, newPassword, confirmNewPassword } = inputValues;
    const newUsername = inputValues.username;

    if (currentPassword !== "") {
      if (newPassword !== "" && confirmNewPassword !== "") {
        if (validCheckPwValue) {
          if (validCheckDuplicatePwValue) {
            // ???????????? ????????? ??????
            if (newUsername !== "" && duplicateUsernameCheck) {
              return swal({
                title: "Not valid",
                text: "???????????? ?????? ???????????????.",
                icon: "warning",
                button: "??????",
              }).then(() => {
                swal("????????? 3~10??? ??????, ??????, ?????? ??????????????? ?????????.");
              });
            }

            try {
              const secretKey = `${process.env.REACT_APP_CRYPTOJS_SECRETKEY}`;
              const encryptedPassword = cryptojs.AES.encrypt(
                JSON.stringify({ password: currentPassword }),
                secretKey
              ).toString();

              const newEncryptedPassword = cryptojs.AES.encrypt(
                JSON.stringify({ password: confirmNewPassword }),
                secretKey
              ).toString();

              const res = await axios.patch(
                `${process.env.REACT_APP_END_POINT}/user`,
                {
                  image,
                  username: newUsername || username,
                  password: encryptedPassword,
                  newPassword: newEncryptedPassword,
                },
                {
                  withCredentials: true,
                }
              );

              if (res.status === 200) {
                swal({
                  title: "User Information Edit Success!",
                  text: "???????????? ????????? ?????????????????????.",
                  icon: "success",
                  button: "??????",
                });
                dispatch(
                  changeUsername({
                    id,
                    username: newUsername || username,
                    email,
                  })
                );
                if (newProfile) {
                  dispatch(changeProfileImage(image));
                }

                history.push("/mypage");
              }
            } catch (error) {
              swal({
                title: "User Information Edit failed!",
                text: "???????????? ????????? ??????????????????.",
                icon: "error",
                button: "??????",
              }).then(() => {
                swal("?????? ??????????????????");
              });
            }
          } else {
            swal({
              title: "Dismatch Password!",
              text: "??????????????? ???????????? ????????????.",
              icon: "warning",
              button: "??????",
            }).then(() => {
              swal("??? ???????????? ???????????? ?????? ??????????????????!");
            });
          }
        } else {
          swal({
            title: "Invalid Password!",
            text: "??? ??????????????? ????????? ???????????????.",
            icon: "warning",
            button: "??????",
          }).then(() => {
            swal("??????????????? 6 ~ 10??? ??????, ?????? ??????????????? ?????????.");
          });
        }
      }
      // ???????????? ??????
      else if (
        newPassword === "" &&
        confirmNewPassword === "" &&
        newUsername !== ""
      ) {
        try {
          const secretKey = `${process.env.REACT_APP_CRYPTOJS_SECRETKEY}`;
          const encryptedPassword = cryptojs.AES.encrypt(
            JSON.stringify({ password: currentPassword }),
            secretKey
          ).toString();

          const res2 = await axios.patch(
            `${process.env.REACT_APP_END_POINT}/user`,
            {
              image: image,
              username: newUsername,
              password: encryptedPassword,
            },
            {
              withCredentials: true,
            }
          );

          if (res2.status === 200) {
            swal({
              title: "User Information Edit Success!",
              text: "???????????? ????????? ?????????????????????.",
              icon: "success",
              button: "??????",
            });
            dispatch(changeUsername({ id, username: newUsername, email }));
            if (newProfile) {
              dispatch(changeProfileImage(image));
            }
            history.push("/mypage");
          }
        } catch {
          swal({
            title: "User Information Edit failed!",
            text: "???????????? ????????? ??????????????????.",
            icon: "error",
            button: "??????",
          }).then(() => {
            swal("?????? ??????????????????");
          });
        }
      }
      // ????????? ????????? ??????
      else if (newProfile === true) {
        try {
          const secretKey = `${process.env.REACT_APP_CRYPTOJS_SECRETKEY}`;
          const encryptedPassword = cryptojs.AES.encrypt(
            JSON.stringify({ password: currentPassword }),
            secretKey
          ).toString();

          const res3 = await axios.patch(
            `${process.env.REACT_APP_END_POINT}/user`,
            {
              image: image,
              username: username,
              password: encryptedPassword,
            },
            {
              withCredentials: true,
            }
          );

          if (res3.status === 200) {
            swal({
              title: "User Information Edit Success!",
              text: "???????????? ????????? ?????????????????????.",
              icon: "success",
              button: "??????",
            });

            dispatch(changeProfileImage(image));

            history.push("/mypage");
          }
        } catch {
          swal({
            title: "User Information Edit failed!",
            text: "???????????? ????????? ??????????????????.",
            icon: "error",
            button: "??????",
          }).then(() => {
            swal("?????? ??????????????????");
          });
        }
      } else if (
        (newPassword === "" && confirmNewPassword !== "") ||
        (newPassword !== "" && confirmNewPassword === "")
      ) {
        swal({
          title: "Insufficient input!",
          text: "??? ???????????? ?????? ????????? ???????????????.",
          icon: "warning",
          button: "??????",
        });
      } else {
        swal({
          title: "Insufficient input!",
          text: "????????? ?????? ?????? ??? ???????????? ??? ??? ??? ????????? ???????????? ?????????.",
          icon: "warning",
          button: "??????",
        });
      }
    } else {
      swal({
        title: "Insufficient input!",
        text: "?????? ??????????????? ?????? ?????????????????????.",
        icon: "warning",
        button: "??????",
      });
    }
  };

  const handleUserDelete = () => {
    swal({
      title: "????????? ?????? ?????? ?????? ??????????",
      text: "?????? ???????????? ?????? ????????? ???????????????.",
      icon: "warning",
      buttons: ["??????", "??????"],
    }).then(async (ok) => {
      if (ok) {
        try {
          const secretKey = `${process.env.REACT_APP_CRYPTOJS_SECRETKEY}`;
          const encryptedPassword = cryptojs.AES.encrypt(
            JSON.stringify({ password: inputValues.confirmUserPassword }),
            secretKey
          ).toString();

          const del = await axios.delete(
            `${process.env.REACT_APP_END_POINT}/user`,
            {
              data: {
                password: encryptedPassword,
              },
            },
            {
              withCredentials: true,
            }
          );
          if (del.status === 200) {
            swal({
              title: "Delete Success!",
              text: `??????????????? ??????????????? ?????????????????????. 
                    ????????? ?????????????????? ???????????????.`,
              icon: "success",
              button: "??????",
            });
          }
          dispatch(deleteUser({}, false));
          dispatch(deleteProfileImage());
          history.push("/");
        } catch (error) {
          swal({
            title: "Error!",
            text: "???????????? ?????? ????????? ?????????????????????.",
            icon: "error",
            button: "??????",
          });
        }
      }
    });
  };

  return (
    <>
      <Container theme={theme}>
        <ProfileArea theme={theme}>
          <Title>?????? ?????? ??????</Title>
          <ImageWrap>
            <Profile src={image} />
          </ImageWrap>
          <Label>
            <label htmlFor="profileUpload">
              ?????????
              <input
                id="profileUpload"
                type="file"
                ref={fileInput}
                name="picture"
                accept="image/*"
                onChange={handleUploadProfile}
                style={{ display: "none" }}
              />
            </label>
          </Label>
        </ProfileArea>

        <EditArea>
          <InputArea className="inputArea" theme={theme}>
            <SingleInput theme={theme}>
              <Text theme={theme}>?????????</Text>
              <DefaultValue>{email}</DefaultValue>
            </SingleInput>

            <SingleInput theme={theme}>
              <Text theme={theme}>??????</Text>
              <DefaultValue>{username}</DefaultValue>
            </SingleInput>

            <SingleInput theme={theme}>
              <Text theme={theme}>????????? ??????</Text>
              <Input
                type="text"
                name="username"
                value={inputValues.username}
                onChange={handleOnChange}
                onKeyPress={pressEnter}
                placeholder="????????? ??????????????????."
              ></Input>
              <DuBtn
                theme={theme}
                className="checkDuplicateUsernameBtn"
                onClick={handleCheckUsername}
              >
                ????????????
              </DuBtn>
            </SingleInput>
            <SingleInput theme={theme}>
              <Text theme={theme}>?????? ????????????</Text>
              <Input
                type="password"
                name="currentPassword"
                value={inputValues.currentPassword}
                onChange={handleOnChange}
                onKeyPress={pressEnter}
                placeholder="?????? ??????????????? ??????????????????."
              ></Input>
            </SingleInput>
            <SingleInput theme={theme}>
              <Text theme={theme}>??? ????????????</Text>
              <Input
                type="password"
                name="newPassword"
                value={inputValues.newPassword}
                onChange={handleOnChange}
                onKeyPress={pressEnter}
                placeholder="??? ??????????????? ??????????????????."
              ></Input>
            </SingleInput>
            <SingleInput theme={theme}>
              <Text theme={theme}>??? ???????????? ??????</Text>
              <Input
                type="password"
                name="confirmNewPassword"
                value={inputValues.confirmNewPassword}
                onChange={handleOnChange}
                onKeyPress={pressEnter}
                placeholder="?????? ?????? ??? ??????????????? ??????????????????."
              ></Input>
            </SingleInput>
          </InputArea>
          <BtnContainer theme={theme}>
            <BtnArea className="btnArea">
              <Btn className="cancelBtn" onClick={handleCancel}>
                ??????
              </Btn>
              <Btn className="UserEditBtn" onClick={handleUserInfoEdit}>
                ?????? ??????
              </Btn>
            </BtnArea>
          </BtnContainer>
        </EditArea>

        <UserDeleteArea theme={theme}>
          <UserDeleteBtn
            className="UserDeleteBtn"
            onClick={() => setUserCheckPw(!userCheckPw)}
          >
            ?????? ??????
            <br></br>
            <br></br>
            ?????? ?????? ?????????????????????????
          </UserDeleteBtn>
          {userCheckPw && (
            <SingleInput theme={theme}>
              <Text theme={theme}>???????????? ??????</Text>
              <Input
                type="password"
                name="confirmUserPassword"
                value={inputValues.confirmUserPassword}
                onChange={handleOnChange}
                placeholder="??????????????? ???????????????"
              />
              <DuBtn theme={theme} onClick={handleUserDelete}>
                ???????????? ??????
              </DuBtn>
            </SingleInput>
          )}
        </UserDeleteArea>
      </Container>
    </>
  );
}
