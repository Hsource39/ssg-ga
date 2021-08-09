import styled from "styled-components";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Maker from "../components/Maker";
import theme from "../style/theme";
import { addArticleList } from "../actions";

// 게시물 작성 컨테이너 스타일 컴포넌트
const WriteContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media ${(props) => props.theme.minimum} {
    grid-template-columns: 1fr;
  }
  @media ${(props) => props.theme.mobile} {
    grid-template-columns: 1fr;
  }
`;

// 게시물 정보 작성 스타일 컴포넌트
const RecipeInfo = styled.div`
  display: flex;
  flex-direction: column;
  > textarea {
    resize: none;
  }
`;

// 게시물 태그 작성 스타일 컴포넌트
const TagInput = styled.div`
  display: flex;
  > ul {
    display: flex;
    > li {
      cursor: pointer;
      border: 1px solid black;
    }
  }
`;

// 게시물 태그 input 스타일 컴포넌트
const IngredientInput = styled.li``;

export default function RecipeWrite() {
  // local test용
  const state = useSelector((state) => state.articleListReducer);
  const dispatch = useDispatch();
  // -----------------------------------------------------------

  const [title, setTitle] = useState(""); // 게시글 제목 작성 핸들링
  const [tags, setTags] = useState([]); // 게시글 태그 목록 작성 핸들링
  const [ingredients, setIngredient] = useState([
    // 게시글 재료 목록 작성 핸들링
    {
      ingredientname: "",
      amount: "",
    },
  ]);
  const [layerType, setLayerType] = useState("mono"); // 게시글 썸네일 레이어 타입 핸들링
  const [color, setColor] = useState(["#000000"]); // 게시글 썸네일 컬러 목록 핸들링

  const addTag = (event) => {
    const filtered = tags.filter((el) => el === event.target.value);

    if (event.target.value !== "" && filtered.length === 0) {
      setTags([...tags, event.target.value]);
    }
    event.target.value = "";
  };

  const removeTag = (clickedIndex) => {
    setTags(() => {
      return tags.filter((_, index) => {
        return index !== clickedIndex;
      });
    });
  };

  const addIngredient = () => {
    setIngredient([
      ...ingredients,
      {
        ingredientname: "",
        amount: "",
      },
    ]);
  };

  const handleIngredient = (event, index, type) => {
    const copied = ingredients.slice();

    copied[index][type] = event.target.value;
    setIngredient(copied);
  };

  const deleteIngredient = (selectIndex) => {
    const filtered = ingredients.filter((_, index) => {
      return selectIndex !== index;
    });

    setIngredient(filtered);
  };

  const postArticle = () => {
    // Local test용 Redux add
    dispatch(
      addArticleList({
        id: `${state.length + 1}`,
        title,
        thumb: {
          layerType,
          color,
        },
        ingredient: ingredients,
      })
    );
  };

  return (
    <WriteContainer theme={theme}>
      <RecipeInfo>
        <div>
          제목
          <input
            type="text"
            onChange={(event) => {
              setTitle(event.target.value);
            }}
          />
        </div>
        <TagInput>
          태그
          <ul>
            {tags.map((tag, index) => {
              return <li onClick={() => removeTag(index)}>{tag}</li>;
            })}
          </ul>
          <input
            type="text"
            onKeyUp={(event) => (event.key === "Enter" ? addTag(event) : null)}
          />
        </TagInput>
        <ul>
          <li>
            <div>재료</div>
            <div>용량</div>
          </li>
          {ingredients.map((el, index) => {
            return (
              <IngredientInput>
                <input
                  type="text"
                  value={el.ingredientname}
                  onChange={(event) =>
                    handleIngredient(event, index, "ingredientname")
                  }
                />
                <input
                  type="number"
                  value={el.amount}
                  onChange={(event) => handleIngredient(event, index, "amount")}
                />
                ml
                <button onClick={() => deleteIngredient(index)}>삭제</button>
              </IngredientInput>
            );
          })}
        </ul>
        <button onClick={addIngredient}>+ 재료 추가</button>
        <textarea />
      </RecipeInfo>
      <Maker
        layerType={layerType}
        setLayerType={setLayerType}
        color={color}
        setColor={setColor}
      />
      <button onClick={postArticle}>게시</button>
    </WriteContainer>
  );
}

// 게시물 작성 페이지 입니다