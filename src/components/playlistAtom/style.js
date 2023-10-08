import { styled } from "styled-components";

export const PlayAtom = styled.div`
  margin: auto;
  text-align: left;
  display: flex;
  color: black;
  width: 40vw;
  min-width: 360px;
  border-bottom: 8px solid lightgray;
  padding: 5px 20px;
  color: #b8b8b8;
  img{
    cursor: pointer;
    object-fit: scale-down;
    width: 64px;
    margin-right: 10px;
  }
  .playingtime{
    margin-right: 2vw;
  }
  .hea{
    display: flex;
    width: 100%;
    justify-content: space-between;
    .isInPlay{
      cursor: pointer;
      font-size: 20px;
      width: 30px;
      height: 35px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        background-color: lightgray;
      }
      transition: ease 0.2s all;
    }
    .title{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 21vw;
      min-width: 180px;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
  .foo{
    display: flex;
    margin-top: 8px;
    .artist{
      display: block;
      cursor: pointer;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
`