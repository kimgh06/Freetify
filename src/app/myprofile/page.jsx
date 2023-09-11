"use client";
import Navi from "@/components/nav";
import * as S from './style';
import axios from "axios";
import { useEffect, useState } from "react";
import AritstProfile from "@/components/artistprofile";

const spotifyUrl = 'https://api.spotify.com/v1';

export default function asdf() {
  const [infos, setinfos] = useState(null);
  const [myFollowings, setMyFollowings] = useState([]);
  const getInfos = async e => {
    await axios.get(`${spotifyUrl}/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data);
        setinfos(e.data);
        getMyFollowings();
      }).catch(e => {
        console.log(e);
      })
  }
  const getMyFollowings = async e => {
    await axios.get(`${spotifyUrl}/me/following?type=artist&limit=5`, { headers: { Authorization: `Bearer ${localStorage.getItem('access')}` } })
      .then(e => {
        console.log(e.data.artists.items);
        setMyFollowings(e.data.artists.items);
      }).catch(err => {
        console.log(err);
      })
  }
  useEffect(e => {
    getInfos();
  }, []);
  return <S.Profile>
    <Navi />
    {
      infos ? <div className="profile">
        <h1>{infos?.images[2] ? <img src={infos.images[2]} alt="img" /> :
          <div className="imgs">
            <svg role="img" height="80" width="80" aria-hidden="true" data-testid="user-icon" viewBox="0 0 16 16" data-encore-id="icon" ><path d="M6.233.371a4.388 4.388 0 0 1 5.002 1.052c.421.459.713.992.904 1.554.143.421.263 1.173.22 1.894-.078 1.322-.638 2.408-1.399 3.316l-.127.152a.75.75 0 0 0 .201 1.13l2.209 1.275a4.75 4.75 0 0 1 2.375 4.114V16H.382v-1.143a4.75 4.75 0 0 1 2.375-4.113l2.209-1.275a.75.75 0 0 0 .201-1.13l-.126-.152c-.761-.908-1.322-1.994-1.4-3.316-.043-.721.077-1.473.22-1.894a4.346 4.346 0 0 1 .904-1.554c.411-.448.91-.807 1.468-1.052zM8 1.5a2.888 2.888 0 0 0-2.13.937 2.85 2.85 0 0 0-.588 1.022c-.077.226-.175.783-.143 1.323.054.921.44 1.712 1.051 2.442l.002.001.127.153a2.25 2.25 0 0 1-.603 3.39l-2.209 1.275A3.25 3.25 0 0 0 1.902 14.5h12.196a3.25 3.25 0 0 0-1.605-2.457l-2.209-1.275a2.25 2.25 0 0 1-.603-3.39l.127-.153.002-.001c.612-.73.997-1.52 1.052-2.442.032-.54-.067-1.097-.144-1.323a2.85 2.85 0 0 0-.588-1.022A2.888 2.888 0 0 0 8 1.5z"></path></svg>
          </div>
        }{infos?.display_name} ({infos?.country})</h1>
        <h2 onClick={e => navigator.clipboard.writeText(infos?.id)}>{infos?.id}</h2>
        <h2> 요금제 : {infos?.product}</h2>
        <div className="following">
          <h2>My Followings</h2>
          {myFollowings?.length !== 0 && myFollowings.map((i, n) => <AritstProfile
            followers={i?.followers.total} popularity={i?.popularity}
            id={i?.id} img={i?.images[2]} name={i?.name} key={n} />)}</div>
      </div> : <h1>Loading...</h1>
    }
  </S.Profile>;
}
