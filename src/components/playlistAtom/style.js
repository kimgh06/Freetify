import { styled } from "styled-components";

export const PlayAtom = styled.div`
  margin: auto;
  margin-top: 10px;
  text-align: left;
  display: flex;
  color: black;
  width: 35vw;
  min-width: 360px;
  border: 4px solid lightgray;
  padding: 5px 20px;
  color: #ffffff;
  border-radius: 5px;
  justify-content: space-between;
  align-items: center;
  img{
    cursor: pointer;
    object-fit: scale-down;
    width: 52px;
    height: 52px;
    margin-right: 10px;
    border-radius: 5px;
  }
  .playingtime{
    margin-right: 2vw;
  }
  .hea{
    display: flex;
    justify-content: space-between;
    width: calc(32vw - 105px);
    min-width: 220px;
    .title{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
  .foo{
    display: flex;
    margin-top: 15px;
    .artist{
      display: block;
      cursor: pointer;
      &:hover{
        text-decoration-line: underline;
      }
    }
  }
  .audio{
    text-align: right;
    button{
      cursor: pointer;
      width: 25px;
      height: 25px;
    }
    .isInPlay{
      margin: 5px 0;
      cursor: pointer;
      width: 25px;
      height: 25px;
      font-size: 20px;
      border-radius: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      user-select:none;
      span{
        width: 100%;
        height: 100%;
        border-radius:200px;
        text-align: center;
        &:hover{
          background-color: lightgray;
        }
        transition: ease 0.2s all;
      }
      .floating{
        @keyframes init {
          0%{
            max-height: 0;
            margin-left: 0;
          }
          10%{
            max-height: 0px;
            margin-left: 250px;
          }
        }
        position: absolute;
        text-align: left;
        margin-left: 300px;
        margin-top: -50px;
        max-height: 100px;
        overflow-y: scroll;
        overflow-x:hidden;
        animation: init 0.1s linear;
        div{
          width: 200px;
          border-radius: 10px;
          padding-left:10px;
          padding-right:10px;
          color: black;
          background-color: #ffffff;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
        }
        &::-webkit-scrollbar{
          width: 5px;
        }
        &::-webkit-scrollbar-thumb{
          background-color: #ffffff;
        }
      }
    }
  }
`