import { styled } from "styled-components";

export const Player = styled.div`
  position: fixed;
  padding: 2vw 3vw;
  //모바일용
  left: 1vw;
  bottom: 8px;
  width: 98vw;
  border-radius: 10px;
  @media screen and (min-width: 1000px) {  
    top: 8px;
    right: 0;
    left: auto;
    border-radius: 10px 0 0 10px;
    padding: 1vw;
    width: 30vw;
  }
  //변하지 않는 것
  background-color: gray;
  .audio{
    .head{
      @media screen and (max-width: 1000px) {  
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      a{
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
      button{
        width: 70px;
        height: 70px;
        border-radius: 100px;
        transition: all ease 0.3s;
        cursor: pointer;
        border:none;
        font-size: 30px;
        text-align: center;
      }
    }
    .bar{
      border: 3px solid blue;
      width: 0;
      height: 0;
      border-radius: 20px;
    }
  }
`