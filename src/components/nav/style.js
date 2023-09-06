import { styled } from "styled-components";

export const Nav = styled.div`
  .nav{
    position: absolute;
    background-color: #00af00;
    color: white;
    height: 100vh;
    width: 300px;
    p{
      padding: 20px 0 0px 20px;
    }
  }
  .menu{
    position: absolute;
    z-index: 2;
    font-size: 30px;
    width: 50px;
    height: 50px;
  }
  transition: all 5s ease;
`