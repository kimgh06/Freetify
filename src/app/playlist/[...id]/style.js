import { styled } from "styled-components";

export const Playlist = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  main{
    h1{
      border-bottom: 8px solid lightgray;
      width: 30vw;
      min-width: 350px;
      border-radius: 5px;
      width: 300px;
      margin: auto;
      text-align: center;
    }
    .box{
      display: flex;
      align-items: center;
      .hold{
        height: 70px;
        padding-left: 100px;
        margin-left: -100px;
        margin-top: 10px;
        border-right: 5px solid black;
        margin-right: 10px;
        cursor: pointer;
        &:active{
          cursor: grabbing;
        }
      }
    }
  }
`

export const PaddingBox = styled.div`
  height: 200px;
`