import * as S from './style';

export default function AritstProfile({ id, name, popularity, img, followers }) {
  return <S.Profile onClick={e => {
    console.log(id, popularity, followers)
    if (img?.height > 300) {

    } else {
      window.location.href = `/artist/${id}`;
    }
  }} style={{
    display: img?.height > 300 ? 'block' : 'flex',
    margin: img?.height > 300 ? 'auto' : '0',
  }}>
    {img ? <img style={{ width: img?.height, height: img?.height }} src={img.url} alt="img" /> : <span>no image</span>}
    <div style={{
      fontSize: img?.height > 300 ? '40px' : '16px',
      fontWeight: img?.height > 300 ? 'bold' : 'normal'
    }}>
      {name}
    </div>
    {img?.height > 300 && <p>{followers} followers</p>}
  </S.Profile>;
}