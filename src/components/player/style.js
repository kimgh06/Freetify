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
  @media screen and (min-width: 1200px) {  
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
    .extention{
      display: flex;
      position: absolute;
      align-items: end;
      height: 55vh;
      cursor: pointer;
      .___{
        height: 100px;
        border: 1px solid black;
        margin-right: 5px;
      }
    }
    .head{
      .main_original{
        img{
          border-radius: 8px;
        }
        width: 300px;
      }
      @media screen and (max-width: 1200px) {  
        display: block;
        width: auto;
        .extenstion{
          cursor: pointer;
          .___{
            border: 1px solid black;
            border-radius: 100px;
            height: 3px;
            background-color: black;
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
      height: 4.8px;
      display: flex;
      align-items: center;
      margin-top: 10px;
      @media screen and (max-width: 1199px) {  
        width: calc(100vw - 25px);
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
        background-color: gray;
        border: 2px solid white;
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

export const ExtensionMode_mobile = styled.div`
  width: auto;
  .extenstion{
    cursor: pointer;
    .___{
      border: 1px solid black;
      border-radius: 100px;
      margin: auto;
      margin-bottom: 3px;
      width: 50px;
      height: 3px;
      background-color: black;
    }
  }
  .contents{
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: end;
    .texts{
      .links{
        width: 280px;
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

export const Main_smaller = styled.div`
  text-align: center;
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
  button{
    margin: 2vh 0;
    cursor: pointer;
    font-size: 20px;
    width: 50px;
    height: 50px;
    text-align: center;
    border: none;
    border-radius: 5px;
    &:hover{
      background-color: #868686;
    }
  }
  .title{
    position: absolute;
    transform: rotate(90deg);
    width: 30vh;
    margin-left: -80px;
    margin-top: 14.5vh;
  }
`