import * as S from './style';

export default function AritstProfile({ id, name, popularity, img, followers }) {
  function addcommas() {
    let f = followers.toString();
    let string = [];
    let s = '';
    for (let i = 1; i <= f.length; i++) {
      if ((i - 1) % 3 == 0 && i > 1) { //3의 배수 일때만
        string.splice(0, 0, f[f.length - i] + ',')
      } else {
        string.splice(0, 0, f[f.length - i])
      }
    }
    for (let i = 0; i < f.length; i++) {
      s += string[i];
    }
    return s;
  }
  return <S.Profile onClick={e => {
    if (img?.height < 300) {
      window.location.href = `/artist/${id}`;
    }
  }} style={{
    display: img?.height >= 300 ? 'block' : 'flex',
    margin: img?.height >= 300 ? 'auto' : '0',
    width: img?.height
  }}>
    {img ? <img style={{ width: img?.height, height: img?.height }} src={img.url} alt="img" /> : <span>no image</span>}
    <div style={{
      fontSize: img?.height > 300 ? '40px' : '16px',
      fontWeight: img?.height > 300 ? 'bold' : 'normal'
    }}>
      {name}
    </div>
    {img?.height > 300 && <p>{addcommas()} followers</p>}
  </S.Profile >;
}