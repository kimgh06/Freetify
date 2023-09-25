import { styled } from "styled-components";

export const Player = styled.div`
  position: fixed;
  padding: 8px 10px;
  z-index: 2;
  //모바일용
  left: 1vw;
  bottom: 8px;
  width: 98vw;
  border-radius: 10px;
  transition: all ease 0.1s;
  @media screen and (min-width: 1000px) {  
    display: flex;
    justify-content: center;
    top: 8px;
    right: 0;
    left: auto;
    border-radius: 10px 0 0 10px;
    padding: 1vw;
    width: 30vw;
  }
  //변하지 않는 것
  background-color: gray;
  .audio{
    .head{
      img{
        border-radius: 8px;
      }
      width: 300px;
      @media screen and (max-width: 1000px) {  
        width: auto;
        .extenstion{
          .___{
            border: 1px solid black;
            border-radius: 100px;
            margin: auto;
            margin-bottom: 3px;
            width: 50px;
          }
        }
        .content{
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          .between{
            width: calc(92vw - 136px);
            .title{
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
          img{
            border-radius: 0;
          }
        }
      }
      a{
        cursor: pointer;
        &:hover{
          text-decoration: underline;
        }
      }
      .playbutton{
        display: flex;
        align-items: center;
        justify-content: center;
        .left , .right{
          margin: 0 2vw;
          cursor: pointer;
          font-size: 20px;
          width: 30px;
          height: 30px;
          text-align: center;
          border: none;
          &:hover{
            background-color: #868686;
          }
        }
      }
      .play{
        text-align: center;
        width: 70px;
        height: 70px;
        border-radius: 100px;
        transition: all ease 0.1s;
        cursor: pointer;
        border:none;
        font-size: 30px;
        text-align: center;
        &:hover{
          background-color: #868686;
        }
      }
    }
    .bar_div{
      background-color: lightgray;
      border-radius: 30px;
      height: 5px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      @media screen and (max-width: 1000px) {  
        width: 92vw;
      }
      .bar{
        border: 3px solid blue;
        width: 0;
        height: 0;
        border-radius: 20px;
      }
      .bar_cursor{
        cursor: pointer;
        width: 10px;
        height: 10px;
        background-color: white;
        border-radius: 30px;
        margin-left: -4px;
      }
    }
    .volume{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        text-align: center;
        width: 10vw;
      }
      button{
        font-size: 20px;
        width: 30px;
        height: 30px;
        transition: all ease 0.1s;
        cursor: pointer;
      }
    }
  }
`

export const ExtensionMode = styled.div`
  width: auto;
  .extenstion{
    .___{
      border: 1px solid black;
      border-radius: 100px;
      margin: auto;
      margin-bottom: 3px;
      width: 50px;
    }
  }
  .contents{
    width: 100%;
    display: block;
    text-align: center;
    .links{
      width: 300px;
      margin: auto;
      text-align: left;
      a{
        cursor: pointer;
        width: 300px;
        &:hover{
          text-decoration: underline;
        }
      }
    }
    .playbutton{
      display: flex;
      align-items: center;
      justify-content: center;
      .left , .right{
        margin: 0 2vw;
        cursor: pointer;
        font-size: 20px;
        width: 30px;
        height: 30px;
        text-align: center;
        border: none;
        &:hover{
          background-color: #868686;
        }
      }
    }
    .play{
      text-align: center;
      width: 70px;
      height: 70px;
      border-radius: 100px;
      transition: all ease 0.1s;
      cursor: pointer;
      border:none;
      font-size: 30px;
      text-align: center;
      &:hover{
        background-color: #868686;
      }
    }
  }
`