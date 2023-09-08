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
    button{
      height: 25px;
      width: 50px;
      cursor: pointer;
    }
    input{
      font-size: 20px;
      margin-top: 30px;
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