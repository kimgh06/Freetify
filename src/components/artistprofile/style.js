import { styled } from "styled-components";

export const Profile = styled.div`
  display: flex;
  span{
    width: 160px;
  }
  img{
    object-fit: scale-down;
    border-radius: 5000px;
  }
  div{
    margin-left: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover{
      text-decoration-line: underline;
    }
  }
  p{
    text-align: right;
    font-size: 25px;
    font-weight: bold;
  }
`