import { styled } from "styled-components";

export const A_Genre = styled.div`
  font-size: 18px;
  background-color: lightgray;
  display: flex;
  padding: 5px;
  border-radius: 20px;
  margin-bottom: 10px;
  &+&{
    margin-left: 20px;
  }
`