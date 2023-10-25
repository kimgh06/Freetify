import { styled } from "styled-components";

export const Nav = styled.div`
  .nav{
    @keyframes nav {
      0%{
        width: 0;
      }
    }
    animation: nav 0.5s ease;
    position: fixed;
    top: 0;
    background-color: #00af00;
    color: white;
    height: 100vh;
    width: 300px;
    padding-top: 60px;
    z-index: 2;
    @media screen and (max-width: 500px) {  
      right: 0;
      width: 140px;
    }
    p{
      padding: 20px 0 0px 20px;
    }
  }
  .menu{
    top: 20px;
    left: 20px;
    @media screen and (max-width: 500px) {  
      left: auto;
      right: 20px;
    }
    position: fixed;
    border-radius: 10px;
    text-align: center;
    z-index: 3;
    font-size: 30px;
    width: 50px;
    height: 50px;
    transition: all 0.3s ease;
    cursor: pointer;
    margin-left: -50px;
    box-shadow: none;
    background-color: gray;
    color: white;
    &:hover{
      margin-left: -30px;
    }
  }
  .true{
    transform: rotate(90deg);
    transition: all 0.3s ease;
    margin-left: 0;
    &:hover{
      margin-left: 0;
    }
  }
`