import { styled } from "styled-components";

export const AlbumInfos = styled.div`
  .header{
    display: flex;
    justify-content: center;
    align-items: end;
    margin-bottom: 30px;
    img{
      margin-top:30px;
      border-radius: 8px;
    }
    @media screen and (max-width: 1000px) {  
      display: block;
      text-align: center;
    }
    .description{
      margin-left: 20px;
      h1{
        margin-right: 20px;
      }
      .information{
        display: flex;
        font-weight: bold;
        @media screen and (max-width: 1000px) {  
          justify-content: center;
        }
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
      margin-bottom: 150px;
    }
  }
`