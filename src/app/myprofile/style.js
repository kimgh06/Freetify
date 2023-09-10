import { styled } from "styled-components";

export const Profile = styled.div`
  .profile{
    text-align: center;
    margin: auto;
    .imgs{
      margin: auto;
      margin-top: 80px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      background-color: gray;
      border: 1px solid gray;
      width: 130px;
      height: 130px;
      justify-content: center;
      border-radius: 200px;
    }
    .following{
      h2{
        margin-top: 20px;
        border-bottom: 8px solid lightgray;
        border-radius: 5px;
      }
      margin: auto;
      width: 300px;
    }
  }
`