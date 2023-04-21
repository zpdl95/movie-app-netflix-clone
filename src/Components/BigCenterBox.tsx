import { motion } from "framer-motion";
import { useQuery } from "react-query";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetTVResult, movieApi, tvApi } from "../api";
import { movieGenres } from "../movieGenres";
import { makeImagePath } from "../utils";
import { NEXFLIX_LOGO_URL } from "./Slider";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Overlay = styled(motion.div)`
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  position: fixed;
`;

const BigMovie = styled(motion.div)`
  width: 70%;
  height: 95%;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 0.3em;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
  position: relative;
`;

const BigCover = styled.div<{ bgPhoto: string }>`
  height: 50%;
  width: 100%;
  background-size: cover;
  background-position: center;
  background-image: linear-gradient(
      to top,
      ${(props) => props.theme.black.lighter},
      transparent,
      transparent,
      transparent,
      transparent
    ),
    url(${(props) => props.bgPhoto});
`;

const BigPoster = styled.img`
  height: 35%;
  border-radius: 5px;
  box-shadow: 0px 3px 8px red;
  position: absolute;
  top: 5%;
  left: 5%;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  font-size: 2.5em;
  padding: 0.5em;
  top: 40%;
`;

const BigInfo = styled.div`
  padding: 0.5em 2em;
  display: flex;
  justify-content: space-between;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 1.5em;
`;

const BigEpisode = styled.div``;

const BigEpisodeTitle = styled.div`
  background-color: ${(props) => props.theme.black.veryDark};
  padding: 0.5em 1em;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  display: flex;
  justify-content: space-around;
`;

const BigEpisodeDetail = styled.details`
  background-color: ${(props) => props.theme.black.darker};
  padding: 0.5em 1em;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Episode = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  place-items: center;
  border-top: 1px dashed rgba(255, 255, 255, 0.3);
  color: rgba(255, 255, 255, 0.5);
  margin-top: 0.3em;
  padding-top: 0.3em;
`;

interface IDetailsData {
  runtime: number | null;
  episode_run_time: number[];
  number_of_seasons: number;
  number_of_episodes: number;
  seasons: {
    air_date: string;
    episode_count: number;
    name: string;
    season_number: number;
  }[];
}

interface IDetailSeasonData {
  air_date: string;
  episodes: {
    air_date: string;
    episode_number: number;
    name: string;
    overview: string;
  }[];
}

function BigCenterBox() {
  const location = useLocation<{ sliderData: IGetTVResult }>();
  const history = useHistory();
  const bigLocationMatch = useRouteMatch<{
    location: string;
    slideId: string;
    dataId: string;
  }>("/:location/:slideId/:dataId");
  const { data: detailsData, isLoading: detailsIsLoading } =
    useQuery<IDetailsData | null>(
      [bigLocationMatch?.params.location, "Details"],
      () =>
        bigLocationMatch?.params.location === "movies"
          ? movieApi.getDetails(bigLocationMatch?.params.dataId)
          : bigLocationMatch?.params.location === "tvs"
          ? tvApi.getDetails(bigLocationMatch?.params.dataId)
          : bigLocationMatch?.params.location === "search"
          ? bigLocationMatch?.params.slideId === "movie"
            ? movieApi.getDetails(bigLocationMatch?.params.dataId)
            : tvApi.getDetails(bigLocationMatch?.params.dataId)
          : null
    );

  const seasonNumbers = detailsData?.seasons?.map((s) => s.season_number);

  const { data: detailSeasonData, isLoading: detailSeasonIsLoading } = useQuery<
    IDetailSeasonData[] | null
  >(
    [bigLocationMatch?.params.location, "Details", "Season"],
    () => tvApi.getSeasons(bigLocationMatch?.params.dataId, seasonNumbers),
    {
      enabled: !!detailsData?.seasons,
    }
  );

  const tvShowsMatch = useRouteMatch("/tvs/:slideId/:dataId");
  const searchTvShowsMatch = useRouteMatch("/search/tv/:dataId");

  const datas = location?.state?.sliderData;

  /* 영화를 클릭했을때 url에 있는 id와 같은 id를 가진 데이터를 찾음 */
  const clickedData =
    bigLocationMatch?.params.dataId &&
    datas.results.find((d) => d.id === +bigLocationMatch?.params.dataId);

  const onOverlayClicked = () => {
    // "/movies..." -> "/" & "/tvs..." -> "/tvs"
    switch (bigLocationMatch?.params.location) {
      case "movies":
        history.push("/");
        break;
      case "tvs":
        history.push("/tvs");
        break;
      case "search":
        history.push("/search");
        break;
    }
  };

  const loading = detailsIsLoading && detailSeasonIsLoading;

  return (
    <Wrapper>
      <Overlay
        onClick={onOverlayClicked}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <BigMovie
        layoutId={
          `${bigLocationMatch?.params.slideId}` +
          `${bigLocationMatch?.params.dataId}`
        }
      >
        {clickedData && (
          <>
            <BigCover
              bgPhoto={
                clickedData.backdrop_path
                  ? makeImagePath(clickedData.backdrop_path, "w1280")
                  : NEXFLIX_LOGO_URL
              }
            />
            <BigPoster src={makeImagePath(clickedData.poster_path, "w500")} />
            <BigTitle>{clickedData.title || clickedData.name}</BigTitle>
            {!loading ? (
              <BigInfo>
                <span>
                  {clickedData.release_date || clickedData.first_air_date}
                </span>
                <span>
                  {detailsData?.runtime === 0
                    ? "00"
                    : detailsData?.runtime ||
                      detailsData?.episode_run_time[0] ||
                      "00"}
                  분
                </span>
                <span>
                  {clickedData.genre_ids.map((i: number) =>
                    movieGenres.map((g) => g.id === i && `${g.name} `)
                  )}
                </span>
                <span>⭐{clickedData.vote_average}</span>
                <span>🧡{clickedData.vote_count}</span>
              </BigInfo>
            ) : (
              "Loading..."
            )}
            <BigOverview>{clickedData.overview}</BigOverview>
            {(tvShowsMatch?.isExact || searchTvShowsMatch?.isExact) &&
              (!loading ? (
                <BigEpisode>
                  <BigEpisodeTitle>
                    <span>회차 목록</span>
                    <span>시즌 수: {detailsData?.number_of_seasons}</span>
                    <span>
                      총 에피소드 수: {detailsData?.number_of_episodes}
                    </span>
                  </BigEpisodeTitle>
                  {detailsData?.seasons?.map((s, index) => (
                    <BigEpisodeDetail key={index}>
                      <summary
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <div>{s.name}</div>
                        <div>에피소드 수 : {s.episode_count}</div>
                        <div>{s.air_date ? s.air_date : "coming soon"}</div>
                      </summary>
                      {detailSeasonData
                        ?.at(index)
                        ?.episodes?.map((episode, index) => (
                          <Episode key={index}>
                            <span
                              style={{
                                justifySelf: "end",
                                marginRight: "50%",
                              }}
                            >
                              {episode.episode_number}
                            </span>
                            <span>{episode.name}</span>
                            <span>{episode.air_date}</span>
                          </Episode>
                        ))}
                    </BigEpisodeDetail>
                  ))}
                </BigEpisode>
              ) : (
                "Loading..."
              ))}
          </>
        )}
      </BigMovie>
    </Wrapper>
  );
}
export default BigCenterBox;

// 현재 위치에 따라 history.push("/") or history.push("/tvs") or history.push("/search")
// ↑ 처럼 만들게 되면 오버레이를 클릭해도 화면이 움직이지 않음

/*layoutId를 사용해서 애니메이션으로 css값을 변경했다면 그 값이 같은 layoutId를
가진 컴포넌트가 그대로 이어받음*/
/* 슬라이더에 box가 borderradius값을 변경하는 애니메이션을 사용하니
bigComponent의 borderradius값도 따라서 변경됨 */
/* 아마 이어받은 컴포넌트가 새로이 같은 종류의 css를 변경하려면 애니메이션을
사용해야 할것 같음 */
