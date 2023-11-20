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
  color: #ffffff;
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
    .title{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 25vw;
      min-width: 180px;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
  .foo{
    display: flex;
    margin-top: 15px;
    .artist{
      display: block;
      cursor: pointer;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
  .audio{
    text-align: right;
    button{
      cursor: pointer;
      width: 25px;
      height: 25px;
    }
    .isInPlay{
      margin: 5px 0;
      cursor: pointer;
      width: 25px;
      height: 25px;
      font-size: 20px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover{
        background-color: lightgray;
      }
      transition: ease 0.2s all;
    }
  }
`