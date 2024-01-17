import { styled } from "styled-components";

export const Player = styled.div`
  position: fixed; 
  color: white;
  @media screen and (max-width: 1200px){
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }
  padding: 8px 10px;
  z-index: 2;
  //모바일용
  left: 1vw;
  bottom: 1vw;
  width: 98vw;
  transition: all ease 0.3s;
  border-radius: 10px;
  button{
    background-color: #00000000;
    color: white;
  }
  .playlist_popup{
    font-size: 18px;
    @keyframes init {
      0%{
        max-height: 0;
        margin-left: 0;
      }
      10%{
        max-height: 0px;
        margin-left: -300px;
      }
    }
    position: absolute;
    text-align: center;
    max-height: 100px;
    right: 10px;
    bottom: 10vh;
    overflow-y: scroll;
    overflow-x:hidden;
    animation: init 0.1s linear;
    div{
      width: 230px;
      border-radius: 10px;
      padding:2px 10px;
      color: black;
      background-color: #ffffff;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      p{
        max-width: 10px;
        min-width: 10px;
        width: 10px;
        margin: 0;
        border: none;
        cursor: pointer;
      }
    }
    &::-webkit-scrollbar{
      width: 5px;
    }
    &::-webkit-scrollbar-thumb{
      background-color: #ffffff;
    }
  }
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
  background-color: #04001a;
  .audio{
    height: 650px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-bottom: 30px;
    @media screen and (max-width:1200px) {
      width: 95%;
    }
    .extention{
      transition: all ease 0.3s;
      display: flex;
      position: absolute;
      align-items: end;
      height: 55vh;
      cursor: pointer;
      .___{
        height: 100px;
        border: 1px solid white;
        margin-right: 5px;
      }
    }
    .head{
      .main_original{
        img{
          border-radius: 8px;
        }
        margin-top: 50px;
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
            background-color: white;
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
          /* margin-bottom: 20px; */
          .between{
            width: calc(80vw - 136px);
            .title{
              text-overflow: ellipsis;
              white-space: nowrap;
              overflow: hidden;
            }
          }
          .play{  
            text-align: center;
            width: 40px;
            height: 40px;
            border-radius: 100px;
            cursor: pointer;
            border:none;
            font-size: 30px;
            text-align: center;
            background-color: #00000000;
          }
          .left,.right{
            margin: 0 2vw;
            cursor: pointer;
            font-size: 20px;
            width: 30px;
            height: 30px;
            text-align: center;
            border: none;
            background-color: #00000000;
          }
          img{
            border-radius: 5px;
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
          /* margin: 0 2vw; */
          cursor: pointer;
          font-size: 20px;
          width: 30px;
          height: 30px;
          text-align: center;
          border: none;
          background-color: #00000000;
        }
        .left{
          margin-right: 2vw;
        }
        .right{
          margin-left: 2vw;
        }
      }
      .play{
        margin-top: 5px;
        text-align: center;
        width: 70px;
        height: 70px;
        border-radius: 100px;
        cursor: pointer;
        border:none;
        font-size: 30px;
        text-align: center;
        background-color: #00000000;
      }
    }
    .bar_div{
      display: flex;
      align-items: center;
      border-radius: 30px;
      margin: 0 auto;
      background-color: white;
      height: 4.8px;
      @media screen and (max-width: 1199px) {  
        width: calc(88vw - 20px);
      }
      .bar{
        position: static;
        background-color: blue;
        height: 4.8px;
        border-radius: 20px;
      }
      .bar_cursor{
        -webkit-appearance: none;    
        appearance: none;
        cursor: pointer;
        z-index: 10;
        width:300px;
        height: 0;
        position: absolute;
        @media screen and (max-width: 1199px) {  
          width: calc(98vw - 20px);
        }
        
        &:focus{
          outline: none;
        }
        &::-webkit-slider-thumb{
          -webkit-appearance: none;
          background-color: gray;
          width: 13px;
          height: 13px;
          border-radius: 100px;
          border: 3px solid white;
        }
      }
    }
    .volume{
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        text-align: center;
        width: calc(5vw + 30px);
        @media screen and (max-width:1200px) {
          width: calc(25vw + 30px);
        }
      }
      button{
        font-size: 25px;
        width: 40px;
        height: 40px;
        transition: all ease 0.3s;
        background-color: #00000000;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-around;
      }
      .addplaylist{
        font-size: 20px;
        width: 40px;
        height: 40px;
        transition: all ease 0.3s;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-left: 20px;
        .dot{
          width: 6px;
          height: 6px;
          background-color: white;
          border-radius: 20px;
        }
      }
    }
  }
`

export const ExtensionMode_mobile = styled.div`
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
    margin-top: 50px;
    width: 100%;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    align-items: end;
    .texts{
      margin-top: 20px;
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
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .left , .right{
          /* margin: 0 9vw; */
          cursor: pointer;
          font-size: 20px;
          background-color: #00000000;
          width: 50px;
          height: 50px;
          text-align: center;
          border: none;
          border-radius: 300px;
        }
        .left{
          margin-right: 9vw;
        }
        .right{
          margin-left: 9vw;
        }
      }
    }
    .play{
      text-align: center;
      width: 90px;
      height: 90px;
      border-radius: 100px;
      cursor: pointer;
      border:none;         
      background-color: #00000000;
      font-size: 33px;
      text-align: center;
    }
  }
`

export const Main_smaller = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  .addplaylist{
    font-size: 20px;
    transition: all ease 0.3s;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding:10px;
    .dot{
      width: 5px;
      height: 5px;
      background-color: white;
      border-radius: 20px;
    }
  }
  .play{
    text-align: center;
    width: 70px;
    color:white;
    height: 70px;
    border-radius: 100px;
    cursor: pointer;
    border:none;
    font-size: 30px;
    text-align: center;
    background-color: #00000000;
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
    writing-mode: vertical-lr;
    height: 20vh;
  }
`