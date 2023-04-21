import { AnimatePresence, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { IGetMoviesResult, IMovieVideo, movieApi } from "../api";
import BigCenterBox from "../Components/BigCenterBox";
import Slider, { NEXFLIX_LOGO_URL } from "../Components/Slider";
import { makeImagePath } from "../utils";

export const Wrapper = styled.div<{ centerBox: boolean }>``;

export const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  padding: 0 3%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.7),
      rgba(0, 0, 0, 0)
    ),
    url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  user-select: none;
`;

export const BannerInfo = styled.div`
  width: 30%;
`;

export const Title = styled.h2`
  font-size: 3em;
  font-weight: 600;
  margin-bottom: 2%;
`;

export const Overview = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 7;
  overflow: hidden;
  font-size: 1.8em;
  font-weight: 300;
  line-height: 1.5em;
`;

export const Video = styled.iframe`
  width: 40%;
  height: 50%;
  margin-right: 10%;
  border-radius: 0.3em;
`;

export const SliderWrapper = styled.div`
  position: relative;
  top: -130px;
`;

function Home() {
  const [bannerIndex, setBannerIndex] = useState<number>();
  const [bannerVideoKey, setBennerVideoKey] = useState("");

  const { scrollY } = useViewportScroll();
  useEffect(() => {
    scrollY.onChange(() => {
      console.log("home1", scrollY.get());
      console.log("home2", window.scrollY);
    });
  }, [scrollY]);

  const { data: nowPlayingData, isLoading: nowPlayingIsLoading } =
    useQuery<IGetMoviesResult>(
      ["movies", "nowPlaying"],
      movieApi.getNowPlaying
    );
  const { data: popularData, isLoading: popularIsLoading } =
    useQuery<IGetMoviesResult>(["movies", "popular"], movieApi.getPopular);
  const { data: topRatedData, isLoading: topRatedIsLoading } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], movieApi.getTopRated);
  const { data: upcomingData, isLoading: upcomingIsLoading } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], movieApi.getUpcoming);
  const { data: bannerVideoData } = useQuery<IMovieVideo | null>(
    ["movies", "bannerVideo"],
    () => movieApi.getVideos(nowPlayingData?.results[bannerIndex || 0].id),
    {
      enabled: bannerIndex !== undefined,
    }
  );

  const bigMovieMatch = useRouteMatch<{ dataId: string; slideId: string }>(
    "/movies/:slideId/:dataId"
  );

  const loading =
    nowPlayingIsLoading ||
    popularIsLoading ||
    topRatedIsLoading ||
    upcomingIsLoading;

  useEffect(() => {
    if (nowPlayingData) {
      setBannerIndex(Math.floor(Math.random() * nowPlayingData.results.length));
    }
  }, [nowPlayingData]);

  useEffect(() => {
    setBennerVideoKey("");
    if (bannerVideoData) {
      const videoArray = bannerVideoData.results.filter((video) =>
        video.name.includes("예고편")
      );
      if (videoArray.length > 0) {
        setBennerVideoKey(videoArray[0].key);
      }
    }
  }, [bannerVideoData]);

  return (
    <>
      {loading && <Loader>Loading...</Loader>}
      {!loading && (
        <Wrapper centerBox={!!bigMovieMatch}>
          <Banner
            bgphoto={
              bannerIndex
                ? (nowPlayingData?.results[bannerIndex].backdrop_path &&
                    makeImagePath(
                      nowPlayingData.results[bannerIndex].backdrop_path
                    )) ??
                  NEXFLIX_LOGO_URL
                : NEXFLIX_LOGO_URL
            }
          >
            <BannerInfo>
              <Title>
                {bannerIndex && nowPlayingData?.results[bannerIndex].title}
              </Title>
              <Overview>
                {bannerIndex && nowPlayingData?.results[bannerIndex].overview}
              </Overview>
            </BannerInfo>
            {bannerVideoKey && (
              <Video
                src={`https://www.youtube.com/embed/${bannerVideoKey}?autoplay=1&mute=0`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              ></Video>
            )}
          </Banner>
          <SliderWrapper>
            <Slider
              title="NowPlaying Movie"
              datas={nowPlayingData}
              sliderid={"now_playing"}
            />
            <Slider
              title="Popular Movie"
              datas={popularData}
              sliderid={"popular"}
            />
            <Slider
              title="Upcoming Movie"
              datas={upcomingData}
              sliderid={"upcoming"}
            />
            <Slider
              title="Top Rated Movie"
              datas={topRatedData}
              sliderid={"top_rated"}
            />
          </SliderWrapper>
          <AnimatePresence>{bigMovieMatch && <BigCenterBox />}</AnimatePresence>
        </Wrapper>
      )}
    </>
  );
}
export default Home;

// 메인화면에 유튜브영상 삽입 or 배너사진을 영상으로 대체
