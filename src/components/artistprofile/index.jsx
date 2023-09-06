import * as S from './style';

export default function AritstProfile({ id, name, popularity, img, followers }) {
  return <S.Profile onClick={e => {
    console.log(id, popularity, followers)
  }}>
    {img ? <img src={img} alt="img" /> : <span>no image</span>}
    <div>
      {name}
    </div>
  </S.Profile>;
}