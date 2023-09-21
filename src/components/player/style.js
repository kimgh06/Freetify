import { styled } from "styled-components";

export const Player = styled.div`
  position: fixed;
  //모바일용
  left: 1vw;
  bottom: 8px;
  width: 98vw;
  border-radius: 10px;
  @media screen and (min-width: 500px) {  
    top: 8px;
    right: 0;
    left: auto;
    border-radius: 10px 0 0 10px;
    width: 30vw;
  }
  //변하지 않는 것
  background-color: gray;
  .audio{
    button{
      cursor: pointer;
    }
    .bar{
      border: 3px solid blue;
      width: 0;
      height: 0;
      border-radius: 20px;
    }
  }
`