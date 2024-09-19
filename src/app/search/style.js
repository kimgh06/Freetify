import { styled } from "styled-components";

export const Search = styled.div`
  text-align: center;
  margin-top: 80px;
  p{
    border-bottom: 8px solid lightgray;
    width: 30vw;
    min-width: 350px;
    margin: auto;
    border-radius: 5px;
    text-align: left;
  }
  form{
    position: fixed;
    top: 0;
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 30px;
    button{
      cursor: pointer;
      padding: 7px;
      border-top-right-radius: 15px;
      border-bottom-right-radius: 15px; 
      font-weight: bolder;
    }
    input{
      border-top-left-radius: 15px;
      border-bottom-left-radius: 15px;
      font-size: 20px;
      padding: 5px;
    }
  }
  .results{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .result{
      margin-bottom: 50px;
    }
  }
`