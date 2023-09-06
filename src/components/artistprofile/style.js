import { styled } from "styled-components";

export const Profile = styled.div`
  display: flex;
  height: 160px;
  span{
    width: 160px;
  }
  img{
    object-fit: scale-down;
    width: 160px;
    border-radius: 500px;
  }
  div{
    margin-left: 30px;
    display: flex;
    align-items: center;
  }
`