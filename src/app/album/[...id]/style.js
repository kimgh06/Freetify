import { styled } from "styled-components";

export const AlbumInfos = styled.div`
  .header{
    display: flex;
    justify-content: center;
    align-items: end;
    margin-bottom: 30px;
    .description{
      margin-left: 20px;
      h1{
        margin-right: 20px;
      }
      .information{
        display: flex;
        font-weight: bold;
        a{
          cursor: pointer;
          font-size: 20px;
          padding-right: 20px;
          &:hover{
            text-decoration-line: underline;
          }
        }
      }
    }
  }
  .end{
    display: flex;
    align-items: center;
    justify-content: center;
    @media screen and (max-width: 1000px) {  
      margin-bottom: 100px;
    }
  }
`