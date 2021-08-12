import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";

// 상위 Tag 목록 스타일 컴포넌트
const TagRankingComponent = styled.div`
  margin: 50px 0;
  display: grid;
  flex-direction: column;
  justify-content: center;
  > ul {
    display: flex;
    justify-content: center;
    > li {
      padding: 0 20px;
      border-right: 1px solid black;
      cursor: pointer;
    }
    > li:last-child {
      border-right: none;
    }
  }
  > div {
    > ul {
      display: flex;
      justify-content: space-around;
      align-items: center;
      /* overflow-x: scroll; */
      margin: 20px 0;
      > li {
        background-color: black;
        padding: 10px;
        margin-right: 20px;
        border-radius: 20px;
        > a {
          color: white;
          white-space: nowrap;
        }
      }
    }
  }
`;

export default function TagRanking({ query }) {
  const { tags, ingredients } = useSelector(
    (state) => state.articleListReducer
  );
  const [category, setCategory] = useState(() => {
    return query.tag !== undefined
      ? "tags"
      : query.ingredient !== undefined
      ? "ingredients"
      : "all";
  });

  return (
    <TagRankingComponent>
      <ul>
        <li
          onClick={() => {
            setCategory("all");
          }}
        >
          <Link to="/main">전체보기</Link>
        </li>
        <li
          onClick={() => {
            setCategory("likes");
          }}
        >
          <Link to="/main?mostLiked=true">추천순</Link>
        </li>
        <li
          onClick={() => {
            setCategory("tags");
          }}
        >
          해시태그
        </li>
        <li
          onClick={() => {
            setCategory("ingredients");
          }}
        >
          재료
        </li>
      </ul>
      <div>
        {category === "tags" ? (
          <ul>
            {tags.map((tag) => {
              return (
                <li>
                  <Link to={"/main?tag=" + tag}>{tag}</Link>
                </li>
              );
            })}
          </ul>
        ) : category === "ingredients" ? (
          <ul>
            {ingredients.map((el) => {
              return (
                <li>
                  <Link to={"/main?ingredient=" + el}>{el}</Link>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </TagRankingComponent>
  );
}
// 상위 Tag 컴포넌트
