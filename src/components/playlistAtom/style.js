import { styled } from "styled-components";

export const PlayAtom = styled.div`
  margin: auto;
  margin-top: 10px;
  text-align: left;
  display: flex;
  color: black;
  width: 36vw;
  min-width: 360px;
  border: 4px solid lightgray;
  padding: 5px 10px;
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
    min-width: 200px;
    .title{
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      &:hover{
        text-decoration-line: underline;
      }
    }
    .orange{
      color: orange;
    }
    .active{
      color: lightblue;
    }
  }
  .foo{
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding-right: 2vw;
    .artist{
      display: block;
      cursor: pointer;
      &:hover{
        text-decoration-line: underline;
      }
    }
    button{
      margin-top: -5px;
      cursor: pointer;
      width: 25px;
      height: 25px;
    }
  }
  .audio{
    text-align: right;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
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
        display: flex;
        justify-content: center;
        &:hover{
          background-color: lightgray;
        }
        transition: ease 0.2s all;
      }
      .floating{
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
        text-align: left;
        margin-left: -320px;
        margin-top: -80px;
        max-height: 100px;
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
          }
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

export const PlayButton = styled.button`
  cursor: pointer;
  font-size:25px;
  min-width: 40px;
  min-height: 40px;
  text-align: center;
`

export const LikedButton = styled.button`
  cursor: pointer;
  font-size:20px;
  /* min-width: 40px; */
  /* min-height: 40px; */
  text-align: center;
  background-color: rgba(0,0,0,0);
  border: none;
`