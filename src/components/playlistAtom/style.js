import { styled } from "styled-components";

export const PlayAtom = styled.div`
  margin: auto;
  text-align: left;
  display: flex;
  background-color: white;
  color: black;
  width: 30vw;
  min-width: 350px;
  border-bottom: 8px solid lightgray;
  border-radius: 5px;
  padding: 5px 20px;
  img{
    cursor: pointer;
    object-fit: scale-down;
    width: 64px;
    margin-right: 10px;
  }
  .title{
    cursor: pointer;
    max-width: 300px;
    min-width: 200px;
    &:hover{
      text-decoration-line: underline;
    }
  }
  .artist{
    cursor: pointer;
    &:hover{
      text-decoration-line: underline;
    }
  }
  .isInPlay{
    cursor: pointer;
    font-size: 20px;
    width: 30px;
    height: 30px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover{
      background-color: lightgray;
    }
    transition: ease 0.2s all;
  }
`