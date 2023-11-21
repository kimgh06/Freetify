import { styled } from "styled-components";

export const PlayAtom = styled.div`
  margin: auto;
  margin-top: 10px;
  text-align: left;
  display: flex;
  color: black;
  width: 35vw;
  min-width: 360px;
  border: 4px solid lightgray;
  padding: 5px 20px;
  color: #ffffff;
  border-radius: 5px;
  img{
    cursor: pointer;
    object-fit: scale-down;
    width: 52px;
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
      width: 22vw;
      min-width: 190px;
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