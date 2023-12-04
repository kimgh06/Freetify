import styled from "styled-components";

export const Form = styled.form`
  background-color: white;
  width: 400px;
  height: 500px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  h1{
    margin: 30px;
  }
  button{
    width: 100px;
    height: 35px;
    cursor: pointer;
  }
  input{
    width: 250px;
    height: 35px;
    background-color: white;
    color: black;
    margin-bottom: 30px;
  }
  .verifying{
    width: 250px;
    height: 20px;
    margin-top: -30px;
    margin-bottom: 20px;
  }
`
export const Back = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`
export const Navigators = styled.div`
  height: 50px;
  width: 100%;
  border-bottom: 3px solid gray;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div{
    background-color: white;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 70%;
    width: 40%;
    color: black;
    cursor: pointer;
    font-size: 15px;
    &+div{
      border-left: 2px solid gray;
    }
  }
  .active{
    font-weight: bold;
    font-size: 17px;
  }
`