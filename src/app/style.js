import { styled } from "styled-components";

export const App = styled.main`
  h1{
    border-bottom: 8px solid lightgray;
    width: 30vw;
    min-width: 350px;
    margin: auto;
    border-radius: 5px;
  }
  .searchButton{
    display: flex;
    margin-top: 30px;
  }
`
export const PaddingBox = styled.div`
  height: 200px;
`
export const Notice = styled.div`
  width: 35vw;
  min-width: 380px;
  margin: auto;
  border-radius: 5px;
  background-color: white;
  padding: 10px;
  button{
    background-color: red;
    color: white;
    font-size: 20px;
    width: 30px;
    height: 30px;
    font-weight: bolder;
    cursor: pointer;
    border-radius: 5px;
  }
`
export const searchButton = styled.input`
  margin: auto;
  border-radius: 15px;
  font-size: 20px;
  padding: 5px;
  border: orange 2px solid;
`