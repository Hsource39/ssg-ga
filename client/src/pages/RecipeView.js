import { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import Color from "../components/Color";
import axios from "axios";
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { setModal, setPageInit, showModal } from "../actions";
import { BsHeartFill, BsHeart } from "react-icons/bs";
import theme from "../style/theme";
import LoadingIndicator from "../components/Loading";

// 게시글 컨테이너 스타일 컴포넌트
const RecipeViewContainer = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  color: white;
  > h1 {
    font-size: 30px;
  }
  > span {
    align-self: flex-end;
    margin-bottom: 30px;
  }
  @media ${(props) => props.theme.minimum} {
    padding: 50px 20px 20px 20px;
    > h1 {
      font-size: 20px;
    }
  }
  @media ${(props) => props.theme.mobile} {
    padding: 50px 30px 30px 30px;
    > h1 {
      font-size: 25px;
    }
  }
  > #ingredientList {
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    > li {
      font-size: 20px;
      > a {
        text-decoration: underline;
        color: white;
        :hover {
          color: #ff71ce;
        }
      }
    }
  }

  > #articleContent {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    white-space: pre-wrap;
    font-size: 20px;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-end;
  font-size: 20px;
  margin: 15px 0;

  > #usernameWrap {
    width: auto;
    border-radius: 0px;
    margin-right: 0;
    height: auto;
    > a {
      text-decoration: underline;
      :hover {
        color: #ff71ce;
      }
    }
  }
  > div {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 20px;
    > img {
      width: 100%;
      height: 100%;
    }
  }
`;

const TagsContainer = styled.ul`
  display: flex;
  flex-wrap: wrap;
  margin: 40px;
  > li {
    margin-bottom: 30px;
    margin-right: 10px;
    cursor: pointer;
    > a {
      padding: 10px;
      background-color: transparent;
      border: 2px solid #fdf250;
      border-radius: 20px;
      color: #fdf250;
      white-space: nowrap;
      &:hover {
        font-weight: bold;
        background-color: #fdf250;
        color: #232b6a;
      }
    }
  }
`;

const ButtonWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  > button {
    margin-right: 1%;
  }
`;

const LikesContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: 100px;
  > #backBtn {
    margin-left: 2%;
  }

  @media ${(props) => props.theme.minimum} {
    flex-direction: column;
    justify-content: center;
    > #backBtn {
      margin-top: 20px;
    }
  }

  @media ${(props) => props.theme.mobile} {
    flex-direction: column;
    justify-content: center;
    > #backBtn {
      margin-top: 20px;
    }
  }
`;

const LikeButton = styled.button`
  display: flex;
  padding: 0;
  border: none;
  color: red;
  cursor: pointer;
  margin: 0 15px;
  font-size: 25px;
  width: 25px;
  height: 25px;
  > svg {
    position: absolute;
  }
  > .heartFill {
    transition-duration: 0.3s;
    transform: scale(0);
  }
  &:hover {
    color: red;
    box-shadow: none;
    border: none;
  }
  &.active {
    > .heartFill {
      transform: scale(1);
    }
  }
  @media ${(props) => props.theme.minimum} {
    margin: 15px 0;
  }
  @media ${(props) => props.theme.mobile} {
    margin: 15px 0;
  }
`;

export default function RecipeView() {
  const [article, setArticle] = useState({
    author_id: "",
    title: "",
    thumbnail_color: [[""], [50], [{}, {}]],
    thumbnail_type: "",
    content: "",
    tag: [""],
    ingredient: [["", ""]],
    created_at: "",
    like_user_id: [""],
    author: {
      image: "",
      username: "",
    },
    createdAt: "",
    updatedAt: "",
  });
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { id } = useParams(); // URL params 가져오는 hooks
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.userReducer);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setFetching(true);
      try {
        const res = await axios.get(
          process.env.REACT_APP_END_POINT +
          "/article/id/" +
          id +
          `?user_id=${state.userData.id}`
        );

        const article = res.data.data.singleArticle;
        const like = res.data.data.like.value;

        setArticle(article);
        setLike(like);
        setLikeCount(JSON.parse(article.like_user_id).length);
      } catch (err) {
        swal({
          title: "Error",
          text: "게시글 로드 중 에러가 발생했습니다.",
          icon: "error",
          button: "confirm",
        }).then((res) => {
          if (res) history.goBack();
        });
      }
      setFetching(false);
    };

    fetchData();
    dispatch(setPageInit());
  }, [state]);

  const deleteArticle = () => {
    swal({
      title: "정말로 삭제하시겠습니까?",
      text: "한번 삭제되면, 복구할 수 없습니다",
      icon: "warning",
      buttons: ["취소", "삭제"],
    }).then(async (ok) => {
      if (ok) {
        try {
          const res = await axios.delete(
            process.env.REACT_APP_END_POINT + "/article/id/" + id
          );
          if (res.status === 200) {
            swal({
              title: "Success",
              text: "삭제되었습니다.",
              icon: "success",
              button: "confirm",
            }).then((result) => {
              if (result) {
                history.push("/main");
              }
            });
          }
        } catch (err) {
          swal({
            title: "Error",
            text: "게시글 삭제 중 에러가 발생했습니다.",
            icon: "error",
            button: "confirm",
          });
        }
      }
    });
  };

  const handleLikes = async () => {
    if (state.isLogin) {
      try {
        const res = await axios.post(
          process.env.REACT_APP_END_POINT + "/article/likebtn",
          {
            user_id: state.userData.id,
            article_id: Number(id),
          }
        );
        if (res.status === 200) {
          setLikeCount(res.data.data.likeInfo.length);
          setLike(!like);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      dispatch(setModal(true));
      dispatch(showModal(true));
    }
  };

  const dateCalc = (date) => {
    const converted = new Date(date);
    const now = new Date();
    const calcMS = now.getTime() - converted.getTime();
    const sec = calcMS / 1000;
    const min = sec / 60;
    const hour = min / 60;
    const day = hour / 24;
    const week = day / 7;

    if (week >= 4) {
      return converted.toLocaleString({
        timeZone: "UTC",
      });
    } else if (day >= 7 && week < 4) {
      return parseInt(week) + " 주 전 ";
    } else if (hour >= 24 && day < 7) {
      return parseInt(day) + " 일 전 ";
    } else if (min >= 60 && hour < 24) {
      return " 약 " + parseInt(hour) + " 시간 전 ";
    } else if (sec >= 60 && min < 60) {
      return parseInt(min) + " 분 전 ";
    } else {
      return parseInt(sec) + " 초 전 ";
    }
  };

  return (
    <RecipeViewContainer theme={theme}>
      {fetching ? (
        <LoadingIndicator />
      ) : (
        <>
          <h1>{article.title}</h1>
          {article.author_id === state.userData.id ? (
            <ButtonWrap>
              <button
                onClick={() => {
                  history.push("/write/" + id);
                }}
              >
                수정
              </button>
              <button onClick={deleteArticle}>삭제</button>
            </ButtonWrap>
          ) : null}
          <ProfileContainer>
            <div>
              <img
                src={
                  article.author.image
                    ? article.author.image
                    : "../alt-profile.jpg"
                }
                alt="profile img"
              />
            </div>
            <div id="usernameWrap">
              <Link
                to={
                  "/main?published=" +
                  article.author_id +
                  "&username=" +
                  article.author.username
                }
              >
                {article.author.username}
              </Link>
            </div>
          </ProfileContainer>
          <span>
            {dateCalc(article.updatedAt)}
            {article.createdAt === article.updatedAt ? "작성됨" : "수정됨"}
          </span>
          <Color
            layerType={article.thumbnail_type}
            color={article.thumbnail_color[0]}
            pos={article.thumbnail_color[1]}
            deco={article.thumbnail_color[2]}
          />
          <TagsContainer>
            {article.tag !== null
              ? article.tag.map((tag, index) => {
                return (
                  <li key={"viewtag" + tag + index}>
                    <Link to={"/main?tag=" + tag}># {tag}</Link>
                  </li>
                );
              })
              : null}
          </TagsContainer>
          <ul id="ingredientList">
            {article.ingredient.map((el, index) => {
              return (
                <li key={"viewingredient" + el + index}>
                  <Link to={"/main?ingredient=" + el[0]}>{el[0]}</Link> -{" "}
                  {el[1]}
                </li>
              );
            })}
          </ul>
          <div id="articleContent">{article.content}</div>
          <LikesContainer theme={theme}>
            추천
            <LikeButton
              className={like ? "active" : null}
              onClick={handleLikes}
              theme={theme}
            >
              <BsHeart className="heart" />
              <BsHeartFill className="heartFill" />
            </LikeButton>
            <span>{likeCount}</span>
            <button id="backBtn" onClick={() => history.push("/main")}>
              목록보기
            </button>
          </LikesContainer>
        </>
      )}
    </RecipeViewContainer>
  );
}